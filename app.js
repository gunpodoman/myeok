const app = document.getElementById('app');

const state = {
  pack: null,
  preset: 'NORMAL',
  resultTab: 'overview',
  interviewIndex: 0,
  interviewPhase: 'question',
  importStatus: 'INITIALIZING',
  importError: null,
  history: [
    { id: 's3', date: '9월 22일', mode: '실전', duration: '10:42', questions: 8, latency: 1.8, silence: 22, cpm: 238 },
    { id: 's2', date: '9월 20일', mode: '기본', duration: '11:08', questions: 9, latency: 2.4, silence: 25, cpm: 246 },
    { id: 's1', date: '9월 18일', mode: '기본', duration: '10:51', questions: 8, latency: 3.2, silence: 31, cpm: 221 }
  ]
};

const demoPack = {
  schema: 'INTERVIEW_PACK/1.0',
  pack_id: 'PACK_DEMO2026',
  generator: { engine_name: '학생부기반_공통_실전면접_질문엔진', engine_version: '1.0', created_at: new Date().toISOString(), language: 'ko-KR' },
  target: { university: '한동대학교', department: 'ICT창업학부', interview_type: 'student_record_based', default_session_minutes: 10 },
  source_record: { available: true, embedded_full_text: false, student_name_included: false },
  record_evidence: Array.from({ length: 18 }, (_, i) => ({
    evidence_id: `E${String(i + 1).padStart(3,'0')}`,
    anchor: `학생부 활동 ${i + 1}`,
    year: (i % 3) + 1,
    category: 'career_activity',
    topic: `면접 근거 ${i + 1}`,
    excerpt: `면접 질문 생성을 위한 학생부 근거 ${i + 1}`,
    normalized_summary: `학생부 근거 ${i + 1} 요약`,
    tags: ['topic','ownership']
  })),
  interviewer_pool: [
    { interviewer_id: 'I01', presentation_gender: 'female', personality_traits: ['CALM','ANALYTICAL'], values: ['EVIDENCE','SPECIFICITY'], response_style: 'RESP_MINIMAL', interest_bias: 'BIAS_EVIDENCE', pressure_tendency: 3, voice_preference: 'female' },
    { interviewer_id: 'I02', presentation_gender: 'male', personality_traits: ['CURIOUS','RESERVED'], values: ['DEPTH','OWNERSHIP'], response_style: 'RESP_CURIOUS', interest_bias: 'BIAS_DEPTH', pressure_tendency: 2, voice_preference: 'male' },
    { interviewer_id: 'I03', presentation_gender: 'female', personality_traits: ['SKEPTICAL','PATIENT'], values: ['LIMITATION','CONCEPT'], response_style: 'RESP_CONFIRMING', interest_bias: 'BIAS_LIMIT', pressure_tendency: 4, voice_preference: 'female' },
    { interviewer_id: 'I04', presentation_gender: 'male', personality_traits: ['FAST_PACED','ANALYTICAL'], values: ['BREADTH','CAREER'], response_style: 'RESP_FAST', interest_bias: 'BIAS_BREADTH', pressure_tendency: 3, voice_preference: 'male' }
  ],
  session_policy: { supported_interviewer_count: [1,2], default_interviewer_count: 2, start_modes: ['START_DIRECT'], ending_modes: ['END_DIRECT'], default_max_followup_depth: 3, absolute_max_followup_depth: 4, surprise_per_session_min: 0, surprise_per_session_max: 1, allow_cross_record: true, allow_weakness_question: true, allow_rare_human_events: true },
  question_bank: [
    { question_id: 'Q001', relation: 'ROOT', root_question_id: 'Q001', parent_question_id: null, question_type: 'ACTIVITY_VERIFY', question_intent: '활동에서 본인이 실제 수행한 범위를 확인', primary_text: '이 활동에서 본인이 직접 수행한 부분은 정확히 어디까지인가요?', text_variants: ['이 활동에서 본인이 맡았던 부분을 구체적으로 설명해 주세요.'], evidence_ids: ['E001'], cognitive_difficulty: 'D1', priority: 5, coverage_tags: ['activity','ownership'], recommended_answer_seconds: { min: 30, max: 60 }, eligible_interviewer_values: ['OWNERSHIP'], runtime_trigger: { type: 'ALWAYS_ELIGIBLE' }, followup_ids: ['Q002'] },
    { question_id: 'Q002', relation: 'FOLLOWUP', root_question_id: 'Q001', parent_question_id: 'Q001', question_type: 'EVIDENCE_CHECK', question_intent: '직접 수행과 외부 결과의 경계를 확인', primary_text: '그 결과 중 직접 측정한 값과 프로그램이 출력한 값은 어떻게 구분했나요?', text_variants: [], evidence_ids: ['E002'], cognitive_difficulty: 'D4', priority: 5, coverage_tags: ['evidence','boundary'], recommended_answer_seconds: { min: 30, max: 55 }, eligible_interviewer_values: ['EVIDENCE'], runtime_trigger: { type: 'AFTER_PARENT' }, followup_ids: [] },
    { question_id: 'Q003', relation: 'ROOT', root_question_id: 'Q003', parent_question_id: null, question_type: 'METHOD', question_intent: '방법 선택 이유 확인', primary_text: '여러 방법 중에서 굳이 이 방법을 선택한 이유는 무엇인가요?', text_variants: ['다른 방법도 있었을 텐데, 이 방법을 고른 기준은 무엇이었나요?'], evidence_ids: ['E003'], cognitive_difficulty: 'D3', priority: 4, coverage_tags: ['method'], recommended_answer_seconds: { min: 35, max: 65 }, eligible_interviewer_values: ['DEPTH'], runtime_trigger: { type: 'ALWAYS_ELIGIBLE' }, followup_ids: [] },
    { question_id: 'Q004', relation: 'ROOT', root_question_id: 'Q004', parent_question_id: null, question_type: 'LIMITATION', question_intent: '탐구 결과의 한계 인식 확인', primary_text: '이 탐구 결과를 어디까지 믿을 수 있다고 생각하나요?', text_variants: [], evidence_ids: ['E004'], cognitive_difficulty: 'D4', priority: 4, coverage_tags: ['limitation','boundary'], recommended_answer_seconds: { min: 30, max: 60 }, eligible_interviewer_values: ['LIMITATION'], runtime_trigger: { type: 'ALWAYS_ELIGIBLE' }, followup_ids: [] },
    { question_id: 'Q005', relation: 'ROOT', root_question_id: 'Q005', parent_question_id: null, question_type: 'CAREER', question_intent: '활동과 진로의 연결을 확인', primary_text: '이 경험이 지금 지원한 전공을 선택하는 데 어떤 영향을 줬나요?', text_variants: [], evidence_ids: ['E005'], cognitive_difficulty: 'D3', priority: 3, coverage_tags: ['career','growth'], recommended_answer_seconds: { min: 35, max: 70 }, eligible_interviewer_values: ['CAREER'], runtime_trigger: { type: 'ALWAYS_ELIGIBLE' }, followup_ids: [] }
  ],
  integrity: { warnings: [], insufficient_record_areas: [], questions_without_record_evidence: [], duplicate_intent_check_passed: true, graph_validation_passed: true, enum_validation_passed: true, reference_validation_passed: true, runtime_trigger_validation_passed: true }
};

