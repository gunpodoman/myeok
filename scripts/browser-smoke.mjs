import http from 'node:http';
import { spawn } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import os from 'node:os';
import path from 'node:path';
const root = path.resolve(process.cwd());
const dist = path.join(root, 'dist');
const captureBaseline = process.argv.includes('--capture-baseline');
const captureUi = process.argv.includes('--capture-ui');
const artifactDir = path.join(root, '.agent', captureBaseline ? 'browser-tts-baseline' : 'verification');
const devMode = process.argv.includes('--dev');
const existingAppUrl=process.argv.find(x=>x.startsWith('--app-url='))?.slice('--app-url='.length);
const artifactPrefix = existingAppUrl ? 'bat-' : devMode ? 'dev-' : '';
const downloadDir = path.join(artifactDir, `${artifactPrefix}downloads`);
const samplePackText = await readFile(path.join(root, 'tests', 'fixtures', 'question-engine-sample-pack.json'), 'utf8');
const chromeCandidates = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
].filter(Boolean);
const chromePath = chromeCandidates.find(existsSync);

if (!chromePath) throw new Error('Chrome 또는 Edge 실행 파일을 찾지 못했습니다.');
if (!devMode && !existingAppUrl && !existsSync(path.join(dist, 'index.html'))) throw new Error('dist가 없습니다. 먼저 npm run build를 실행하세요.');

if (!path.resolve(downloadDir).startsWith(path.resolve(artifactDir)+path.sep)) throw new Error('Unsafe download cleanup path');
await rm(downloadDir, { recursive: true, force: true });
await mkdir(downloadDir, { recursive: true });
const profileDir = await mkdtemp(path.join(os.tmpdir(), 'myeok-browser-smoke-'));
const report = { checks: [], consoleErrors: [], pageErrors: [], screenshots: [], download: null };
report.browserExecutable=chromePath;
report.mode = existingAppUrl ? 'actual-bat-app' : devMode ? 'vite-dev' : 'production-dist';
const step = name => console.log(`[browser-smoke] ${name}`);
const check = (name, value, detail = '') => {
  if (!value) throw new Error(`${name} 실패${detail ? `: ${detail}` : ''}`);
  report.checks.push({ name, ok: true, detail });
};

const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8', '.png': 'image/png', '.webm': 'audio/webm'
};

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
function storedZipEntries(bytes) {
  const entries = new Map();
  let offset = 0;
  while (offset + 30 <= bytes.length && bytes.readUInt32LE(offset) === 0x04034b50) {
    if (bytes.readUInt16LE(offset + 8) !== 0 || (bytes.readUInt16LE(offset + 6) & 8)) throw new Error('Expected stored ZIP without descriptors');
    const size = bytes.readUInt32LE(offset + 18);
    const nameLength = bytes.readUInt16LE(offset + 26);
    const extraLength = bytes.readUInt16LE(offset + 28);
    const start = offset + 30 + nameLength + extraLength;
    if (start + size > bytes.length) throw new Error('Truncated ZIP entry');
    entries.set(bytes.toString('utf8', offset + 30, offset + 30 + nameLength), bytes.subarray(start, start + size));
    offset = start + size;
  }
  if (!entries.size) throw new Error('Empty ZIP');
  return entries;
}
let server = null;
let vite = null;
let viteStdout = '';
let viteStderr = '';
let appUrl;

if(existingAppUrl) {
  const target=new URL(existingAppUrl);
  if(!['localhost','127.0.0.1'].includes(target.hostname)||target.protocol!=='http:')throw new Error('External smoke target must be loopback HTTP');
  appUrl=target.origin+'/';
  check('실제 BAT 웹 서버 응답',(await fetch(appUrl)).ok);
  check('실제 BAT classic runtime 무변환',(await fetch(appUrl+'runtime.js').then(x=>x.text())).startsWith("'use strict';"));
} else if (devMode) {
  step('Vite 개발 서버 시작');
  const viteBin = path.join(root, 'node_modules', 'vite', 'bin', 'vite.js');
  const devPort = 8766;
  vite = spawn(process.execPath, [viteBin, '--host', '127.0.0.1', '--port', String(devPort), '--strictPort'], {
    cwd: root,
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true
  });
  vite.stdout.on('data', chunk => { viteStdout += chunk.toString(); });
  vite.stderr.on('data', chunk => { viteStderr += chunk.toString(); });
  appUrl = `http://127.0.0.1:${devPort}/`;
  const deadline = Date.now() + 20000;
  let ready = false;
  while (Date.now() < deadline && !ready) {
    if (vite.exitCode !== null) throw new Error(`Vite가 시작 중 종료되었습니다.\n${viteStdout}\n${viteStderr}`);
    try { ready = (await fetch(appUrl)).ok; } catch { /* retry */ }
    if (!ready) await sleep(100);
  }
  await sleep(250);
  if (vite.exitCode !== null) throw new Error(`Vite가 시작 직후 종료되었습니다.\n${viteStdout}\n${viteStderr}`);
  check('Vite 개발 서버 응답', ready, `${viteStdout}\n${viteStderr}`);
  const runtimeText = await fetch(`${appUrl}runtime.js`).then(response => response.text());
  check('classic runtime 무변환 제공', runtimeText.startsWith("'use strict';") && !runtimeText.includes('/@vite/client'));
  check('PHASE 1 모듈 제공', await fetch(`${appUrl}phase1/index.js`).then(response => response.ok));
} else {
  server = http.createServer(async (request, response) => {
  try {
    const requestPath = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
    const relative = requestPath === '/' ? 'index.html' : requestPath.replace(/^\/+/, '');
    let file = path.resolve(dist, relative);
    if (!file.startsWith(`${dist}${path.sep}`) && file !== path.join(dist, 'index.html')) throw new Error('invalid path');
    if (!existsSync(file) || path.extname(file) === '') file = path.join(dist, 'index.html');
    const body = await readFile(file);
    response.writeHead(200, { 'content-type': types[path.extname(file).toLowerCase()] || 'application/octet-stream', 'cache-control': 'no-store' });
    response.end(body);
  } catch {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('Not found');
  }
  });

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const { port } = server.address();
  appUrl = `http://127.0.0.1:${port}/`;
}