function loadStored() {
  // Pack과 Settings의 canonical source는 runtime의 PHASE 1 Dexie adapter다.
  // localStorage는 adapter 내부 compatibility mirror로만 읽고 쓴다.
}
loadStored();

function myeokHashRouting() { return location.protocol === 'file:' || Boolean(window.MYEOK_PAGES_BASE); }
function myeokCurrentPath() { return myeokHashRouting() ? (location.hash.slice(1) || '/') : location.pathname; }
function myeokRouteUrl(path) { return myeokHashRouting() ? `#${path}` : path; }
function go(path) {
  if (location.protocol === 'file:') location.hash = path;
  else history.pushState({}, '', myeokRouteUrl(path));
  render();
  window.scrollTo({ top: 0, behavior: 'instant' });
}

window.addEventListener('popstate', () => { if (!myeokHashRouting()) render(); });
window.addEventListener('hashchange', render);
document.addEventListener('click', event => {
  const target = event.target.closest('[data-nav]');
  if (!target) return;
  event.preventDefault();
  go(target.getAttribute('data-nav'));
});

function publicHeader() {
  return `<header class="topbar"><div class="container topbar-inner">
    <a class="brand-lockup" href="/" data-nav="/" aria-label="面逆力 메인"><span class="brand-mark">面逆力</span><span class="brand-sub">면접으로 역전하는 능력</span></a>
    <nav class="nav" aria-label="사이트 메뉴"><a href="/guide" data-nav="/guide">사용법</a><a href="/app/history" data-nav="/app/history">면접 기록</a></nav>
    <a class="nav-cta" href="/app/packs" data-nav="/app/packs">면접 준비하기 <span aria-hidden="true">↗</span></a>
  </div></header>`;
}

function footer() {
  return `<footer class="footer"><div class="container footer-inner"><span>面逆力은 브라우저 중심으로 동작하는 면접 연습 서비스입니다.</span><div class="footer-links"><a data-nav="/privacy">개인정보</a><a data-nav="/terms">이용조건</a><a data-nav="/guide">도움말</a></div></div></footer>`;
}

function appShell(content, active='dashboard') {
  const links = [
    ['packs','/app/packs','질문팩'],['setup','/app/setup','면접 설정'],['history','/app/history','면접 기록'],['help','/guide','도움말']
  ];
  return `<header class="topbar tool-topbar"><a class="brand-lockup" href="/" data-nav="/" aria-label="面逆力 메인"><span class="brand-mark">面逆力</span><span class="brand-sub">면접으로 역전하는 능력</span></a><a class="workspace-home" href="/" data-nav="/">메인으로 <span aria-hidden="true">↗</span></a></header><div class="app-layout tool-shell"><aside class="sidebar"><nav class="side-nav" aria-label="주 메뉴">${links.map(([key,path,label]) => `<a href="${path}" class="side-link ${active===key?'active':''}" ${active===key?'aria-current="page"':''} data-nav="${path}">${label}</a>`).join('')}</nav></aside><main class="app-main">${content}</main></div>`;
}

function home() {
  return `${publicHeader()}<main class="home-main">
  <section class="home-hero container" aria-labelledby="homeTitle"><div class="home-copy">
    <p class="home-eyebrow"><span aria-hidden="true"></span>학생부 기반 면접 연습</p>
    <h1 id="homeTitle">한 번 더 말하고,<br><em>한 걸음 더 가까이.</em></h1>
    <p class="home-lead">나의 학생부에서 시작하는 질문.<br>실제처럼 답하고, 내 목소리로 다시 돌아보세요.</p>
    <div class="home-actions"><a class="btn primary" href="/app/packs" data-nav="/app/packs">면접 준비하기 <span aria-hidden="true">↗</span></a><a class="home-text-link" href="/create-pack" data-nav="/create-pack">질문팩이 처음이라면 <span aria-hidden="true">→</span></a></div>
    <p class="home-note">회원가입 없이 · 질문팩과 녹음은 이 브라우저에 저장</p>
  </div><div class="home-brand-art"><div class="home-art-frame"><img src="./assets/myeok-logo.svg" alt="面逆力"><span class="home-art-caption">면접으로 역전하는 능력</span></div><span class="home-art-label" aria-hidden="true">PRACTICE. LISTEN. GROW.</span></div></section>
  <section class="home-process container" aria-label="연습 흐름">${[
    ['01','나에게 맞는 질문','학생부로 만든 질문팩을 가져옵니다.'],['02','실전처럼 답하기','목소리와 면접 환경을 고르고 연습합니다.'],['03','내 답변 다시 듣기','녹음을 재생하고 저장하며 다음 답변을 준비합니다.']
  ].map(([n,title,description])=>`<div class="home-step"><span>${n}</span><div><h2>${title}</h2><p>${description}</p></div></div>`).join('')}</section>
  </main>${footer()}`;
}

function product() {
  return `${publicHeader()}<main class="page"><div class="container"><div class="page-kicker">Product</div><h1 class="page-title">질문을 만드는 AI와<br>면접을 실행하는 사이트를 분리했습니다.</h1><p class="page-lead">面逆力은 생성형 AI를 사이트 안에 숨겨 두지 않습니다. 질문 생성은 사용자가 선택한 ChatGPT에서, 실행과 측정은 브라우저에서, 내용 평가는 다시 ChatGPT에서 수행합니다.</p></div><section class="section"><div class="container grid-3">${[
    ['준비','학생부 기반 질문팩','학생부 자체를 서비스 서버에 저장하지 않고 질문 후보와 근거를 구조화합니다.'],['실전','브라우저 면접 엔진','질문 표시, TTS, 응답시간, 녹음, STT, VAD를 하나의 상태 흐름으로 제어합니다.'],['복기','측정과 평가 분리','사이트는 사실을 기록하고 AI 평가는 답변 내용과 학생부 일관성을 해석합니다.']
  ].map(([k,t,d])=>`<div class="card"><div class="page-kicker">${k}</div><h3 style="margin-top:10px">${t}</h3><p>${d}</p></div>`).join('')}</div></section><section class="section"><div class="container"><div class="product-window"><div class="product-chrome"><i class="chrome-dot"></i><i class="chrome-dot"></i><i class="chrome-dot"></i></div><div class="product-screen"><div class="stat-grid"><div class="stat-card"><div class="value">1.8초</div><div class="label">평균 답변 시작</div></div><div class="stat-card"><div class="value">54초</div><div class="label">평균 답변</div></div><div class="stat-card"><div class="value">4회</div><div class="label">2초 이상 정지</div></div><div class="stat-card"><div class="value">238</div><div class="label">분당 글자</div></div></div><div class="timeline" style="margin-top:70px"><i class="talk" style="width:21%"></i><i class="pause" style="width:7%"></i><i class="talk" style="width:30%"></i><i class="pause" style="width:13%"></i><i class="talk" style="width:29%"></i></div></div></div></div></section></main>${footer()}`;
}

function createPack() {
  return `${publicHeader()}<main class="page"><div class="container"><div class="page-kicker">Create interview pack</div><h1 class="page-title">파일 두 개를 함께 첨부하면<br>질문팩 생성이 바로 시작됩니다.</h1><p class="page-lead">학생부를 이 사이트에 올리지 않습니다. ChatGPT 새 대화에서 질문 생성 엔진과 학생부를 함께 첨부해 전송한 뒤, 생성된 interview-pack.json만 가져오세요.</p><div class="notice" style="margin-top:22px"><strong>추가 프롬프트를 작성할 필요가 없습니다.</strong> 질문 생성 엔진과 학생부를 함께 첨부하면 질문팩 생성을 바로 시작하도록 설계되어 있습니다.</div><div class="card" style="margin-top:22px"><div class="flow-strip create-pack-steps"><div class="flow-card"><div class="flow-num">01</div><div class="flow-title">엔진 받기</div><div class="flow-desc">아래에서 질문 생성 엔진 MD를 다운로드합니다.</div></div><div class="flow-card"><div class="flow-num">02</div><div class="flow-title">함께 첨부</div><div class="flow-desc">ChatGPT 새 대화에 엔진 MD와 학생부를 함께 첨부합니다.</div></div><div class="flow-card"><div class="flow-num">03</div><div class="flow-title">그대로 전송</div><div class="flow-desc">별도 지시 없이 첨부한 두 파일을 전송합니다.</div></div><div class="flow-card"><div class="flow-num">04</div><div class="flow-title">JSON 받기</div><div class="flow-desc">같은 응답에서 생성된 interview-pack.json을 저장합니다.</div></div><div class="flow-card"><div class="flow-num">05</div><div class="flow-title">가져오기</div><div class="flow-desc">面逆力에 JSON을 올려 검증하고 면접을 시작합니다.</div></div></div><div style="display:flex;gap:10px;margin-top:24px;flex-wrap:wrap"><a class="btn secondary" href="./core_md/학생부기반_공통_실전면접_질문엔진_v1.0_FINAL.md" download>1. 질문 생성 엔진 받기</a><button class="btn primary" data-nav="/app/import">2. 질문팩 가져오기</button></div></div><div class="notice" style="margin-top:18px">질문팩이 이미 있다면 엔진을 다시 받을 필요 없이 바로 JSON 파일을 가져오면 됩니다.</div></div></main>${footer()}`;
}

function aiEvaluation() {
  return `${publicHeader()}<main class="page"><div class="narrow"><div class="page-kicker">AI evaluation</div><h1 class="page-title">측정이 끝난 뒤, 답변 내용을 평가합니다.</h1><p class="page-lead">면접 결과 ZIP과 평가 엔진 MD를 ChatGPT에 함께 첨부하면 질문 적합성, 근거, 논리, 학생부 일관성, 꼬리질문 대응을 분석할 수 있습니다.</p><div class="grid-2" style="margin-top:34px"><div class="card"><div class="icon-box">1</div><h3>면접 결과 ZIP</h3><p>질문, 답변, 시간, STT, VAD와 기술 상태가 들어 있습니다.</p></div><div class="card"><div class="icon-box">2</div><h3>평가 엔진 MD</h3><p>사이트가 기록한 데이터를 어떻게 해석할지 정의합니다.</p></div></div><div class="card" style="margin-top:18px"><h3>역할을 섞지 않습니다.</h3><div class="grid-2"><div><p style="font-weight:800;color:var(--ink)">面逆力</p><p>답변시간, 침묵, 발화속도, 전사, 원시 이벤트를 기록합니다.</p></div><div><p style="font-weight:800;color:var(--ink)">ChatGPT</p><p>질문 적합성, 논리, 학생부 일관성, 역할 경계를 해석합니다.</p></div></div></div><div style="margin-top:22px"><button class="btn primary" data-nav="/app/result/demo">결과 화면 보기</button></div></div></main>${footer()}`;
}