const chrome = spawn(chromePath, [
  process.argv.includes('--headed') ? '' : '--headless=new', '--no-sandbox', '--disable-gpu', '--disable-gpu-sandbox', '--disable-gpu-shader-disk-cache',
  '--disable-features=SkiaGraphite,Vulkan', '--no-first-run', '--no-default-browser-check', '--no-proxy-server',
  '--disable-backgrounding-occluded-windows', '--disable-renderer-backgrounding', '--disable-background-timer-throttling',
  '--remote-debugging-pipe', `--user-data-dir=${profileDir}`, '--window-size=1440,1000',
  '--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream',
  '--autoplay-policy=no-user-gesture-required', 'about:blank'
].filter(Boolean), { stdio: ['ignore', 'pipe', 'pipe', 'pipe', 'pipe'], windowsHide: !process.argv.includes('--headed') });
let chromeStdout = '';
let chromeStderr = '';
chrome.stdout.on('data', chunk => { chromeStdout += chunk.toString(); });
chrome.stderr.on('data', chunk => { chromeStderr += chunk.toString(); });
chrome.on('exit', (code, signal) => {
  report.chromeExit = { code, signal, stderr: chromeStderr.slice(-4000), stdout: chromeStdout.slice(-1000) };
});

let nextId = 0;
let pageSessionId = null;
const pending = new Map();
const events = new Map();
function on(method, listener) {
  const list = events.get(method) || [];
  list.push(listener);
  events.set(method, list);
}
function send(method, params = {}, usePageSession = true) {
  return new Promise((resolve, reject) => {
    if(chrome.exitCode!==null||chrome.signalCode!==null) {reject(new Error(`Browser exited before ${method}: ${chromeStderr.slice(-1200)}`));return;}
    const id = ++nextId;
    const timer = setTimeout(() => {
      pending.delete(id);
      reject(new Error(`CDP 명령 시간 초과: ${method}`));
    }, 20000);
    pending.set(id, {
      method,
      resolve: value => { clearTimeout(timer); resolve(value); },
      reject: error => { clearTimeout(timer); reject(error); }
    });
    const message = { id, method, params };
    if (usePageSession && pageSessionId) {
      const wrapper = {
        id: ++nextId,
        method: 'Target.sendMessageToTarget',
        params: { sessionId: pageSessionId, message: JSON.stringify(message) }
      };
      chrome.stdio[3].write(`${JSON.stringify(wrapper)}\0`);
    } else {
      chrome.stdio[3].write(`${JSON.stringify(message)}\0`);
    }
  });
}
async function evaluate(expression) {
  const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true, userGesture: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
  return result.result?.value;
}
async function waitFor(expression, timeout = 12000) {
  const end = Date.now() + timeout;
  let last;
  while (Date.now() < end) {
    try {
      last = await evaluate(expression);
      if (last) return last;
    } catch (error) {
      last = error.message;
    }
    await sleep(100);
  }
  throw new Error(`대기 시간 초과: ${expression}\n마지막 값: ${String(last)}`);
}
async function screenshot(name) {
  const result = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  const file = path.join(artifactDir, `${artifactPrefix}${name}`);
  await writeFile(file, Buffer.from(result.data, 'base64'));
  report.screenshots.push(path.relative(root, file).replaceAll('\\', '/'));
}
async function reloadPage() {
  const previousOrigin=await evaluate('performance.timeOrigin');
  await send('Page.reload');
  await waitFor(`performance.timeOrigin!==${previousOrigin}&&typeof fx!=='undefined'&&Boolean(fx.phase1)&&state.importStatus==='READY'`,20000);
}