function dashboard() {
  const hasPack = Boolean(state.pack);
  const content = `<div class="app-heading"><div><h1>면접 공간</h1><p>이 브라우저에 저장된 질문팩과 면접 기록을 관리합니다.</p></div><button class="btn primary" data-nav="${hasPack ? '/app/setup' : '/app/import'}">새 면접</button></div>
  ${hasPack ? `<div class="card pack-card"><div><div class="page-kicker">최근 질문팩</div><h3 style="margin-top:8px">${safe(state.pack.target?.university || '지원 대학 미지정')} ${safe(state.pack.target?.department || '')}</h3><div class="pack-meta"><span>질문 ${state.pack.question_bank?.length || 0}개</span><span>면접관 ${state.pack.interviewer_pool?.length || 0}명</span><span class="badge success">검증 완료</span></div></div><button class="btn accent" data-nav="/app/setup">이 질문팩으로 면접</button></div>` : `<div class="empty"><h3>첫 면접을 준비해볼까요?</h3><p>학생부로 만든 질문팩 하나만 있으면 면접을 시작할 수 있습니다. 파일이 없다면 만드는 방법부터 안내합니다.</p><button class="btn primary" data-nav="/create-pack">시작하기</button></div>`}
  <div style="height:28px"></div><div class="grid-2"><div><div class="app-heading" style="margin-bottom:14px"><div><h1 style="font-size:24px">최근 면접</h1></div><button class="btn ghost" data-nav="/app/history">전체 보기</button></div><div class="card">${state.history.slice(0,3).map(x=>`<div class="validation-item"><div><strong>${x.date}</strong><div class="metric-label">${x.mode} / ${x.questions}문항</div></div><span>${x.duration}</span></div>`).join('')}</div></div><div><div class="app-heading" style="margin-bottom:14px"><div><h1 style="font-size:24px">최근 변화</h1></div></div><div class="card"><div class="stat-grid" style="grid-template-columns:1fr 1fr"><div class="stat-card"><div class="value">1.8초</div><div class="label">평균 답변 시작</div></div><div class="stat-card"><div class="value">22%</div><div class="label">침묵 비율</div></div></div><p style="margin-top:18px;color:var(--muted);font-size:13px;line-height:1.7">최근 세션 간 실제 측정값만 비교합니다. 변화 자체를 실력 점수로 해석하지 않습니다.</p></div></div></div>`;
  return appShell(content,'dashboard');
}

function packs() {
  const hasPack = Boolean(state.pack);
  const content = `<div class="app-heading"><div><h1>질문팩</h1><p>지원 대학별 질문팩을 보관하고 반복해서 사용할 수 있습니다.</p></div><button class="btn primary" data-nav="/app/import">질문팩 추가</button></div>${hasPack ? `<div class="grid-2"><div class="card pack-card"><div><div class="badge success">사용 가능</div><h3 style="margin-top:14px">${safe(state.pack.target?.university || '지원 대학 미지정')}</h3><p>${safe(state.pack.target?.department || '학과 미지정')}</p><div class="pack-meta"><span>질문 ${state.pack.question_bank?.length || 0}개</span><span>면접관 ${state.pack.interviewer_pool?.length || 0}명</span><span>근거 ${state.pack.record_evidence?.length || 0}개</span></div></div><button class="btn secondary" data-nav="/app/setup">연습 시작</button></div><div class="card soft"><h3>질문팩 관리</h3><p>이 초기 빌드에서는 한 개의 활성 질문팩을 저장합니다. 다음 개발 단계에서 여러 Pack과 백업, 복원 기능을 연결합니다.</p></div></div>` : `<div class="empty"><h3>저장된 질문팩이 없습니다.</h3><p>새 질문팩을 만들거나 이미 생성한 interview-pack.json을 가져오세요.</p><button class="btn primary" data-nav="/app/import">파일 가져오기</button></div>`}`;
  return appShell(content,'packs');
}

function importPage() {
  return packs();
}

function importMarkup() {
  const ready = !['INITIALIZING','INITIALIZATION_ERROR','VALIDATING','SAVING'].includes(state.importStatus);
  const status = state.importStatus === 'INITIALIZING'
    ? '<p class="metric-label" data-import-state="INITIALIZING">저장된 질문팩을 불러오는 중…</p>'
    : state.importStatus === 'INITIALIZATION_ERROR'
      ? `<div class="notice danger" data-import-state="INITIALIZATION_ERROR"><strong>질문팩 기능을 시작하지 못했습니다.</strong><br>파일 문제가 아니라 사이트 초기화 문제입니다. 페이지를 새로고침해 주세요.${state.importError ? `<details class="technical-details"><summary>기술 정보</summary><code>${safe(state.importError.stage)} · ${safe(state.importError.message)}</code></details>` : ''}</div>`
      : state.importStatus === 'STORAGE_ERROR'
        ? `<div class="notice danger" data-import-state="STORAGE_ERROR"><strong>질문팩을 브라우저에 저장하지 못했습니다.</strong><br>브라우저 저장소 사용 가능 여부를 확인한 뒤 다시 시도해 주세요.${state.importError ? `<details class="technical-details"><summary>기술 정보</summary><code>${safe(state.importError.message)}</code></details>` : ''}</div>`
        : '';
  return `<section class="pack-import" aria-labelledby="packImportTitle"><h2 id="packImportTitle">질문팩 추가</h2>${status}<input class="file-input" id="packFile" type="file" accept="application/json,.json" ${ready ? '' : 'disabled'}><button type="button" class="dropzone compact-drop ${ready ? '' : 'disabled'}" id="dropzone" ${ready ? '' : 'disabled'}><strong>JSON 파일 선택</strong><span>여기에 파일을 끌어다 놓아도 됩니다.</span></button><div class="import-links"><a href="/create-pack" data-nav="/create-pack">질문팩 만드는 방법</a><button class="btn ghost" id="useDemo" ${ready ? '' : 'disabled'}>데모로 둘러보기</button></div><div id="validationArea" aria-live="polite"></div></section>`;
}

function bindImport() {
  const drop = document.getElementById('dropzone');
  const input = document.getElementById('packFile');
  const demo = document.getElementById('useDemo');
  if (!drop || !input || !demo) return;
  drop.addEventListener('click', e => { if (e.target !== input) input.click(); });
  drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('drag'); });
  drop.addEventListener('dragleave', () => drop.classList.remove('drag'));
  drop.addEventListener('drop', e => { e.preventDefault(); drop.classList.remove('drag'); const file = e.dataTransfer.files[0]; if (file) readPack(file); });
  input.addEventListener('change', () => input.files[0] && readPack(input.files[0]));
  demo.addEventListener('click', () => acceptPack(demoPack));
}

function readPack(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try { acceptPack(JSON.parse(reader.result)); }
    catch (_) { showValidation(null, [['JSON 파일', false, '형식을 읽을 수 없음']]); }
  };
  reader.readAsText(file);
}

function acceptPack() {
  showValidation(null, [['PHASE 1 validator', false, '초기화 중']]);
}

function showValidation(pack, checks) {
  const area = document.getElementById('validationArea');
  if (!area) return;
  const pass = checks.every(x => x[1]);
  area.innerHTML = `<div class="card" style="margin-top:24px"><h3>${pass ? '질문팩을 사용할 수 있습니다.' : '질문팩을 사용할 수 없습니다.'}</h3><div class="validation-list">${checks.map(([label,ok,value])=>`<div class="validation-item"><span>${label}</span><span class="badge ${ok?'success':'warn'}">${ok?'정상':'확인'} / ${safe(String(value))}</span></div>`).join('')}</div>${pass ? `<div style="display:flex;justify-content:flex-end;margin-top:22px"><button class="btn primary" id="savePack">저장하고 계속</button></div>` : `<div class="notice danger" style="margin-top:18px">파일을 다시 생성하거나 다른 파일을 선택하는 것이 안전합니다.</div>`}</div>`;
  if (pass) document.getElementById('savePack').addEventListener('click', () => {
    state.pack = pack;
    go('/app/setup');
  });
}

const presets = {
  COMFORT: { label:'편안', desc:'질문을 계속 보며 처음부터 차분하게 연습', minutes:10, interviewers:1, presentation:'항상 표시', prep:'5초', replay:'허용', timer:'표시', followup:'적음' },
  NORMAL: { label:'기본', desc:'실전 감각과 편의성 사이의 균형', minutes:10, interviewers:2, presentation:'질문 낭독 후 숨김', prep:'3초', replay:'1회', timer:'표시', followup:'보통' },
  REALISTIC: { label:'실전', desc:'실제 대학 면접에 가까운 제약을 적용', minutes:10, interviewers:2, presentation:'질문 낭독 후 숨김', prep:'없음', replay:'금지', timer:'숨김', followup:'보통' },
  HARD: { label:'고난도', desc:'질문 의존성을 최소화하고 높은 긴장도로 연습', minutes:10, interviewers:2, presentation:'음성만', prep:'없음', replay:'금지', timer:'숨김', followup:'많음' }
};

function setup() {
  if (!state.pack) return appShell(`<div class="empty"><h3>먼저 질문팩이 필요합니다.</h3><p>질문팩을 가져오면 면접 환경을 설정할 수 있습니다.</p><button class="btn primary" data-nav="/app/import">질문팩 가져오기</button></div>`,'setup');
  const p = presets[state.preset];
  const content = `<div class="app-heading"><div><h1>면접 설정</h1><p>처음에는 프리셋 하나만 골라도 충분합니다. 필요한 경우에만 세부 설정을 열어보세요.</p></div></div><div class="preset-grid">${Object.entries(presets).map(([key,x])=>`<div class="preset ${state.preset===key?'selected':''}" data-preset="${key}"><div class="check">${state.preset===key?'✓':''}</div><h3>${x.label}</h3><p>${x.desc}</p></div>`).join('')}</div><div class="settings-grid"><div><div class="card"><div class="app-heading" style="margin-bottom:18px"><div><h1 style="font-size:22px">세부 설정</h1><p>현재 프리셋의 기본값입니다.</p></div></div><div class="setting-list"><div class="setting-row"><div><label>면접 시간</label><small>예상 전체 세션 시간</small></div><select><option>${p.minutes}분</option><option>5분</option><option>15분</option><option>20분</option></select></div><div class="setting-row"><div><label>면접관</label><small>화면과 질문 배정에 사용</small></div><select><option>${p.interviewers}명</option><option>1명</option><option>2명</option></select></div><div class="setting-row"><div><label>질문 표시</label><small>질문을 언제까지 화면에 보여줄지 설정</small></div><select><option>${p.presentation}</option><option>항상 표시</option><option>음성만</option></select></div><div class="setting-row"><div><label>준비 시간</label><small>질문 뒤 별도 생각 시간</small></div><select><option>${p.prep}</option><option>없음</option><option>5초</option><option>10초</option></select></div><div class="setting-row"><div><label>질문 다시 듣기</label><small>실전에서는 제한하는 것을 권장</small></div><select><option>${p.replay}</option><option>허용</option><option>금지</option></select></div><div class="setting-row"><div><label>꼬리질문</label><small>질문 그래프에서 선택하는 깊이</small></div><select><option>${p.followup}</option><option>적음</option><option>많음</option></select></div></div></div></div><aside class="summary-panel"><h3>${p.label} 면접</h3><div class="summary-line"><span>예상 시간</span><strong>약 ${p.minutes}분</strong></div><div class="summary-line"><span>면접관</span><strong>${p.interviewers}명</strong></div><div class="summary-line"><span>질문 표시</span><strong>${p.presentation}</strong></div><div class="summary-line"><span>꼬리질문</span><strong>${p.followup}</strong></div><div class="summary-line"><span>지원</span><strong>${safe(state.pack.target?.university || '미지정')}</strong></div><button class="btn accent wide" style="margin-top:20px" data-nav="/app/device-test">환경 점검</button></aside></div>`;
  setTimeout(() => document.querySelectorAll('[data-preset]').forEach(el => el.addEventListener('click',()=>{ state.preset=el.dataset.preset; render(); })),0);
  return appShell(content,'setup');
}