try {
  step('Chrome CDP pipe 연결');
  let pipeBuffer = Buffer.alloc(0);
  chrome.stdio[4].on('data', chunk => {
    pipeBuffer = Buffer.concat([pipeBuffer, chunk]);
    let separator;
    while ((separator = pipeBuffer.indexOf(0)) >= 0) {
      const frame = pipeBuffer.subarray(0, separator).toString('utf8');
      pipeBuffer = pipeBuffer.subarray(separator + 1);
      if (!frame) continue;
      let message = JSON.parse(frame);
      if (process.env.CDP_DEBUG === '1') console.log('[cdp]', frame.slice(0, 1000));
      if (message.method === 'Target.receivedMessageFromTarget') {
        message = JSON.parse(message.params.message);
      }
      if (message.id) {
        const waiter = pending.get(message.id);
        if (!waiter) continue;
        pending.delete(message.id);
        if (message.error) waiter.reject(new Error(`${waiter.method}: ${message.error.message}`)); else waiter.resolve(message.result);
        continue;
      }
      for (const listener of events.get(message.method) || []) listener(message.params);
    }
  });
  chrome.once('exit', () => {
    const error = new Error('Chrome이 CDP 검증 중 종료되었습니다.');
    for (const waiter of pending.values()) waiter.reject(error);
    pending.clear();
  });

  let pageTarget;
  for (let attempt = 0; attempt < 200 && !pageTarget; attempt += 1) {
    try {
      const result = await send('Target.getTargets', {}, false);
      pageTarget = result.targetInfos.find(item => item.type === 'page' && item.url === 'about:blank');
    } catch { /* retry */ }
    if (!pageTarget) await sleep(50);
  }
  check('CDP 페이지 연결', Boolean(pageTarget), pageTarget?.url || 'page target 없음');
  report.cdpTarget = { id: pageTarget.targetId, url: pageTarget.url, transport: 'pipe' };
  pageSessionId = (await send('Target.attachToTarget', { targetId: pageTarget.targetId }, false)).sessionId;
  on('Runtime.exceptionThrown', params => report.pageErrors.push(params.exceptionDetails?.exception?.description || params.exceptionDetails?.text));
  on('Runtime.consoleAPICalled', params => {
    if (params.type === 'error') report.consoleErrors.push(params.args?.map(arg => arg.value ?? arg.description).join(' ') || 'console.error');
  });
  on('Log.entryAdded', params => { if (params.entry?.level === 'error') report.consoleErrors.push(params.entry.text); });
  await send('Runtime.enable');
  await send('Page.enable');
  on('Page.javascriptDialogOpening', params => { if (params.type === 'beforeunload') void send('Page.handleJavaScriptDialog', { accept: true }); });
  await send('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: downloadDir, eventsEnabled: true }, false);
  await send('Page.navigate', { url: appUrl });


  step('메인 화면과 질문팩 진입 확인');
  await waitFor("typeof fx !== 'undefined' && Boolean(fx.phase1) && state.importStatus === 'READY' && location.pathname === '/'");
  check('실제 메인 화면',await evaluate("Boolean(document.querySelector('#homeTitle')) && document.querySelector('.home-actions .primary').getAttribute('data-nav')==='/app/packs'"));
  await waitFor("document.querySelector('.home-art-frame img')?.naturalWidth > 0");
  await screenshot('01-home.png');
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await screenshot('home-mobile.png');
  check('모바일 메인 가로 넘침 없음', await evaluate('document.documentElement.scrollWidth <= innerWidth'));
  await send('Emulation.clearDeviceMetricsOverride');
  await evaluate("document.querySelector('.home-actions .primary').click()");
  check('기본 진입과 PHASE 1 부트스트랩', true);
  check('PHASE 1 가져오기 상태 READY', await evaluate("state.importStatus === 'READY'"));
  check('대시보드 메뉴 숨김', await evaluate("!document.querySelector('.side-nav [data-nav=\"/app\"]')"));
  check('정상 준비 배너 숨김', await evaluate("!document.body.innerText.includes('질문팩 기능 준비가 완료')"));
  check('checkpoint 없을 때 복구 안내 없음', await evaluate("!document.querySelector('.checkpoint')"));
  await screenshot('01-packs-empty.png');

  const routes = ['/', '/home', '/product', '/guide', '/privacy', '/terms', '/app', '/app/packs', '/app/history', '/create-pack', '/ai-evaluation'];
  step('핵심 라우트 확인');
  for (const route of routes) {
    await evaluate(`go(${JSON.stringify(route)})`);
    check(`라우트 ${route}`, await waitFor("document.querySelector('#app')?.innerText.trim().length > 20"));
    if (captureBaseline || captureUi) await screenshot(`route-${route.replaceAll('/', '_')}.png`);
    if (route === '/create-pack') await screenshot('01b-create-pack.png');
    if (route === '/home') check('Home 별칭/SVG 로드', await waitFor("document.querySelector('.home-art-frame img')?.naturalWidth > 0"));
  }

  step('첫 Pack 가져오기');
  await evaluate("go('/app/import')");
  await waitFor("Boolean(document.querySelector('#useDemo'))");
  check('가져오기 호환 경로는 질문팩으로', await evaluate("location.pathname === '/app/packs'"));
  await reloadPage();
  await waitFor("typeof fx !== 'undefined' && Boolean(fx.phase1) && location.pathname === '/app/packs'");
  check('가져오기 딥링크 새로고침', await evaluate("state.importStatus === 'READY'"));
  await evaluate("document.querySelector('#useDemo').click()");
  check('데모 Pack 검증', await waitFor("document.querySelector('#savePack') && state.importStatus === 'VALID'"));
  await screenshot('02-import-valid.png');
  await evaluate("document.querySelector('#savePack').click()");
  await waitFor("location.pathname === '/app/packs' && Boolean(document.querySelector('.selected-pack'))");
  check('첫 Pack 저장', (await evaluate("fx.phase1.snapshot().then(x => x.packs.length)")) === 1);

  step('설정 영속성 확인');
  await evaluate("go('/app/setup')");
  if (captureBaseline || captureUi) await screenshot('setup.png');
  await waitFor("Boolean(document.querySelector('#voiceRate0'))");
  await evaluate(`document.querySelector('.voice-details').open=true;
    const change=(id,value)=>{const input=document.getElementById(id);input.value=value;input.dispatchEvent(new Event('input',{bubbles:true}));};
    change('voiceGender0','male');change('voiceStyle0','firm');change('voiceRate0','1.15');change('voicePitch0','0.85');
    change('voiceGender1','female');change('voiceStyle1','warm');change('voiceRate1','0.9');`);
  report.voices=await evaluate("fxKoreanVoices().map(v=>({name:v.name,lang:v.lang,local:v.localService,uri:v.voiceURI}))");
  check('실제 한국어 목소리만 표시', await evaluate("Array.from(document.querySelector('#voiceName0').options).every(o=>!o.value||fxKoreanVoices().some(v=>v.voiceURI===o.value))"));
  await evaluate("document.querySelector('.voice-settings').scrollIntoView({behavior:'instant',block:'start'})");
  await screenshot('voice-settings.png');
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await evaluate("document.querySelector('.voice-settings').scrollIntoView({behavior:'instant',block:'start'})");
  await screenshot('voice-mobile.png');
  check('모바일 음성 설정 넘침 없음', await evaluate('document.documentElement.scrollWidth <= innerWidth'));
  check('모바일 메뉴 유지', await evaluate("getComputedStyle(document.querySelector('.sidebar')).display !== 'none'"));
  await send('Emulation.clearDeviceMetricsOverride');
  await evaluate("scrollTo({top:0,behavior:'instant'})");
  if (process.argv.includes('--native-voice-check')) {
    step('실제 기본 TTS 미리 듣기 이벤트 확인');
    await evaluate("document.querySelector('[data-voice-preview=\"0\"]').scrollIntoView({behavior:'instant',block:'center'})");
    const point=await evaluate("(()=>{const r=document.querySelector('[data-voice-preview=\"0\"]').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()");
    await send('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...point});
    await send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...point});
    await waitFor("fx.previewIndex===0 || document.querySelector('[data-voice-preview-status=\"0\"]').innerText.length>0");
    await waitFor("fx.previewIndex===undefined && document.querySelector('[data-voice-preview-status=\"0\"]').innerText.length>0",20000);
    report.nativeVoice={status:await evaluate("document.querySelector('[data-voice-preview-status=\"0\"]').innerText"),diagnostic:await evaluate('fx.speechDiagnostic'),mode:process.argv.includes('--headed')?'headed':'headless'};
    report.nativeVoice.completed=report.nativeVoice.status.includes('끝났습니다');
    // Native audio availability is reported separately from the functional checks.
    await screenshot('native-voice-result.png');
    await evaluate("scrollTo({top:0,behavior:'instant'})");
  }
  await waitFor("document.querySelector('[data-preset=HARD]')");
  await evaluate("document.querySelector('[data-preset=HARD]').click()");
  await waitFor("fx.config?.preset === 'HARD'");
  await sleep(250);
  await reloadPage();
  await waitFor("typeof fx !== 'undefined' && Boolean(fx.phase1) && fx.config?.preset === 'HARD'");
  check('설정 새로고침 유지', true);
  check('면접관별 음성/속도/높낮이 영속성', await evaluate("fx.config.voiceProfiles[0].gender==='male'&&fx.config.voiceProfiles[0].rate===1.15&&fx.config.voiceProfiles[0].pitch===0.85&&fx.config.voiceProfiles[1].style==='warm'"));
  check('프리셋 변경이 녹음/목소리 설정을 덮어쓰지 않음', await evaluate("fx.config.recordingEnabled && fx.config.voiceProfiles[0].style==='firm'"));

  step('질문 엔진 대표 JSON Pack 가져오기');
  await evaluate(`(async () => {
    go('/app/import');
    const text = ${JSON.stringify(samplePackText)};
    await readPack(new File([text], 'question-engine-sample-pack.json', { type: 'application/json' }));
  })()`);
  check('질문 엔진 대표 Pack 검증', await waitFor("Boolean(document.querySelector('#savePack'))"));
  await evaluate("document.querySelector('#savePack').click()");
  await waitFor("fx.packs.length === 2 && location.pathname === '/app/packs'");
  check('질문 엔진 대표 Pack 저장/활성화', (await evaluate("fx.phase1.snapshot().then(x => [x.packs.length, x.activePack?.pack?.target?.university])"))[1] === '샘플대학교');

  step('Pack 활성화 영속성 확인');
  await evaluate("go('/app/packs')");
  await waitFor("document.querySelectorAll('[data-activate-pack]').length === 1");
  await screenshot('03-pack-library.png');
  const priorSha = await evaluate("fx.packs.find(x => x.sha256 !== fx.activePackSha256).sha256");
  await evaluate(`document.querySelector('[data-activate-pack="${priorSha}"]').click()`);
  await waitFor(`fx.activePackSha256 === '${priorSha}'`);
  await reloadPage();
  await waitFor(`typeof fx !== 'undefined' && fx.activePackSha256 === '${priorSha}'`);
  check('활성 Pack 새로고침 유지', true);
  await evaluate("go('/')");
  check('active Pack이 있어도 메인 유지/자동 면접 없음',await evaluate(`location.pathname==='/'&&fx.activePackSha256==='${priorSha}'&&Boolean(document.querySelector('#homeTitle'))&&!fx.activeSession`));

  step('잘못된 Pack 차단 확인');
  const beforeInvalid = await evaluate("fx.packs.length");
  await evaluate(`(async () => {
    go('/app/import');
    await readPack(new File(['{"schema":'], 'broken.json', { type: 'application/json' }));
  })()`);
  check('JSON 구문 오류 구분', await waitFor("document.querySelector('[data-import-error=JSON_PARSING_FAILURE]')"));
  await evaluate(`(async () => {
    go('/app/import');
    const invalid = structuredClone(demoPack);
    invalid.unexpected_phase1_field = true;
    const text = JSON.stringify(invalid);
    await readPack(new File([text], 'invalid-pack.json', { type: 'application/json' }));
  })()`);
  check('잘못된 Pack 차단', await waitFor("!document.querySelector('#savePack') && Boolean(document.querySelector('[data-import-error=SCHEMA_VALIDATION_FAILURE]'))"));
  check('스키마 오류 구분', await evaluate("Boolean(document.querySelector('[data-import-error=SCHEMA_VALIDATION_FAILURE]'))"));
  check('잘못된 Pack 미저장', (await evaluate("fx.phase1.snapshot().then(x => x.packs.length)")) === beforeInvalid);
  await screenshot('04-import-invalid.png');

  step('활성 Pack 삭제 fallback 확인');
  await evaluate("go('/app/packs'); window.confirm = () => true");
  await waitFor("document.querySelectorAll('[data-delete-pack]').length === 2");
  await evaluate("document.querySelector(`[data-delete-pack='${fx.activePackSha256}']`).click()");
  await waitFor("fx.packs.length === 1 && Boolean(fx.activePackSha256)");
  check('활성 Pack 삭제 후 fallback', (await evaluate("fx.phase1.snapshot().then(x => x.packs.length === 1 && x.activePackSha256 === x.packs[0].sha256)")) === true);

  step('세션/결과/내보내기 확인');
  await evaluate(`(async () => {
    fx.config = { ...fx.config, ...fxDefaultConfig('COMFORT'), prepMs: 0, ttsEnabled: false, recordingEnabled: true };
    await fxSaveConfig();
    go('/app/device-test');
  })()`);
  await waitFor("Boolean(document.querySelector('#runDeviceCheck'))");
  if (captureBaseline || captureUi) await screenshot('device.png');
  await evaluate("document.querySelector('#runDeviceCheck').click()");
  check('장치 점검 진입/마이크 확인', await waitFor("fx.device.mic === 'good'", 20000));
  await waitFor("document.querySelector('#startInterviewFromCheck') && !document.querySelector('#startInterviewFromCheck').disabled");
  await evaluate("document.querySelector('#startInterviewFromCheck').click()");
  check('면접 Runtime 진입', await waitFor("location.pathname === '/app/interview' && Boolean(document.querySelector('.interview-shell'))"));
  await waitFor("fx.interview.phase === 'ANSWERING' && document.querySelector('#interviewQuestion').innerText.length > 10");
  check('면접관 번호만 표시', await evaluate("Array.from(document.querySelectorAll('.interview-persona .name')).every(x=>/^면접관 [123]$/.test(x.innerText))"));
  check('면접 메타데이터 숨김', await evaluate("!/(EVIDENCE|OWNERSHIP|TRIGGERED|ROOT|INTERVIEWER_ID)/.test(document.body.innerText)"));
  check('답변 실제 녹음 시작', await evaluate("fx.interview.recorder?.state==='recording' && document.querySelector('#recordingStatus').innerText.includes('녹음 중')"));
  if (captureBaseline || captureUi) await screenshot('interview.png');
  await sleep(1400);
  await evaluate("document.querySelector('#answerCompleteButton').click()");
  await waitFor("fx.activeSession?.questions.length===1 && fx.interview.phase==='ANSWERING' && !fx.interview.busy");
  check('답변 완료 후 실제 Blob checkpoint', await evaluate("fx.phase1.getSession(fx.activeSession.session_id).then(s=>s.questions[0].audio_blob instanceof Blob && s.questions[0].audio_blob.size>0 && s.questions[0].recording.file.endsWith('.webm'))"));
  await reloadPage();
  await waitFor("typeof fx !== 'undefined' && fx.phase1 && location.pathname === '/app/packs' && Boolean(document.querySelector('#resumeInterview'))");
  check('checkpoint가 있을 때 선택 안내/자동 면접 진입 없음', true);
  if (captureUi) await screenshot('checkpoint.png');
  await evaluate("document.querySelector('#prepareNewInterview').click()");
  check('새 면접 준비는 질문팩 유지',await waitFor("location.pathname==='/app/packs'&&!document.querySelector('.checkpoint')&&!fx.activeSession"));
  await reloadPage();
  await waitFor("typeof fx!=='undefined'&&fx.phase1&&Boolean(document.querySelector('#resumeInterview'))");
  check('새 준비 후 기존 답변 비파괴 보존',true);
  await evaluate("document.querySelector('#resumeInterview').click()");
  await waitFor("location.pathname === '/app/interview' && Boolean(fx.activeSession)");
  check('저장된 면접 이어하기', true);
  await waitFor("fx.interview.phase==='ANSWERING' && !fx.interview.busy");
  await sleep(1400);
  await evaluate("window.confirm=()=>true;document.querySelector('#quitInterview').click();document.querySelector('#quitInterview').click()");
  check('중단 세션 결과 저장', await waitFor("location.pathname.startsWith('/app/result/') && document.body.innerText.includes('면접을 종료했습니다')"));
  check('중도 종료가 마지막 답변까지 보존/중복 없음',await evaluate("fx.activeResult.questions.length===2&&fx.activeResult.questions.every(fxHasAudio)&&fx.activeResult.truncated"));
  check('마이크 트랙과 녹음 장치 종료',await evaluate("fx.mediaStream===null&&fx.interview.recorder===null"));
  await waitFor("document.querySelectorAll('[data-answer-audio]').length===2");
  await waitFor("Number.isFinite(document.querySelector('[data-answer-audio]').duration) && document.querySelector('[data-answer-audio]').duration>0 && !document.querySelector('[data-answer-audio]').seeking");
  check('녹음 재생 전 길이 확인/구간 이동 준비',await evaluate("document.querySelector('[data-answer-audio]').currentTime===0"));
  await screenshot('05-result.png');
  const sessionId=await evaluate('fx.activeResult.session_id');
  report.recordings=await evaluate(`Promise.all(fx.activeResult.questions.map(async q=>({file:q.recording.file,mime:q.audio_blob.type,bytes:q.audio_blob.size,sha256:await fxSha256Bytes(await q.audio_blob.arrayBuffer())})))`);
  await reloadPage();
  await waitFor("Boolean(document.querySelector('[data-answer-audio]'))");
  check('새로고침 후 실제 오디오 재생 소스 복구',await evaluate("fx.activeResult.questions.every(fxHasAudio)&&document.querySelector('[data-answer-audio]').src.startsWith('blob:')"));
  const afterReload=await evaluate("Promise.all(fx.activeResult.questions.map(async q=>await fxSha256Bytes(await q.audio_blob.arrayBuffer())))");
  check('새로고침 후 녹음 byte SHA-256 동일',JSON.stringify(afterReload)===JSON.stringify(report.recordings.map(r=>r.sha256)));
  await waitFor("Number.isFinite(document.querySelector('[data-answer-audio]').duration) && !document.querySelector('[data-answer-audio]').seeking");
  report.playback=await evaluate(`(async()=>{
    const player=document.querySelector('[data-answer-audio]');
    return new Promise((resolve,reject)=>{
      const timer=setTimeout(()=>{player.pause();reject(new Error('recording playback timeout'));},10000);
      player.onended=()=>{clearTimeout(timer);resolve({ended:true,currentTime:player.currentTime,readyState:player.readyState});};
      player.onerror=()=>{clearTimeout(timer);reject(new Error('recording playback failed'));};
      player.play().catch(reject);
    });
  })()`);
  check('실제 MediaRecorder 오디오 전체 재생',report.playback.ended && report.playback.currentTime>0);
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await screenshot('result-mobile.png');
  check('모바일 녹음 재생 UI 넘침 없음', await evaluate('document.documentElement.scrollWidth <= innerWidth'));
  await send('Emulation.clearDeviceMetricsOverride');
  await evaluate("document.querySelector('[data-download-audio]').click();document.querySelector('[data-export-audio]').click()");
  await sleep(600);
  const audioDownloads=await (await import('node:fs/promises')).readdir(downloadDir);
  check('개별 녹음/녹음 전체 ZIP 다운로드',audioDownloads.some(n=>n.startsWith('myeok_answer_')&&n.endsWith('.webm')) && audioDownloads.includes(`myeok_recordings_${sessionId}.zip`));
  report.audioDownloads=audioDownloads;
  const individualName = audioDownloads.find(n=>n.startsWith('myeok_answer_')&&n.endsWith('.webm'));
  check('개별 다운로드가 저장 Blob과 byte 동일', sha256(await readFile(path.join(downloadDir, individualName))) === report.recordings[0].sha256);
  const recordingZip = storedZipEntries(await readFile(path.join(downloadDir, `myeok_recordings_${sessionId}.zip`)));
  check('녹음 ZIP의 모든 오디오가 원본과 byte 동일',report.recordings.every(r=>recordingZip.has(r.file)&&sha256(recordingZip.get(r.file))===r.sha256));
  check('녹음 ZIP에 질문과 파일 대응 안내 포함',recordingZip.get('questions.txt')?.toString('utf8').includes('질문 1:')&&report.recordings.every(r=>recordingZip.get('questions.txt').toString('utf8').includes(r.file)));
  await evaluate("go('/app/history')");
  await waitFor(`Boolean(document.querySelector('[data-nav="/app/result/${sessionId}"]'))`);
  await evaluate(`document.querySelector('[data-nav="/app/result/${sessionId}"]').click()`);
  check('기록에서 같은 녹음 복기',await waitFor("document.querySelectorAll('[data-answer-audio]').length===2"));
  const completedCount = await evaluate("fx.phase1.listSessions().then(x => x.filter(s => s.status === 'COMPLETED').length)");
  check('완료 세션 이력 반영', completedCount >= 1);

  await waitFor("Boolean(document.querySelector('[data-export-zip]'))");
  await evaluate("document.querySelector('[data-export-zip]').click()");
  const downloadEnd = Date.now() + 12000;
  let files = [];
  while (Date.now() < downloadEnd) {
    files = (await import('node:fs/promises')).readdir(downloadDir).then(names => names.filter(name => name.startsWith('myeonyeokryeok_result_')&&name.endsWith('.zip')));
    files = await files;
    if (files.length) break;
    await sleep(100);
  }
  check('평가용 ZIP 다운로드', files.length > 0);
  report.download = path.relative(root, path.join(downloadDir, files[0])).replaceAll('\\', '/');
  const evaluationZip = storedZipEntries(await readFile(path.join(downloadDir, files[0])));
  const handoff = JSON.parse(evaluationZip.get('handoff.json').toString('utf8'));
  check('평가 ZIP도 동일한 원본 녹음 포함',report.recordings.every(r=>evaluationZip.has(r.file)&&sha256(evaluationZip.get(r.file))===r.sha256));
  check('HANDOFF 1.1 계약/오디오 파일 참조 유지',handoff.handoff_schema==='INTERVIEW_EVAL_HANDOFF/1.1'&&handoff.questions.length===report.recordings.length&&handoff.questions.every(q=>q.recording.available&&evaluationZip.has(q.recording.file)&&!('audio_blob' in q)));
  report.exportInspection={recordingZip:[...recordingZip.keys()],evaluationZip:[...evaluationZip.keys()],handoffSchema:handoff.handoff_schema,audioBytesIdentical:true};
  step('녹음 끄기/기능 미지원 상태 확인');
  await evaluate("fx.config.recordingEnabled=false;go('/app/device-test')");
  await waitFor("Boolean(document.querySelector('#runDeviceCheck'))");
  await evaluate("document.querySelector('#runDeviceCheck').click()");
  await waitFor("fx.device.mic==='good' && !document.querySelector('#startInterviewFromCheck').disabled");
  await evaluate("document.querySelector('#startInterviewFromCheck').click()");
  await waitFor("fx.interview.phase==='ANSWERING' && !fx.interview.busy");
  check('녹음 끄기 실제 적용',await evaluate("fx.interview.recorder===null&&document.querySelector('#recordingStatus').innerText.includes('꺼짐')"));
  await sleep(300);
  await evaluate('fxCompleteSession(true)');
  await waitFor("location.pathname.startsWith('/app/result/') && Boolean(document.querySelector('#recordingsTitle'))");
  check('미녹음 결과의 정직한 빈 상태',await evaluate("!document.querySelector('[data-answer-audio]')&&document.body.innerText.includes('녹음이 없습니다')"));
  await evaluate("state.resultTab='transcript';fx.config.recordingEnabled=true;go('/app/device-test')");
  await waitFor("Boolean(document.querySelector('#runDeviceCheck'))");
  await evaluate("document.querySelector('#runDeviceCheck').click()");
  await waitFor("fx.device.mic==='good' && !document.querySelector('#startInterviewFromCheck').disabled");
  await evaluate("document.querySelector('#startInterviewFromCheck').click()");
  await waitFor("fx.interview.phase==='ANSWERING' && !fx.interview.busy");
  await sleep(900);
  await evaluate("window.confirm=()=>false;history.back()");
  check('뒤로 가기 취소 시 면접/녹음/답변 버튼 유지',await waitFor("location.pathname==='/app/interview' && fx.interview.recorder?.state==='recording' && !document.querySelector('#answerCompleteButton').disabled && document.querySelector('#recordingStatus').innerText.includes('녹음 중')"));
  await evaluate("window.confirm=()=>true;go('/app/packs')");
  check('화면 이탈 시 마지막 녹음 저장/마이크 해제',await waitFor("location.pathname.startsWith('/app/result/') && fx.activeResult.questions.length===1 && fxHasAudio(fx.activeResult.questions[0]) && fx.mediaStream===null"));
  check('새 면접 결과는 녹음이 보이는 요약으로 시작',await evaluate("state.resultTab==='overview'&&Boolean(document.querySelector('[data-answer-audio]'))"));
  await evaluate("window.actualMediaRecorder=window.MediaRecorder;window.MediaRecorder=undefined;fx.config.recordingEnabled=true;fx.device.mic='good';go('/app/device-test')");
  check('녹음 미지원 시 시작 차단/끄기 안내',await evaluate("document.querySelector('#startInterviewFromCheck').disabled&&document.body.innerText.includes('지원 안 됨')"));
  await evaluate("window.MediaRecorder=window.actualMediaRecorder;go('/app/packs')");
  // Deterministic missing-voice regression; this is not a native output PASS.
  await evaluate("window.actualGetVoices=speechSynthesis.getVoices.bind(speechSynthesis);speechSynthesis.getVoices=()=>[];fx.config.ttsEnabled=true;fx.config.presentationMode='TTS_ONLY';fx.config.recordingEnabled=false;go('/app/device-test')");
  await waitFor("Boolean(document.querySelector('#runDeviceCheck'))");
  await evaluate("document.querySelector('#runDeviceCheck').click()");
  await waitFor("fx.device.mic==='good' && !document.querySelector('#startInterviewFromCheck').disabled");
  await evaluate("document.querySelector('#startInterviewFromCheck').click()");
  await waitFor("fx.interview.phase==='ANSWERING' && !fx.interview.busy");
  check('한국어 목소리 없음(시뮬레이션): 음성 전용도 화면 질문으로 대체',await evaluate("fx.interview.voiceFallback&&!document.querySelector('#interviewQuestion').classList.contains('question-hidden')&&document.querySelector('#interviewStatus').innerText.includes('음성 재생이 안 되어')"));
  await evaluate('fxCompleteSession(true)');
  await waitFor("location.pathname.startsWith('/app/result/') && Boolean(document.querySelector('#recordingsTitle'))");
  check('음성 실패의 실제 표시 모드를 HANDOFF에 기록',await evaluate("fxBuildHandoff(fx.activeResult).questions[0].presentation.mode==='ALWAYS_VISIBLE'"));
  check('출력 시작 없는 TTS를 사용 성공으로 기록하지 않음',await evaluate("fxBuildHandoff(fx.activeResult).questions[0].presentation.tts_used===false"));
  await evaluate("speechSynthesis.getVoices=window.actualGetVoices;go('/app/packs')");
  check('페이지 예외 없음', report.pageErrors.length === 0, report.pageErrors.join(' | '));
  check('콘솔 오류 없음', report.consoleErrors.length === 0, report.consoleErrors.join(' | '));
  if (devMode&&!existingAppUrl) check('Vite 서버가 스모크 동안 유지됨', vite?.exitCode === null, `${viteStdout}\n${viteStderr}`);
  report.ok = true;
} catch (error) {
  report.ok = false;
  report.failure = error.stack || error.message;
  try {
    report.failureState = await evaluate("({path:location.pathname,phase:typeof fx==='undefined'?null:fx.interview.phase,active:typeof fx==='undefined'?null:fx.activeSession?.status,body:document.body.innerText.slice(-2500)})");
    await screenshot('failure.png');
  } catch { /* original failure remains authoritative */ }
  throw error;
} finally {
  step('정리 및 보고서 저장');
  await mkdir(artifactDir, { recursive: true });
  report.vite = devMode ? { stdout: viteStdout.slice(-4000), stderr: viteStderr.slice(-4000), exitCode: vite?.exitCode } : null;
  await writeFile(path.join(artifactDir, `${artifactPrefix}browser-smoke-report.json`), `${JSON.stringify(report, null, 2)}\n`);
  try { chrome.stdio[3].end(); } catch { /* already closed */ }
  chrome.kill();
  await Promise.race([new Promise(resolve => chrome.once('exit', resolve)), sleep(3000)]);
  if (server) {
    server.closeAllConnections?.();
    await Promise.race([new Promise(resolve => server.close(resolve)), sleep(2000)]);
  }
  if (vite) {
    vite.kill();
    await Promise.race([new Promise(resolve => vite.once('exit', resolve)), sleep(3000)]);
  }
  try { await rm(profileDir, { recursive: true, force: true, maxRetries: 4, retryDelay: 250 }); } catch { /* OS가 잠금을 해제하면 임시 폴더가 정리된다. */ }
}

console.log(JSON.stringify({mode:report.mode,ok:report.ok,checks:report.checks.length,report:path.join(artifactDir,`${artifactPrefix}browser-smoke-report.json`)}, null, 2));