function deviceTest() {
  const p = presets[state.preset];
  const content = `<div class="app-heading"><div><h1>면접 환경 점검</h1><p>실제 면접 전에 마이크와 브라우저 기능을 빠르게 확인합니다.</p></div></div><div class="grid-2"><div><div class="check-stack"><div class="check-row good"><div class="check-dot">✓</div><div><strong>마이크 권한</strong><div class="metric-label">브라우저 입력 장치 접근</div></div><span class="status">정상</span></div><div class="check-row good"><div class="check-dot">✓</div><div><strong>음성 감지</strong><div class="metric-label">발화와 무음 구간 측정 준비</div></div><span class="status">정상</span></div><div class="check-row good"><div class="check-dot">✓</div><div><strong>한국어 음성 인식</strong><div class="metric-label">브라우저 지원 여부</div></div><span class="status">사용 가능</span></div><div class="check-row good"><div class="check-dot">✓</div><div><strong>로컬 저장소</strong><div class="metric-label">면접 세션 복구와 기록</div></div><span class="status">정상</span></div></div></div><div class="card"><div class="page-kicker">Voice test</div><h3 style="margin-top:8px">평소 면접에서 말하듯 읽어주세요.</h3><p style="margin:16px 0;color:var(--ink);font-size:18px;line-height:1.65">“안녕하세요. 면접 준비를 시작하겠습니다.”</p><div class="mic-meter"><div class="mic-meter-fill"></div></div><div class="metric-label" style="margin-top:9px">입력 음량 양호</div><div class="notice" style="margin-top:22px">현재 첫 빌드에서는 장비 점검 UI와 복구 흐름을 먼저 검증합니다. 실제 MediaRecorder, Web Speech, Silero VAD 연결은 다음 구현 패스에서 활성화합니다.</div></div></div><div class="card" style="margin-top:22px;display:flex;justify-content:space-between;gap:20px;align-items:center"><div><h3 style="margin:0">준비되었습니다.</h3><p style="margin-top:7px">${safe(state.pack?.target?.university || '지원 대학 미지정')} / ${p.label} / 약 ${p.minutes}분</p></div><button class="btn accent" data-nav="/app/interview">면접 시작</button></div>`;
  return appShell(content,'setup');
}

function interview() {
  const qs = state.pack?.question_bank?.filter(q => q.relation === 'ROOT').slice(0,4) || demoPack.question_bank.filter(q=>q.relation==='ROOT').slice(0,4);
  const q = qs[Math.min(state.interviewIndex, qs.length - 1)];
  const hidden = state.interviewPhase === 'answer';
  setTimeout(bindInterview,0);
  return `<div class="interview-shell"><div class="interview-top"><a class="brand-mark" data-nav="/">面逆力</a><button class="btn ghost" id="quitInterview">면접 종료</button></div><div class="interview-stage"><div class="interview-personas"><div class="interview-persona active"><div class="portrait"></div><div class="name">면접관 01</div></div><div class="interview-persona"><div class="portrait"></div><div class="name">면접관 02</div></div></div><div class="question-zone"><h2 class="${hidden?'question-hidden':''}">${safe(q?.primary_text || '질문을 불러오고 있습니다.')}</h2></div><div class="speaking-state"><div class="pulse"></div><span>${hidden ? '답변 중' : '질문을 듣고 있습니다'}</span></div><div class="answer-done"><button class="btn primary" id="phaseButton">${hidden ? (state.interviewIndex === qs.length - 1 ? '면접 마치기' : '답변 완료') : '질문 확인 완료'}</button></div><div class="metric-label" style="text-align:center;margin-top:18px">${state.interviewIndex + 1} / ${qs.length}</div></div></div>`;
}

function bindInterview() {
  const btn = document.getElementById('phaseButton');
  const quit = document.getElementById('quitInterview');
  if (btn) btn.addEventListener('click', () => {
    const qs = state.pack?.question_bank?.filter(q=>q.relation==='ROOT').slice(0,4) || [];
    if (state.interviewPhase === 'question') state.interviewPhase = 'answer';
    else if (state.interviewIndex >= qs.length - 1) { state.interviewIndex = 0; state.interviewPhase='question'; go('/app/result/demo'); return; }
    else { state.interviewIndex += 1; state.interviewPhase='question'; }
    render();
  });
  if (quit) quit.addEventListener('click', () => { state.interviewIndex = 0; state.interviewPhase='question'; go('/app/result/demo'); });
}

function resultPage() {
  const tabs = [['overview','요약'],['questions','질문별'],['timeline','타임라인'],['transcript','전사']];
  setTimeout(() => document.querySelectorAll('[data-tab]').forEach(el => el.addEventListener('click',()=>{ state.resultTab=el.dataset.tab; render(); })),0);
  return appShell(`<div class="result-header"><div><div class="page-kicker">Interview complete</div><h2>면접을 완료했습니다.</h2><p>10분 42초 / 질문 8개 / 실제 발화 7분 18초</p></div><div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn secondary" data-nav="/app/setup">다시 면접</button><button class="btn accent" data-nav="/ai-evaluation">AI 정밀평가</button></div></div><div class="stat-grid" style="margin-top:18px"><div class="stat-card"><div class="value">1.8초</div><div class="label">평균 답변 시작</div></div><div class="stat-card"><div class="value">54초</div><div class="label">평균 답변 길이</div></div><div class="stat-card"><div class="value">4회</div><div class="label">2초 이상 정지</div></div><div class="stat-card"><div class="value">238</div><div class="label">평균 분당 글자</div></div></div><div class="tabs">${tabs.map(([key,label])=>`<div class="tab ${state.resultTab===key?'active':''}" data-tab="${key}">${label}</div>`).join('')}</div>${resultTabContent()}`,'history');
}

function resultTabContent() {
  if (state.resultTab === 'questions') return `<div class="q-list" style="margin-top:22px">${demoPack.question_bank.slice(0,5).map((q,i)=>`<div class="q-row"><div class="q-index">Q${String(i+1).padStart(2,'0')}</div><div><h4>${safe(q.primary_text)}</h4><p>${[36,43,50,57,64][i] || 36}초 / 시작 ${[1.2,1.6,2.0,2.4,2.8][i] || 1.2}초 / ${i%3+1}회 긴 정지</p></div><span class="badge">${q.cognitive_difficulty}</span></div>`).join('')}</div>`;
  if (state.resultTab === 'timeline') return `<div class="card" style="margin-top:22px"><h3>Q04 답변 타임라인</h3><p>검은 구간은 발화, 밝은 구간은 침묵입니다.</p><div class="timeline" style="height:26px;margin-top:30px"><i class="talk" style="width:23%"></i><i class="pause" style="width:6%"></i><i class="talk" style="width:20%"></i><i class="pause" style="width:11%"></i><i class="talk" style="width:28%"></i><i class="pause" style="width:4%"></i><i class="talk" style="width:8%"></i></div><div style="display:flex;justify-content:space-between;color:var(--muted);font-size:11px"><span>0초</span><span>58초</span></div></div>`;
  if (state.resultTab === 'transcript') return `<div class="card" style="margin-top:22px"><div class="page-kicker">Q04 Transcript</div><h3 style="margin-top:8px">이 탐구 결과를 어디까지 믿을 수 있다고 생각하나요?</h3><p style="margin-top:24px;line-height:1.9;color:#3e3e3a">제가 측정한 범위에서는 프레임률을 낮췄을 때 CPU 패키지 에너지 사용량이 감소했습니다. 다만 이 결과는 제가 사용한 노트북과 테스트 영상, 측정 방식에 한정된 결과이기 때문에 모든 환경에서 같은 비율로 감소한다고 말하기는 어렵습니다.</p><div class="notice" style="margin-top:18px">전사 결과는 원문을 보존합니다. 내용의 정확성과 학생부 일관성은 별도 AI 평가에서 분석합니다.</div></div>`;
  return `<div class="grid-2" style="margin-top:22px"><div class="card"><h3>답변 흐름</h3><p>면접 중 측정한 시간 데이터만 보여줍니다.</p><div class="timeline" style="margin-top:26px"><i class="talk" style="width:18%"></i><i class="pause" style="width:4%"></i><i class="talk" style="width:26%"></i><i class="pause" style="width:9%"></i><i class="talk" style="width:43%"></i></div><div class="validation-list"><div class="validation-item"><span>1초 이상 정지</span><strong>12회</strong></div><div class="validation-item"><span>2초 이상 정지</span><strong>4회</strong></div><div class="validation-item"><span>최장 정지</span><strong>3.8초</strong></div></div></div><div class="card"><h3>다음 단계</h3><p>사이트는 측정까지만 수행합니다. 답변의 내용과 학생부 일관성은 평가 패키지로 분석하세요.</p><div style="display:grid;gap:10px;margin-top:22px"><button class="btn accent wide" data-nav="/ai-evaluation">AI 정밀평가 준비</button><button class="btn secondary wide" data-nav="/app/setup">같은 질문팩으로 다시 면접</button></div></div></div>`;
}

function historyPage() {
  const content = `<div class="app-heading"><div><h1>면접 기록</h1><p>세션을 시간순으로 확인하고 실제 측정값의 변화를 비교합니다.</p></div><button class="btn secondary" data-nav="/app/compare">두 세션 비교</button></div><div class="card">${state.history.map(x=>`<div class="validation-item"><div><strong>${x.date}</strong><div class="metric-label">${x.mode} / 질문 ${x.questions}개</div></div><div style="display:flex;gap:18px;align-items:center"><span>${x.duration}</span><span class="badge">답변 시작 ${x.latency}초</span></div></div>`).join('')}</div><div class="grid-2" style="margin-top:22px"><div class="card chart-card"><h3>평균 답변 시작</h3><p>최근 세션 간 실제 측정값</p><div class="line-chart">${state.history.slice().reverse().map((x,i)=>`<div class="bar ${i===2?'current':''}" style="height:${[48,72,96][i] || 48}px"><span class="bar-label">${x.date.replace('9월 ','')}</span></div>`).join('')}</div></div><div class="card chart-card"><h3>침묵 비율</h3><p>답변 구간 중 측정된 침묵 비율</p><div class="line-chart">${state.history.slice().reverse().map((x,i)=>`<div class="bar ${i===2?'current':''}" style="height:${[80,66,52][i] || 80}px"><span class="bar-label">${x.silence}%</span></div>`).join('')}</div></div></div>`;
  return appShell(content,'history');
}

function comparePage() {
  return appShell(`<div class="app-heading"><div><h1>세션 비교</h1><p>평가가 아니라 두 면접에서 실제로 달라진 측정값을 비교합니다.</p></div></div><div class="card"><div class="grid-2"><div><div class="page-kicker">이전</div><h3>9월 18일 기본 면접</h3></div><div><div class="page-kicker">현재</div><h3>9월 22일 실전 면접</h3></div></div></div><div class="card" style="margin-top:18px"><div class="validation-list">${[['평균 답변 시작','3.2초','1.8초'],['침묵 비율','31%','22%'],['최장 정지','6.1초','3.8초'],['평균 답변 길이','78초','58초'],['분당 글자','221','238']].map(x=>`<div class="validation-item"><strong>${x[0]}</strong><span style="display:flex;gap:28px"><span>${x[1]}</span><span>→</span><span>${x[2]}</span></span></div>`).join('')}</div></div><div class="notice" style="margin-top:18px">변화 수치를 그대로 보여주며, 사이트가 이를 실력 향상 또는 하락으로 단정하지 않습니다.</div>`,'history');
}

function guide() {
  return appShell(`<div class="app-heading"><div><h1>도움말</h1><p>질문팩 준비 → 면접 설정 → 결과 저장</p></div></div><section class="card help-start"><h2>첫 면접 시작하기</h2><p>ChatGPT에 질문 생성 엔진과 학생부를 함께 첨부합니다. 생성된 JSON을 질문팩 화면에 추가한 뒤 면접 환경을 선택하세요.</p><button class="btn primary" data-nav="/app/packs">질문팩 준비하기</button></section><div class="help-details"><details><summary>질문팩 만드는 방법</summary><p>학생부 원문은 이 사이트에 올리지 않습니다. 아래 안내에서 엔진을 받아 학생부와 함께 ChatGPT에 첨부하세요.</p><a href="/create-pack" data-nav="/create-pack">질문팩 만들기 안내</a></details><details><summary>마이크와 음성 인식 문제</summary><p>Chrome 또는 Edge에서 주소창의 마이크 권한을 허용하고, 환경 점검에서 입력이 움직이는지 확인하세요. 음성 인식은 브라우저·운영체제에 따라 온라인 처리될 수 있습니다. 지원하지 않아도 면접과 녹음은 가능합니다.</p></details><details><summary>측정 결과와 AI 평가</summary><p>시간·발화 지표는 관찰값이며 실력이나 합격 가능성을 뜻하지 않습니다. 현재 발화·침묵은 간이 감지의 추정값입니다. 평가용 ZIP과 평가 엔진을 ChatGPT에 함께 첨부해 내용을 복기하세요.</p><a href="./core_md/학생부기반_실전면접_평가엔진_v1.2_FINAL.md" download>평가 엔진 받기</a></details><details><summary>저장과 개인정보</summary><p>질문팩과 면접 기록은 이 브라우저에 저장됩니다. 브라우저 데이터를 지우기 전에 결과 ZIP을 보관하세요.</p><a href="/privacy" data-nav="/privacy">개인정보 안내</a></details></div>`,'help');
}

function privacy() {
  return `${publicHeader()}<main class="page"><div class="narrow article"><div class="page-kicker">Privacy</div><h1 class="page-title">학생부와 면접 기록을 어떻게 다루나요?</h1><p class="page-lead">面逆力의 기본 방향은 서버 계정을 만들고 개인정보를 쌓는 방식이 아니라, 사용자의 브라우저에서 필요한 데이터를 관리하는 것입니다.</p><h2>학생부 원문</h2><p>질문 생성은 사용자가 선택한 ChatGPT에서 수행합니다. 사이트가 면접을 실행하기 위해 받는 것은 생성된 질문팩이며 학생부 원문 전체를 요구하지 않습니다.</p><h2>로컬 기록</h2><p>질문팩과 면접 기록은 브라우저 저장소를 중심으로 관리합니다. 브라우저 데이터를 삭제하면 기록도 사라질 수 있으므로 향후 백업과 복원 기능을 제공합니다.</p><h2>음성 인식</h2><p>Web Speech API 등 브라우저 음성 인식 기능은 브라우저와 운영체제 구현에 따라 온라인 처리를 사용할 수 있습니다. 따라서 모든 음성이 항상 기기 밖으로 나가지 않는다고 주장하지 않습니다.</p></div></main>${footer()}`;
}

function terms() {
  return `${publicHeader()}<main class="page"><div class="narrow article"><div class="page-kicker">Terms</div><h1 class="page-title">서비스와 자료 이용조건</h1><p class="page-lead">현재 개발 빌드에서는 서비스 이용조건과 질문 생성 및 평가 엔진의 자료 이용조건을 분리해 표시합니다.</p><h2>서비스 이용조건</h2><p>面逆力의 측정 결과와 AI 평가 결과는 면접 연습을 위한 참고자료입니다. 실제 대학의 공식 평가나 합격 가능성을 의미하지 않습니다.</p><h2>엔진 자료</h2><p>질문 생성 및 평가용 MD 자료는 개인 면접 준비와 개인 수정에 사용할 수 있으며, 원본이나 수정본의 재배포와 재판매를 허용하지 않는 방향으로 정식 라이선스 문구를 별도로 제공합니다.</p></div></main>${footer()}`;
}

function notFound() {
  return `${publicHeader()}<main class="page"><div class="narrow empty"><h3>페이지를 찾을 수 없습니다.</h3><p>주소가 변경되었거나 아직 구현되지 않은 경로입니다.</p><button class="btn primary" data-nav="/">홈으로</button></div></main>${footer()}`;
}

function safe(value) {
  return String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch]));
}

function render() {
  window.myeokDisposeRenderedAudio?.();
  const rawPath = myeokCurrentPath();
  let path = rawPath.replace(/\/$/,'') || '/';
  if (window.myeokGuardInterviewRoute?.(path)) return;
  if (path === '/app/import') {
    path = '/app/packs';
    history.replaceState(null,'',myeokRouteUrl(path));
  }
  let html;
  if (path === '/' || path === '/home') html = home();
  else if (path === '/product') html = product();
  else if (path === '/create-pack') html = createPack();
  else if (path === '/ai-evaluation') html = aiEvaluation();
  else if (path === '/app') html = dashboard();
  else if (path === '/app/packs') html = packs();
  else if (path === '/app/import') html = importPage();
  else if (path === '/app/setup') html = setup();
  else if (path === '/app/device-test') html = deviceTest();
  else if (path === '/app/interview') html = interview();
  else if (path.startsWith('/app/result/')) html = resultPage();
  else if (path === '/app/history') html = historyPage();
  else if (path === '/app/compare') html = comparePage();
  else if (path === '/guide') html = guide();
  else if (path === '/privacy') html = privacy();
  else if (path === '/terms') html = terms();
  else html = notFound();
  app.innerHTML = `<div class="app-shell">${html}</div>`;
  app.querySelectorAll('a[data-nav]').forEach(link => { link.href = myeokRouteUrl(link.dataset.nav); });
}

render();
