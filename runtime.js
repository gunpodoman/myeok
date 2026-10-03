'use strict';

const fx = {
  db: null,
  phase1: null,
  phase1Api: null,
  activePackSha256: null,
  packs: [],
  sessions: [],
  config: null,
  activeSession: null,
  activeResult: null,
  mediaStream: null,
  audioContext: null,
  analyser: null,
  meterFrame: 0,
  speechToken: 0,
  speechResolve: null,
  speechUtterance: null,
  speechDiagnostic: null,
  audioUrls: [],
  device: {
    mic: 'idle',
    level: 0,
    stt: 'unknown',
    tts: 'unknown',
    storage: 'checking',
    noiseFloor: 0.012,
    lastCheckedAt: null,
    error: null
  },
  interview: {
    busy: false,
    phase: 'IDLE',
    responseStartedAt: 0,
    currentEntry: null,
    recorder: null,
    capture: null,
    recorderChunks: [],
    recognition: null,
    recognitionActive: false,
    recognitionRestarts: 0,
    recognitionErrors: [],
    transcriptFinal: '',
    transcriptInterim: '',
    energyTimer: 0,
    energySamples: [],
    speechSegments: [],
    currentSpeechStart: null,
    silenceStart: null,
    firstSpeechAt: null,
    answerStartAt: null,
    replayCount: 0,
    answerPausedMs: 0,
    questionShownAt: null,
    questionHiddenAt: null,
    ttsStartedAt: null,
    responseWindowAt: null,
    recordingMime: null
  }
};

const FX_PRESETS = {
  COMFORT: {
    label: '편안', minutes: 10, interviewerCount: 1, presentationMode: 'ALWAYS_VISIBLE', prepMs: 5000,
    replayAllowed: true, timerVisible: true, followupLevel: 'LOW', ttsEnabled: true, recordingEnabled: true
  },
  NORMAL: {
    label: '기본', minutes: 10, interviewerCount: 2, presentationMode: 'BLIND_AFTER_TTS', prepMs: 3000,
    replayAllowed: true, timerVisible: true, followupLevel: 'NORMAL', ttsEnabled: true, recordingEnabled: true
  },
  REALISTIC: {
    label: '실전', minutes: 10, interviewerCount: 2, presentationMode: 'BLIND_AFTER_TTS', prepMs: 0,
    replayAllowed: false, timerVisible: false, followupLevel: 'NORMAL', ttsEnabled: true, recordingEnabled: true
  },
  HARD: {
    label: '고난도', minutes: 10, interviewerCount: 2, presentationMode: 'TTS_ONLY', prepMs: 0,
    replayAllowed: false, timerVisible: false, followupLevel: 'HIGH', ttsEnabled: true, recordingEnabled: true
  }
};

function fxNowIso() {
  return new Date().toISOString();
}

function fxUuid() {
  if (crypto.randomUUID) return crypto.randomUUID();
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 15) | 64;
  bytes[8] = (bytes[8] & 63) | 128;
  const hex = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
}

function fxClamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function fxEscapeCsv(value) {
  if (value === null || value === undefined) return '';
  let text = typeof value === 'string' ? value : JSON.stringify(value);
  text = text.replaceAll('"', '""');
  if (text.includes(',') || text.includes('\n') || text.includes('"')) return `"${text}"`;
  return text;
}

function fxFormatMs(ms) {
  if (ms === null || ms === undefined || Number.isNaN(ms)) return '측정 안 됨';
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(ms < 10000 ? 1 : 0)}초`;
}

function fxFormatDuration(ms) {
  const total = Math.max(0, Math.round((ms || 0) / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

async function fxOpenDb() {
  let stage = 'DYNAMIC_IMPORT';
  try {
    const phase1ModuleUrl = window.MYEOK_PAGES_BASE ? `${window.MYEOK_PAGES_BASE}phase1/index.js` : '/phase1/index.js';
    const api = await import(phase1ModuleUrl);
    stage = 'BROWSER_BRIDGE';
    if (typeof api.validateInterviewPack !== 'function' || typeof api.createPhase1StorageService !== 'function') {
      throw new Error('PHASE 1 browser bridge에 필수 API가 없습니다.');
    }
    fx.phase1Api = api;
    stage = 'STORAGE_SERVICE';
    fx.phase1 = api.createPhase1StorageService();
    stage = 'DEXIE_INITIALIZATION';
    const snapshot = await fx.phase1.initialize();
    fx.db = fx.phase1.db;
    return snapshot;
  } catch (error) {
    error.phase1Stage ||= stage;
    throw error;
  }
}

function fxSetImportState(status, error = null) {
  state.importStatus = status;
  state.importError = error;
}

function fxImportTechnicalDetails(label, detail) {
  return `<details class="technical-details"><summary>기술 정보</summary><code>${safe(label)} · ${safe(detail)}</code></details>`;
}

function fxShowImportFailure(kind, title, message, detail) {
  const area = document.getElementById('validationArea');
  if (!area) return;
  area.innerHTML = `<div class="notice danger import-failure" data-import-error="${safe(kind)}"><strong>${safe(title)}</strong><br>${safe(message)}${fxImportTechnicalDetails(kind, detail)}</div>`;
}

function fxDbPut(storeName, value) {
  if (!fx.phase1) return Promise.reject(new Error('Dexie storage unavailable'));
  if (storeName === 'sessions') return fx.phase1.putSession(value);
  return Promise.reject(new Error(`Unsupported direct store write: ${storeName}`));
}

function fxDbGet(storeName, key) {
  if (!fx.phase1) return Promise.resolve(null);
  if (storeName === 'sessions') return fx.phase1.getSession(key);
  if (storeName === 'packs') return fx.phase1.getPack(key);
  return Promise.resolve(null);
}

function fxDbAll(storeName) {
  if (!fx.phase1) return Promise.resolve([]);
  if (storeName === 'sessions') return fx.phase1.listSessions();
  if (storeName === 'packs') return fx.phase1.listPacks();
  return Promise.resolve([]);
}

function fxDbDelete(storeName, key) {
  if (!fx.phase1) return Promise.resolve();
  if (storeName === 'sessions') return fx.phase1.deleteSession(key);
  if (storeName === 'packs') return fx.phase1.deletePack(key).then(() => undefined);
  return Promise.resolve();
}

async function fxSha256Bytes(bytes) {
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}

async function fxSha256Text(text) {
  return fxSha256Bytes(new TextEncoder().encode(text));
}

function fxQuestionById(pack) {
  return new Map((pack.question_bank || []).map(q => [q.question_id, q]));
}

function fxSeedToInt(seed) {
  let value = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    value ^= seed.charCodeAt(i);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

function fxPrng(seed) {
  let x = fxSeedToInt(seed) || 123456789;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return (x >>> 0) / 4294967296;
  };
}

function fxWeightedPick(items, weightFn, rnd) {
  const weights = items.map(item => Math.max(0.01, Number(weightFn(item)) || 0.01));
  const total = weights.reduce((sum, value) => sum + value, 0);
  let point = rnd() * total;
  for (let i = 0; i < items.length; i += 1) {
    point -= weights[i];
    if (point <= 0) return items[i];
  }
  return items[items.length - 1];
}

function fxDefaultConfig(presetKey) {
  const preset = FX_PRESETS[presetKey] || FX_PRESETS.NORMAL;
  return {
    preset: presetKey in FX_PRESETS ? presetKey : 'NORMAL',
    minutes: preset.minutes,
    interviewerCount: preset.interviewerCount,
    presentationMode: preset.presentationMode,
    prepMs: preset.prepMs,
    replayAllowed: preset.replayAllowed,
    timerVisible: preset.timerVisible,
    followupLevel: preset.followupLevel,
    ttsEnabled: preset.ttsEnabled,
    recordingEnabled: preset.recordingEnabled,
    voiceProfiles: [0,1].map(() => ({ voiceURI: '', gender: 'auto', style: 'adaptive', rate: 1, pitch: 1 }))
  };
}

function fxLoadConfig(stored = null) {
  const parsed = stored && typeof stored === 'object' ? stored : fx.config;
  if (parsed && FX_PRESETS[parsed.preset]) return {
    ...fxDefaultConfig(parsed.preset), ...parsed,
    voiceProfiles: [0,1].map(index => fx.phase1Api.normalizeVoiceProfile(parsed.voiceProfiles?.[index] || {}))
  };
  return fxDefaultConfig(state.preset || 'NORMAL');
}

function fxSaveConfig() {
  if (!fx.phase1 || !fx.config) return Promise.resolve();
  return fx.phase1.saveInterviewConfig({ ...fx.config });
}

function fxSelectInterviewers(pack, count, rnd) {
  const pool = [...(pack.interviewer_pool || [])];
  const selected = [];
  while (pool.length && selected.length < count) {
    const index = Math.floor(rnd() * pool.length);
    selected.push(pool.splice(index, 1)[0]);
  }
  return selected;
}

function fxSelectText(question, rnd) {
  const variants = Array.isArray(question.text_variants) ? question.text_variants.filter(Boolean) : [];
  if (variants.length && rnd() < 0.35) return variants[Math.floor(rnd() * variants.length)];
  return question.primary_text;
}

function fxBuildRootQueue(pack, config, interviewers, rnd) {
  const roots = pack.question_bank.filter(q => q.relation === 'ROOT');
  const desired = fxClamp(Math.round(config.minutes / 1.6), 3, 10);
  const selected = [];
  const remaining = [...roots];
  const recentTags = new Map();
  while (remaining.length && selected.length < desired) {
    const item = fxWeightedPick(remaining, q => {
      let weight = Number(q.priority || 3);
      if ((q.eligible_interviewer_values || []).length) {
        const match = interviewers.some(i => (i.values || []).some(value => q.eligible_interviewer_values.includes(value)));
        if (match) weight += 1.2;
      }
      for (const tag of q.coverage_tags || []) weight -= (recentTags.get(tag) || 0) * 0.4;
      if (q.question_type === 'SURPRISE') weight *= 0.35;
      return Math.max(0.2, weight);
    }, rnd);
    selected.push(item);
    remaining.splice(remaining.indexOf(item), 1);
    for (const tag of item.coverage_tags || []) recentTags.set(tag, (recentTags.get(tag) || 0) + 1);
  }
  return selected;
}

function fxCreateSession(packRecord) {
  const pack = packRecord.pack;
  const seed = fxUuid();
  const rnd = fxPrng(seed);
  const config = structuredClone(fxLoadConfig(fx.config));
  const interviewers = fxSelectInterviewers(pack, config.interviewerCount, rnd);
  const roots = fxBuildRootQueue(pack, config, interviewers, rnd);
  const queue = roots.map((q, index) => ({
    question_id: q.question_id,
    selected_text: fxSelectText(q, rnd),
    interviewer_id: interviewers[index % interviewers.length]?.interviewer_id || pack.interviewer_pool[0]?.interviewer_id || null,
    branch_reason: null
  }));
  return {
    session_id: fxUuid(),
    created_at: fxNowIso(),
    completed_at: null,
    started_perf: performance.now(),
    interview_duration_ms: 0,
    pack_sha256: packRecord.sha256,
    pack_id: pack.pack_id,
    pack_generator_version: pack.generator?.engine_version || '1.0',
    session_seed: seed,
    config,
    interviewers: interviewers.map(i => i.interviewer_id),
    queue,
    cursor: 0,
    asked_ids: [],
    questions: [],
    events: [],
    truncated: false,
    technical_errors: [],
    notes: ['V1 테스트 빌드에서는 Silero VAD 대신 RMS 기반 간이 발화 감지를 사용합니다. 공식 environment.vad_mode은 DISABLED로 기록됩니다.'],
    status: 'IN_PROGRESS'
  };
}

function fxEvent(session, type, questionId, extra = {}) {
  // STT/TTS/MediaRecorder callback은 세션 종료 직후에도 늦게 도착할 수 있다.
  // 종료된 세션에 기록하려 하지 말고 안전하게 무시한다.
  if (!session || !Array.isArray(session.events)) return null;
  const event = {
    event_id: `EV${String(session.events.length + 1).padStart(6, '0')}`,
    question_id: questionId || null,
    type,
    timestamp_ms: Math.max(0, Math.round(performance.now() - session.started_perf)),
    ...extra
  };
  session.events.push(event);
  return event;
}

function fxCurrentPackRecord() {
  return fx.packs.find(item => item.sha256 === fx.activePackSha256) || null;
}

function fxCurrentQuestionData() {
  if (!fx.activeSession) return null;
  const entry = fx.activeSession.queue[fx.activeSession.cursor];
  const packRecord = fxCurrentPackRecord();
  if (!entry || !packRecord) return null;
  const question = packRecord.pack.question_bank.find(q => q.question_id === entry.question_id);
  return question ? { entry, question, packRecord } : null;
}

function fxRemainingMs(session) {
  const max = session.config.minutes * 60000;
  return Math.max(0, max - (performance.now() - session.started_perf));
}

function fxTriggerMatched(trigger, answer, session, rnd) {
  if (!trigger) return false;
  const text = (answer.answer_transcript || '').replaceAll(/\s+/g, ' ').trim();
  if (trigger.type === 'ALWAYS_ELIGIBLE' || trigger.type === 'AFTER_PARENT') return true;
  if (trigger.type === 'RANDOM') return rnd() <= trigger.probability;
  if (trigger.type === 'KEYWORD_ANY') return trigger.keywords.some(word => text.includes(word));
  if (trigger.type === 'ANSWER_TOO_SHORT') return Number(answer.timing?.answer_duration_ms || 0) < trigger.threshold_ms;
  if (trigger.type === 'ANSWER_TOO_LONG') return Number(answer.timing?.answer_duration_ms || 0) > trigger.threshold_ms;
  if (trigger.type === 'NO_ANSWER') return answer.answer_status === 'NO_ANSWER';
  if (trigger.type === 'DONT_KNOW_PATTERN') return trigger.phrases.some(phrase => text.includes(phrase));
  if (trigger.type === 'SESSION_TIME_REMAINING') {
    const remaining = fxRemainingMs(session);
    if (trigger.operator === 'LT') return remaining < trigger.threshold_ms;
    if (trigger.operator === 'LTE') return remaining <= trigger.threshold_ms;
    if (trigger.operator === 'GT') return remaining > trigger.threshold_ms;
    if (trigger.operator === 'GTE') return remaining >= trigger.threshold_ms;
  }
  return false;
}

function fxBranchPayload(trigger, parentQuestionId, answer) {
  const base = { type: trigger.type, source_question_id: parentQuestionId, used_signal: true };
  if (trigger.type === 'ANSWER_TOO_SHORT' || trigger.type === 'ANSWER_TOO_LONG') {
    return { ...base, measured_value: answer.timing.answer_duration_ms, threshold_value: trigger.threshold_ms, unit: 'ms' };
  }
  if (trigger.type === 'KEYWORD_ANY') {
    const text = answer.answer_transcript || '';
    const word = trigger.keywords.find(keyword => text.includes(keyword)) || null;
    return { ...base, matched_keyword: word, matched_text: word ? text : null };
  }
  if (trigger.type === 'RANDOM') return { ...base, probability: trigger.probability };
  return base;
}

function fxRuntimeSignal(trigger, answer, used) {
  if (!trigger) return null;
  const base = { type: trigger.type, observed: true, used_for_branching: Boolean(used) };
  if (trigger.type === 'ANSWER_TOO_SHORT' || trigger.type === 'ANSWER_TOO_LONG') {
    return { ...base, measured_value: answer.timing.answer_duration_ms, threshold_value: trigger.threshold_ms, unit: 'ms' };
  }
  if (trigger.type === 'KEYWORD_ANY') {
    const text = answer.answer_transcript || '';
    const word = trigger.keywords.find(keyword => text.includes(keyword)) || null;
    return { ...base, matched_keyword: word, matched_text: word ? text : null };
  }
  if (trigger.type === 'RANDOM') return { ...base, probability: trigger.probability };
  return base;
}

function fxMaybeInsertFollowup(question, answer) {
  const session = fx.activeSession;
  const packRecord = fxCurrentPackRecord();
  if (!session || !packRecord) return;
  if (session.config.followupLevel === 'LOW' && session.questions.filter(q => q.relation === 'FOLLOWUP').length >= 1) return;
  if (session.config.followupLevel === 'NORMAL' && session.questions.filter(q => q.relation === 'FOLLOWUP').length >= 3) return;
  const byId = fxQuestionById(packRecord.pack);
  const candidates = (question.followup_ids || []).map(id => byId.get(id)).filter(Boolean).filter(q => !session.asked_ids.includes(q.question_id) && !session.queue.slice(session.cursor + 1).some(e => e.question_id === q.question_id));
  if (!candidates.length) return;
  const rnd = fxPrng(`${session.session_seed}:${question.question_id}:${session.questions.length}`);
  const matched = candidates.filter(candidate => fxTriggerMatched(candidate.runtime_trigger, answer, session, rnd));
  if (!matched.length) return;
  const selected = fxWeightedPick(matched, q => q.priority || 1, rnd);
  const index = session.cursor + 1;
  session.queue.splice(index, 0, {
    question_id: selected.question_id,
    selected_text: fxSelectText(selected, rnd),
    interviewer_id: session.interviewers[(session.questions.length + 1) % session.interviewers.length],
    branch_reason: fxBranchPayload(selected.runtime_trigger, question.question_id, answer)
  });
  answer.runtime_signal = fxRuntimeSignal(selected.runtime_trigger, answer, true);
}

function fxSpeechRecognitionCtor() {
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

async function fxEnsureMedia() {
  if (fx.mediaStream && fx.mediaStream.active) return fx.mediaStream;
  if (!navigator.mediaDevices?.getUserMedia) throw new Error('이 브라우저는 마이크 접근을 지원하지 않습니다.');
  fx.mediaStream = await navigator.mediaDevices.getUserMedia({
    audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
    video: false
  });
  return fx.mediaStream;
}

async function fxEnsureAudioGraph() {
  const stream = await fxEnsureMedia();
  if (!fx.audioContext || fx.audioContext.state === 'closed') {
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) throw new Error('Web Audio API를 사용할 수 없습니다.');
    fx.audioContext = new Ctor();
    fx.analyser = fx.audioContext.createAnalyser();
    fx.analyser.fftSize = 1024;
    fx.analyser.smoothingTimeConstant = 0.25;
    const source = fx.audioContext.createMediaStreamSource(stream);
    source.connect(fx.analyser);
  }
  if (fx.audioContext.state === 'suspended') await fx.audioContext.resume();
  return fx.analyser;
}

function fxReadRms() {
  if (!fx.analyser) return 0;
  const data = new Float32Array(fx.analyser.fftSize);
  fx.analyser.getFloatTimeDomainData(data);
  let sum = 0;
  for (let i = 0; i < data.length; i += 1) sum += data[i] * data[i];
  return Math.sqrt(sum / data.length);
}

async function fxRunDeviceCheck() {
  fx.device.error = null;
  fx.device.storage = fx.db ? 'good' : 'bad';
  fx.device.stt = fxSpeechRecognitionCtor() ? 'good' : 'unavailable';
  fx.device.tts = 'speechSynthesis' in window ? 'good' : 'unavailable';
  try {
    await fxEnsureAudioGraph();
    fx.device.mic = 'good';
    const samples = [];
    const started = performance.now();
    while (performance.now() - started < 1100) {
      samples.push(fxReadRms());
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    const sorted = samples.slice().sort((a,b) => a - b);
    fx.device.noiseFloor = sorted[Math.floor(sorted.length * 0.6)] || 0.012;
    fx.device.lastCheckedAt = fxNowIso();
  } catch (error) {
    fx.device.mic = 'bad';
    fx.device.error = error?.message || String(error);
  }
  render();
}

function fxStartDeviceMeter() {
  cancelAnimationFrame(fx.meterFrame);
  const tick = () => {
    if (!document.getElementById('liveMicFill')) return;
    const rms = fxReadRms();
    fx.device.level = rms;
    const scaled = fxClamp(Math.round((rms / 0.12) * 100), 2, 100);
    const fill = document.getElementById('liveMicFill');
    const label = document.getElementById('liveMicLabel');
    if (fill) fill.style.width = `${scaled}%`;
    if (label) label.textContent = rms > Math.max(0.018, fx.device.noiseFloor * 2.1) ? '목소리 감지됨' : '말해보세요';
    fx.meterFrame = requestAnimationFrame(tick);
  };
  tick();
}

function fxStopDeviceMeter() {
  cancelAnimationFrame(fx.meterFrame);
  fx.meterFrame = 0;
}

function fxRecorderStart() {
  const runtime = fx.interview;
  runtime.capture = null;
  runtime.recorder = null;
  runtime.recordingError = null;
  if (!fx.activeSession?.config.recordingEnabled) { fxRecordingStatus('녹음 꺼짐'); return; }
  if (!window.MediaRecorder || !fx.mediaStream?.active) {
    fxRecordingStatus('녹음 불가 · 마이크와 브라우저를 확인하세요.', true);
    fx.activeSession.technical_errors.push('답변 녹음 불가: MediaRecorder 또는 마이크를 사용할 수 없습니다.');
    return;
  }
  try {
    runtime.capture = fx.phase1Api.createAnswerCapture(fx.mediaStream);
    const capture = runtime.capture;
    runtime.recorder = runtime.capture.recorder;
    fxRecordingStatus('답변 녹음 중');
    runtime.recorder.addEventListener('error', () => { if (runtime.capture === capture) fxRecordingStatus('녹음 오류 · 종료 후 저장 상태를 확인하세요.', true); });
    runtime.recorder.addEventListener('stop', () => {
      if (runtime.capture === capture && fx.interview.phase === 'ANSWERING') {
        capture.error ||= '마이크 녹음이 답변 완료 전에 멈췄습니다.';
        fxRecordingStatus('마이크 녹음이 멈췄습니다. 답변을 완료한 뒤 장치를 확인하세요.', true);
      }
    });
  } catch (error) {
    fx.activeSession.technical_errors.push(`MediaRecorder 시작 실패: ${error?.message || error}`);
    runtime.recorder = null;
    fxRecordingStatus('녹음 시작 실패', true);
  }
}

async function fxRecorderStop() {
  const runtime = fx.interview;
  const capture = runtime.capture;
  if (!capture) return null;
  fxRecordingStatus('녹음 저장 중');
  const blob = await capture.stop();
  if (capture.error) fx.activeSession?.technical_errors.push(`답변 녹음: ${capture.error}`);
  runtime.recordingError = capture.error;
  runtime.capture = null;
  runtime.recorder = null;
  return blob;
}

function fxRecordingStatus(text, error = false) {
  const status = document.getElementById('recordingStatus');
  if (status) { status.textContent = text; status.classList.toggle('recording-error', error); }
}

function fxRecognitionStart(questionId, reset = true) {
  const runtime = fx.interview;
  const Ctor = fxSpeechRecognitionCtor();
  if (reset) {
    runtime.transcriptFinal = '';
    runtime.transcriptInterim = '';
    runtime.recognitionRestarts = 0;
    runtime.recognitionErrors = [];
  }
  if (!Ctor) return;

  const startOne = () => {
    if (fx.interview.phase !== 'ANSWERING') return;
    const recognition = new Ctor();
    runtime.recognition = recognition;
    recognition.lang = 'ko-KR';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => {
      runtime.recognitionActive = true;
      fxEvent(fx.activeSession, runtime.recognitionRestarts ? 'STT_RESTART' : 'STT_START', questionId);
    };
    recognition.onresult = event => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const text = event.results[i][0]?.transcript || '';
        if (event.results[i].isFinal) runtime.transcriptFinal += `${text} `;
        else interim += text;
      }
      runtime.transcriptInterim = interim;
      const el = document.getElementById('liveTranscript');
      if (el) el.textContent = `${runtime.transcriptFinal}${runtime.transcriptInterim}`.trim() || '음성을 듣고 있습니다.';
    };
    recognition.onerror = event => {
      runtime.recognitionErrors.push(event.error || 'unknown');
      fxEvent(fx.activeSession, 'STT_ERROR', questionId, { value: event.error || 'unknown' });
    };
    recognition.onend = () => {
      runtime.recognitionActive = false;
      if (fx.interview.phase === 'ANSWERING' && runtime.recognitionRestarts < 3) {
        runtime.recognitionRestarts += 1;
        setTimeout(startOne, 180);
      }
    };
    try { recognition.start(); } catch (error) { runtime.recognitionErrors.push(error?.message || String(error)); }
  };
  startOne();
}

function fxRecognitionStop(questionId) {
  const runtime = fx.interview;
  if (runtime.recognition) {
    runtime.recognition.onend = null;
    try { runtime.recognition.stop(); } catch (_) {}
  }
  runtime.recognitionActive = false;
  if (runtime.transcriptFinal.trim()) fxEvent(fx.activeSession, 'STT_FINAL', questionId, { value: runtime.transcriptFinal.trim() });
}

function fxStartEnergyTracking(questionId, reset = true) {
  const runtime = fx.interview;
  if (reset) {
    runtime.energySamples = [];
    runtime.speechSegments = [];
    runtime.currentSpeechStart = null;
    runtime.silenceStart = null;
    runtime.firstSpeechAt = null;
  }
  const threshold = Math.max(0.018, fx.device.noiseFloor * 2.2);
  let speechCandidateAt = null;
  let silenceCandidateAt = null;
  runtime.energyTimer = window.setInterval(() => {
    if (runtime.phase !== 'ANSWERING') return;
    const now = performance.now();
    const rms = fxReadRms();
    const active = rms >= threshold;
    runtime.energySamples.push({ t: now, rms, active });
    const meter = document.getElementById('answerMeterFill');
    if (meter) meter.style.width = `${fxClamp(Math.round((rms / 0.12) * 100), 2, 100)}%`;

    if (active) {
      silenceCandidateAt = null;
      if (runtime.currentSpeechStart === null) {
        if (speechCandidateAt === null) speechCandidateAt = now;
        if (now - speechCandidateAt >= 160) {
          runtime.currentSpeechStart = speechCandidateAt;
          runtime.firstSpeechAt ??= speechCandidateAt;
          if (runtime.silenceStart !== null) {
            const pauseDuration = Math.max(0, speechCandidateAt - runtime.silenceStart);
            fxEvent(fx.activeSession, 'PAUSE_END', questionId, { duration_ms: Math.round(pauseDuration) });
            runtime.silenceStart = null;
          }
          fxEvent(fx.activeSession, 'SPEECH_START', questionId);
        }
      }
    } else {
      speechCandidateAt = null;
      if (runtime.currentSpeechStart !== null) {
        if (silenceCandidateAt === null) silenceCandidateAt = now;
        if (now - silenceCandidateAt >= 420) {
          const end = silenceCandidateAt;
          runtime.speechSegments.push([runtime.currentSpeechStart, end]);
          runtime.currentSpeechStart = null;
          runtime.silenceStart = end;
          fxEvent(fx.activeSession, 'SPEECH_END', questionId);
          fxEvent(fx.activeSession, 'PAUSE_START', questionId);
        }
      }
    }
  }, 90);
}

function fxStopEnergyTracking(questionId) {
  const runtime = fx.interview;
  clearInterval(runtime.energyTimer);
  runtime.energyTimer = 0;
  const now = performance.now();
  if (runtime.currentSpeechStart !== null) {
    runtime.speechSegments.push([runtime.currentSpeechStart, now]);
    fxEvent(fx.activeSession, 'SPEECH_END', questionId);
    runtime.currentSpeechStart = null;
  }
  if (runtime.silenceStart !== null) {
    const duration = Math.max(0, now - runtime.silenceStart);
    fxEvent(fx.activeSession, 'PAUSE_END', questionId, { duration_ms: Math.round(duration) });
    runtime.silenceStart = null;
  }
}

function fxAnalyzeSpeech(runtime, answerStart, answerEnd) {
  const segments = runtime.speechSegments.slice().sort((a,b) => a[0] - b[0]);
  const speechDuration = segments.reduce((sum, pair) => sum + Math.max(0, pair[1] - pair[0]), 0);
  const answerDuration = Math.max(0, answerEnd - answerStart - (runtime.answerPausedMs || 0));
  const silenceDuration = Math.max(0, answerDuration - speechDuration);
  const pauses = [];
  for (let i = 1; i < segments.length; i += 1) pauses.push(Math.max(0, segments[i][0] - segments[i - 1][1]));
  const sorted = pauses.slice().sort((a,b) => a - b);
  const mean = pauses.length ? pauses.reduce((a,b) => a + b, 0) / pauses.length : 0;
  const median = sorted.length ? sorted[Math.floor(sorted.length / 2)] : 0;
  return {
    answerDuration: Math.round(answerDuration),
    speechDuration: Math.round(speechDuration),
    silenceDuration: Math.round(silenceDuration),
    speechRatio: answerDuration ? speechDuration / answerDuration : 0,
    silenceRatio: answerDuration ? silenceDuration / answerDuration : 0,
    pauses,
    longestPause: pauses.length ? Math.max(...pauses) : 0,
    meanPause: mean,
    medianPause: median
  };
}

function fxTextMetrics(transcript, answerDurationMs, speechDurationMs) {
  const text = (transcript || '').trim();
  const compact = text.replaceAll(/\s/g, '');
  const sentences = text ? text.split(/[.!?。！？]+/).filter(x => x.trim()).length : 0;
  const directFillers = ['어','음','아','저기','그니까','그러니까'];
  const tokens = text.split(/\s+/).filter(Boolean);
  const fillerCount = tokens.reduce((count, token) => count + (directFillers.includes(token.replace(/[,.!?]/g,'')) ? 1 : 0), 0);
  let repetition = 0;
  for (let i = 1; i < tokens.length; i += 1) if (tokens[i] === tokens[i - 1] && tokens[i].length > 1) repetition += 1;
  const selfCorrection = (text.match(/아니\s|정정|정확히는|다시 말하면/g) || []).length;
  const restart = (text.match(/그러니까|다시|아니/g) || []).length;
  const totalMinutes = answerDurationMs > 0 ? answerDurationMs / 60000 : 0;
  const speechMinutes = speechDurationMs > 0 ? speechDurationMs / 60000 : 0;
  return {
    fillerCount,
    fillerPerMinute: totalMinutes ? fillerCount / totalMinutes : 0,
    repetition,
    restart,
    selfCorrection,
    characterCount: compact.length,
    sentenceCount: sentences,
    cpmTotal: totalMinutes ? compact.length / totalMinutes : 0,
    cpmSpeech: speechMinutes ? compact.length / speechMinutes : 0
  };
}

function fxCancelSpeech() {
  fx.speechToken += 1;
  fx.speechResolve?.();
  fx.speechResolve = null;
  fx.speechUtterance = null;
  if ('speechSynthesis' in window) speechSynthesis.cancel();
}

function fxKoreanVoices() {
  return fx.phase1Api?.koreanVoices('speechSynthesis' in window ? speechSynthesis.getVoices() : []) || [];
}

async function fxSpeak(text, questionId, preview = null) {
  const session = fx.activeSession;
  if ((!preview && !session?.config.ttsEnabled) || !('speechSynthesis' in window) || !fx.phase1Api) return false;
  fxCancelSpeech();
  const token = fx.speechToken;
  const interviewerId = fx.interview.currentEntry?.interviewer_id;
  const interviewer = !preview ? fxCurrentPackRecord()?.pack.interviewer_pool.find(i => i.interviewer_id === interviewerId) : null;
  const index = preview?.index ?? Math.max(0, session.interviewers.indexOf(interviewerId));
  const profile = preview?.profile || session.config.voiceProfiles?.[index] || {};
  if (!fxKoreanVoices().length) {
    const until = performance.now() + 1500;
    while (!fxKoreanVoices().length && performance.now() < until && fx.speechToken === token) await new Promise(resolve => setTimeout(resolve, 100));
  }
  if (token !== fx.speechToken) return false;
  const selected = fx.phase1Api.resolveKoreanVoice(fxKoreanVoices(), profile, interviewer || {});
  if (!selected.voice) { fx.speechDiagnostic = { error: 'no-korean-voice', events: [] }; return false; }
  const delivery = fx.phase1Api.voiceDelivery(profile, interviewer || {});
  const diagnostic = { voice: selected.voice.name, local: selected.voice.localService, rate: delivery.rate, pitch: delivery.pitch, events: [], error: null };
  fx.speechDiagnostic = diagnostic;
  let started = false;
  for (const segment of fx.phase1Api.splitSpeechText(text)) {
    if (token !== fx.speechToken) return false;
    const ok = await new Promise(resolve => {
    const utterance = new SpeechSynthesisUtterance(segment);
    utterance.lang = 'ko-KR';
    utterance.voice = selected.voice;
    utterance.rate = delivery.rate;
    utterance.pitch = delivery.pitch;
    fx.speechUtterance = utterance; // Hold a strong reference until native callbacks finish.
    let settled = false;
    let endTimer;
    const finish = (value, reason = null) => {
      if (settled) return;
      settled = true;
      if (reason) diagnostic.error = reason;
      clearTimeout(startTimer); clearTimeout(endTimer);
      if (token === fx.speechToken) { fx.speechResolve = null; fx.speechUtterance = null; }
      resolve(value);
    };
    const startTimer = setTimeout(() => { finish(false, 'start-timeout'); if (token === fx.speechToken) speechSynthesis.cancel(); }, 5000);
    fx.speechResolve = () => finish(false, 'cancelled');
    utterance.onstart = () => {
      if (settled || token !== fx.speechToken) return;
      clearTimeout(startTimer);
      diagnostic.events.push('start');
      endTimer = setTimeout(() => { finish(false, 'end-timeout'); if (token === fx.speechToken) speechSynthesis.cancel(); }, Math.max(12000, segment.length * 260 / delivery.rate + 5000));
      if (started || preview) return;
      started = true;
      fx.interview.ttsStartedAt = performance.now();
      fxEvent(session, 'TTS_START', questionId);
      fxSetInterviewStatus('질문을 읽고 있습니다');
    };
    utterance.onend = () => { if (!settled) diagnostic.events.push('end'); finish(true); };
    utterance.onerror = event => finish(false, event.error || 'synthesis-error');
    try { speechSynthesis.resume(); speechSynthesis.speak(utterance); } catch (error) { finish(false, String(error)); }
    });
    if (!ok) return false;
  }
  if (!preview) fxEvent(session, 'TTS_END', questionId);
  return true;
}

function fxSetInterviewStatus(text) {
  const el = document.getElementById('interviewStatus');
  if (el) el.textContent = text;
}

function fxSetQuestionVisibility(visible) {
  const el = document.getElementById('interviewQuestion');
  if (!el) return;
  el.classList.toggle('question-hidden', !visible);
}

async function fxPrepareCurrentQuestion() {
  if (fx.interview.busy) return;
  const current = fxCurrentQuestionData();
  if (!current) return fxCompleteSession(false);
  const { entry, question } = current;
  fx.interview.busy = true;
  fx.interview.currentEntry = entry;
  fx.interview.phase = 'TTS_SPEAKING';
  fx.interview.replayCount = 0;
  fx.interview.questionShownAt = performance.now();
  fx.interview.questionHiddenAt = null;
  fx.interview.ttsStartedAt = null;
  fx.interview.voiceFallback = false;
  fx.activeSession.asked_ids.push(question.question_id);
  fxEvent(fx.activeSession, 'QUESTION_SHOWN', question.question_id);
  fxUpdateInterviewHeader();
  fxSetQuestionVisibility(fx.activeSession.config.presentationMode !== 'TTS_ONLY');
  const session = fx.activeSession;
  const spoken = await fxSpeak(entry.selected_text, question.question_id);
  if (fx.activeSession !== session || session.status !== 'IN_PROGRESS') { if (!fx.activeSession) fx.interview.busy = false; return; }
  if (session.config.ttsEnabled && !spoken) {
    session.technical_errors.push('브라우저 질문 음성 재생 실패: 질문을 화면에 표시했습니다.');
    fxSetQuestionVisibility(true);
    fx.interview.voiceFallback = true;
    fx.interview.questionShownAt = performance.now();
    fxEvent(session, 'QUESTION_SHOWN', question.question_id);
  } else if (session.config.presentationMode === 'BLIND_AFTER_TTS' || session.config.presentationMode === 'TTS_ONLY') {
    fxSetQuestionVisibility(false);
    fx.interview.questionHiddenAt = performance.now();
    fxEvent(fx.activeSession, 'QUESTION_HIDDEN', question.question_id);
  }
  if (fx.activeSession.config.prepMs > 0) {
    fx.interview.phase = 'QUESTION_PREPARE';
    const end = performance.now() + fx.activeSession.config.prepMs;
    while (performance.now() < end && fx.interview.phase === 'QUESTION_PREPARE') {
      const left = Math.max(0, Math.ceil((end - performance.now()) / 1000));
      fxSetInterviewStatus(`준비 시간 ${left}초`);
      await new Promise(resolve => setTimeout(resolve, 180));
    }
  }
  if (!fx.activeSession || fx.activeSession.status !== 'IN_PROGRESS') return;
  await fxBeginAnswer();
  fx.interview.busy = false;
}

async function fxBeginAnswer() {
  const current = fxCurrentQuestionData();
  if (!current) return;
  const questionId = current.question.question_id;
  try { await fxEnsureAudioGraph(); } catch (error) { fx.activeSession.technical_errors.push(`마이크 준비 실패: ${error?.message || error}`); }
  fx.interview.phase = 'ANSWERING';
  fx.interview.answerStartAt = performance.now();
  fx.interview.answerPausedMs = 0;
  fx.interview.responseWindowAt = performance.now();
  fxEvent(fx.activeSession, 'RESPONSE_WINDOW_START', questionId);
  fxSetInterviewStatus(fx.interview.voiceFallback ? '음성 재생이 안 되어 질문을 표시했습니다 · 답변 중' : '답변 중');
  const button = document.getElementById('answerCompleteButton');
  if (button) button.disabled = false;
  const replay = document.getElementById('replayQuestionButton');
  if (replay) replay.disabled = !fx.activeSession.config.replayAllowed;
  fxRecorderStart();
  fxRecognitionStart(questionId);
  fxStartEnergyTracking(questionId);
}

async function fxFinishAnswer(options = {}) {
  if (fx.interview.phase !== 'ANSWERING' || fx.interview.busy) return;
  fx.interview.busy = true;
  const current = fxCurrentQuestionData();
  if (!current) { fx.interview.busy = false; return; }
  const { entry, question, packRecord } = current;
  const session = fx.activeSession;
  const ending = options.endSession === true;
  const questionId = question.question_id;
  const end = performance.now();
  fx.interview.phase = 'SAVING';
  document.getElementById('answerCompleteButton')?.setAttribute('disabled', '');
  fxStopEnergyTracking(questionId);
  fxRecognitionStop(questionId);
  const audioBlob = await fxRecorderStop();
  const analysis = fxAnalyzeSpeech(fx.interview, fx.interview.answerStartAt, end);
  const transcript = `${fx.interview.transcriptFinal}${fx.interview.transcriptInterim}`.trim();
  const textMetrics = fxTextMetrics(transcript, analysis.answerDuration, analysis.speechDuration);
  const responseLatency = fx.interview.firstSpeechAt === null ? null : Math.max(0, Math.round(fx.interview.firstSpeechAt - fx.interview.responseWindowAt));
  const hasSpeech = analysis.speechDuration >= 350 || transcript.length > 0;
  const sttAvailable = Boolean(fxSpeechRecognitionCtor());
  const presentationMode = fx.interview.voiceFallback ? 'ALWAYS_VISIBLE' : fx.activeSession.config.presentationMode;
  const questionVisibleDuringAnswer = fx.interview.voiceFallback || presentationMode === 'ALWAYS_VISIBLE' || presentationMode === 'BLIND_AFTER_DELAY';
  const visibleEnd = fx.interview.questionHiddenAt ?? end;
  const visibleDuration = fx.interview.questionShownAt === null ? null : Math.max(0, Math.round(visibleEnd - fx.interview.questionShownAt));
  const answer = {
    question_id: question.question_id,
    sequence: fx.activeSession.questions.length + 1,
    interviewer_id: entry.interviewer_id,
    relation: question.relation,
    root_question_id: question.root_question_id,
    parent_question_id: question.parent_question_id,
    question_type: question.question_type,
    question_intent: question.question_intent,
    question_text: entry.selected_text,
    pack_primary_text: question.primary_text,
    cognitive_difficulty: question.cognitive_difficulty,
    priority: question.priority,
    coverage_tags: question.coverage_tags || [],
    recommended_answer_seconds: question.recommended_answer_seconds ?? null,
    student_record_anchor: null,
    student_record_excerpt: null,
    evidence_ids: question.evidence_ids || [],
    followup_trigger: entry.branch_reason,
    answer_status: hasSpeech ? (sttAvailable ? 'ANSWERED' : 'STT_UNAVAILABLE') : 'NO_ANSWER',
    answer_transcript: transcript,
    presentation: {
      mode: presentationMode,
      question_visible_during_answer: questionVisibleDuringAnswer,
      question_visible_duration_ms: presentationMode === 'TTS_ONLY' ? 0 : visibleDuration,
      question_replay_count: fx.interview.replayCount,
      preparation_time_ms: fx.activeSession.config.prepMs,
      timer_visible: fx.activeSession.config.timerVisible,
      tts_used: fx.interview.ttsStartedAt !== null
    },
    timing: {
      response_latency_ms: responseLatency,
      answer_duration_ms: analysis.answerDuration,
      speech_duration_ms: analysis.speechDuration,
      silence_duration_ms: analysis.silenceDuration
    },
    speech_metrics: {
      speech_ratio: analysis.answerDuration ? analysis.speechRatio : null,
      silence_ratio: analysis.answerDuration ? analysis.silenceRatio : null,
      pause_500ms_count: analysis.pauses.filter(v => v >= 500).length,
      pause_1000ms_count: analysis.pauses.filter(v => v >= 1000).length,
      pause_2000ms_count: analysis.pauses.filter(v => v >= 2000).length,
      pause_3000ms_count: analysis.pauses.filter(v => v >= 3000).length,
      longest_pause_ms: Math.round(analysis.longestPause),
      mean_pause_ms: Math.round(analysis.meanPause),
      median_pause_ms: Math.round(analysis.medianPause),
      filler_count: sttAvailable ? textMetrics.fillerCount : null,
      filler_per_minute: sttAvailable ? textMetrics.fillerPerMinute : null,
      repetition_count: sttAvailable ? textMetrics.repetition : null,
      restart_count: sttAvailable ? textMetrics.restart : null,
      self_correction_count: sttAvailable ? textMetrics.selfCorrection : null,
      character_count: sttAvailable ? textMetrics.characterCount : null,
      sentence_count: sttAvailable ? textMetrics.sentenceCount : null,
      characters_per_minute_total: sttAvailable ? textMetrics.cpmTotal : null,
      characters_per_minute_speech: sttAvailable ? textMetrics.cpmSpeech : null
    },
    filler_detection: {
      method: 'TRANSCRIPT_HEURISTIC',
      estimated: true
    },
    stt: {
      available: sttAvailable,
      complete: sttAvailable && fx.interview.recognitionErrors.length === 0,
      recognition_confidence: null,
      restart_count: fx.interview.recognitionRestarts,
      error_count: fx.interview.recognitionErrors.length,
      manually_edited: false,
      edited_transcript: null
    },
    data_quality: {
      timing: 'GOOD',
      vad: fx.analyser ? 'PARTIAL' : 'UNAVAILABLE',
      stt: !sttAvailable ? 'UNAVAILABLE' : fx.interview.recognitionErrors.length ? 'PARTIAL' : 'GOOD',
      recording: audioBlob ? (fx.interview.recordingError ? 'PARTIAL' : 'GOOD') : session.config.recordingEnabled ? 'LOW' : 'UNAVAILABLE'
    },
    runtime_signal: null,
    recording: {
      available: Boolean(audioBlob),
      file: audioBlob ? fx.phase1Api.recordingFile(question.question_id, audioBlob.type) : null,
      mime_type: audioBlob?.type || null
    },
    audio_blob: audioBlob || null,
    raw_energy_segments: fx.interview.speechSegments.map(pair => [Math.round(pair[0] - fx.interview.answerStartAt), Math.round(pair[1] - fx.interview.answerStartAt)])
  };
  fxEvent(fx.activeSession, 'ANSWER_END', questionId);
  if (!ending && !fx.interview.leavingRequested) fxMaybeInsertFollowup(question, answer);
  fx.activeSession.questions.push(answer);
  fx.activeSession.cursor += 1;
  fx.activeSession.interview_duration_ms = Math.round(performance.now() - fx.activeSession.started_perf);
  try { await fxSaveActiveSession(); }
  catch (error) {
    session.technical_errors.push(`답변 저장 실패: ${error?.message || error}`);
    fxRecordingStatus('기록 저장 실패 · 종료 후 파일을 내려받으세요.', true);
  }

  const maxReached = fxRemainingMs(fx.activeSession) <= 0;
  const noMore = fx.activeSession.cursor >= fx.activeSession.queue.length;
  if (ending || fx.interview.leavingRequested || maxReached || noMore) {
    await fxCompleteSession(fx.interview.leavingRequested || (ending ? Boolean(options.truncated) : maxReached));
    fx.interview.busy = false;
    return;
  }
  fx.interview.phase = 'IDLE';
  fx.interview.busy = false;
  render();
  setTimeout(fxPrepareCurrentQuestion, 50);
}

function fxUpdateInterviewHeader() {
  if (!fx.activeSession) return;
  const progress = document.getElementById('interviewProgress');
  if (progress) progress.textContent = `질문 ${fx.activeSession.cursor+1} / ${fx.activeSession.queue.length}`;
  const timer = document.getElementById('interviewTimer');
  if (timer) timer.textContent = fx.activeSession.config.timerVisible ? `${Math.ceil(fxRemainingMs(fx.activeSession) / 60000)}분 남음` : '';
  const current = fxCurrentQuestionData();
  if (current) {
    const text = document.getElementById('interviewQuestion');
    if (text) text.textContent = current.entry.selected_text;
    document.querySelectorAll('.interview-persona').forEach(el => el.classList.toggle('active', el.dataset.interviewer === current.entry.interviewer_id));
  }
}

async function fxReplayQuestion() {
  if (!fx.activeSession?.config.replayAllowed || fx.interview.phase !== 'ANSWERING' || fx.interview.busy) return;
  const current = fxCurrentQuestionData();
  if (!current) return;
  const replaySession = fx.activeSession;
  fx.interview.busy = true;
  const pauseStarted = performance.now();
  fx.interview.replayPausedAt = pauseStarted;
  fx.interview.replayCount += 1;
  fxEvent(fx.activeSession, 'QUESTION_REPLAYED', current.question.question_id);
  fxStopEnergyTracking(current.question.question_id);
  fxRecognitionStop(current.question.question_id);
  if (fx.interview.recorder?.state === 'recording') {
    try { fx.interview.recorder.pause(); } catch (_) {}
  }
  fxSetInterviewStatus('질문을 다시 읽고 있습니다');
  await fxSpeak(current.entry.selected_text, current.question.question_id);
  if (fx.activeSession !== replaySession || fx.interview.phase !== 'ANSWERING') return;
  if (fx.interview.recorder?.state === 'paused') {
    try { fx.interview.recorder.resume(); } catch (_) {}
  }
  fx.interview.answerPausedMs += performance.now() - pauseStarted;
  fx.interview.replayPausedAt = null;
  if (fx.interview.firstSpeechAt === null) fx.interview.responseWindowAt = performance.now();
  fx.interview.phase = 'ANSWERING';
  fxSetInterviewStatus('답변 중');
  fxRecognitionStart(current.question.question_id, false);
  fxStartEnergyTracking(current.question.question_id, false);
  fx.interview.busy = false;
}

async function fxSaveActiveSession() {
  if (!fx.activeSession || !fx.db) return;
  const safeSession = { ...fx.activeSession, started_perf: 0 };
  await fxDbPut('sessions', safeSession);
}

function fxSummary(session) {
  const qs = session.questions || [];
  const nonNull = (path) => qs.map(q => path(q)).filter(v => v !== null && v !== undefined && Number.isFinite(Number(v))).map(Number);
  const sum = arr => arr.reduce((a,b) => a + b, 0);
  const mean = arr => arr.length ? sum(arr) / arr.length : null;
  const median = arr => {
    if (!arr.length) return null;
    const sorted = arr.slice().sort((a,b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  };
  const latency = nonNull(q => q.timing.response_latency_ms);
  const answerDur = nonNull(q => q.timing.answer_duration_ms);
  const speechDur = nonNull(q => q.timing.speech_duration_ms);
  const silenceDur = nonNull(q => q.timing.silence_duration_ms);
  const pause1 = nonNull(q => q.speech_metrics.pause_1000ms_count);
  const pause2 = nonNull(q => q.speech_metrics.pause_2000ms_count);
  const pause3 = nonNull(q => q.speech_metrics.pause_3000ms_count);
  const longest = nonNull(q => q.speech_metrics.longest_pause_ms);
  const filler = nonNull(q => q.speech_metrics.filler_count);
  const restart = nonNull(q => q.speech_metrics.restart_count);
  const correction = nonNull(q => q.speech_metrics.self_correction_count);
  const cpmTotal = nonNull(q => q.speech_metrics.characters_per_minute_total);
  const cpmSpeech = nonNull(q => q.speech_metrics.characters_per_minute_speech);
  const totalMinutes = answerDur.length ? sum(answerDur) / 60000 : 0;
  return {
    total_answer_duration_ms: answerDur.length ? Math.round(sum(answerDur)) : null,
    total_speech_duration_ms: speechDur.length ? Math.round(sum(speechDur)) : null,
    total_silence_duration_ms: silenceDur.length ? Math.round(sum(silenceDur)) : null,
    mean_response_latency_ms: latency.length ? Math.round(mean(latency)) : null,
    median_response_latency_ms: latency.length ? Math.round(median(latency)) : null,
    max_response_latency_ms: latency.length ? Math.round(Math.max(...latency)) : null,
    total_pause_1000ms_count: pause1.length ? sum(pause1) : null,
    total_pause_2000ms_count: pause2.length ? sum(pause2) : null,
    total_pause_3000ms_count: pause3.length ? sum(pause3) : null,
    session_longest_pause_ms: longest.length ? Math.round(Math.max(...longest)) : null,
    total_filler_count: filler.length ? sum(filler) : null,
    filler_per_minute: filler.length && totalMinutes ? sum(filler) / totalMinutes : null,
    total_restart_count: restart.length ? sum(restart) : null,
    total_self_correction_count: correction.length ? sum(correction) : null,
    mean_characters_per_minute_total: cpmTotal.length ? mean(cpmTotal) : null,
    mean_characters_per_minute_speech: cpmSpeech.length ? mean(cpmSpeech) : null,
    coverage: {
      question_count_total: qs.length,
      question_count_with_timing: qs.filter(q => q.data_quality.timing !== 'UNAVAILABLE').length,
      question_count_with_vad: qs.filter(q => q.data_quality.vad !== 'UNAVAILABLE').length,
      question_count_with_stt: qs.filter(q => q.stt.available).length,
      question_count_with_filler_metrics: qs.filter(q => q.speech_metrics.filler_count !== null).length
    }
  };
}

function fxHandoffQuestion(question) {
  const clone = { ...question };
  delete clone.audio_blob;
  delete clone.raw_energy_segments;
  return clone;
}

function fxBuildHandoff(session) {
  const packRecord = fx.packs.find(p => p.sha256 === session.pack_sha256) || fxCurrentPackRecord();
  const summary = fxSummary(session);
  return {
    handoff_schema: 'INTERVIEW_EVAL_HANDOFF/1.1',
    session: {
      session_id: session.session_id,
      created_at: session.created_at,
      completed_at: session.completed_at,
      interview_duration_ms: session.interview_duration_ms,
      question_count: session.questions.length,
      site_version: '0.2.0-test',
      metrics_engine_version: '0.2.0-rms',
      language: 'ko-KR',
      session_seed: session.session_seed
    },
    source_pack: {
      schema: 'INTERVIEW_PACK/1.0',
      pack_id: session.pack_id,
      generator_version: session.pack_generator_version,
      sha256: session.pack_sha256
    },
    environment: {
      difficulty_preset: session.config.preset,
      question_presentation_mode: session.config.presentationMode,
      timer_visible: session.config.timerVisible,
      default_preparation_time_ms: session.config.prepMs,
      question_replay_allowed: session.config.replayAllowed,
      interviewer_visual_mode: session.config.interviewerCount > 1 ? 'PANEL' : 'PORTRAIT',
      interviewer_count: session.config.interviewerCount,
      tts_enabled: session.config.ttsEnabled,
      stt_mode: fxSpeechRecognitionCtor() ? 'WEB_SPEECH' : 'DISABLED',
      vad_mode: 'DISABLED',
      recording_enabled: session.config.recordingEnabled
    },
    summary,
    questions: session.questions.map(fxHandoffQuestion),
    integrity: {
      status: session.technical_errors.length || session.questions.some(q => q.data_quality.vad !== 'GOOD') ? 'PARTIAL' : 'VALID',
      missing_fields: [],
      stt_warning_questions: session.questions.filter(q => q.data_quality.stt === 'LOW' || q.data_quality.stt === 'UNAVAILABLE').map(q => q.question_id),
      timing_warning_questions: [],
      vad_warning_questions: session.questions.map(q => q.question_id),
      manually_edited_transcript: false,
      manual_edit_log: [],
      session_truncated: Boolean(session.truncated),
      technical_errors: session.technical_errors,
      notes: session.notes
    }
  };
}

async function fxCompleteSession(truncated) {
  if (!fx.activeSession || fx.activeSession.status !== 'IN_PROGRESS') return;
  if (fx.interview.phase === 'ANSWERING') {
    if (fx.interview.busy) return;
    return fxFinishAnswer({ endSession: true, truncated });
  }
  if (fx.interview.phase === 'SAVING' && fx.interview.busy && !fx.activeSession.questions[fx.activeSession.cursor - 1]) return;
  const session = fx.activeSession;
  fxCancelSpeech();
  fxStopEnergyTracking(fxCurrentQuestionData()?.question.question_id);
  fxRecognitionStop(fxCurrentQuestionData()?.question.question_id);
  session.truncated = Boolean(truncated);
  session.completed_at = fxNowIso();
  session.interview_duration_ms = Math.round(performance.now() - session.started_perf);
  session.status = 'COMPLETED';
  session.summary = fxSummary(session);
  try { await fxSaveActiveSession(); }
  catch (error) { session.save_error = `브라우저에 기록을 저장하지 못했습니다. 이 화면을 닫기 전에 녹음이나 평가 ZIP을 내려받으세요. (${error?.message || error})`; }
  fx.activeResult = session;
  fx.sessions = [session, ...fx.sessions.filter(x => x.session_id !== session.session_id)].sort((a,b) => String(b.created_at).localeCompare(String(a.created_at)));
  fx.activeSession = null;
  fx.interview.phase = 'IDLE';
  fx.interview.busy = false;
  fx.interview.leavingRequested = false;
  state.resultTab = 'overview';
  fx.mediaStream?.getTracks().forEach(track => track.stop());
  fx.mediaStream = null;
  fx.device.mic = 'idle';
  if (fx.audioContext) { await fx.audioContext.close().catch(() => {}); fx.audioContext = null; fx.analyser = null; }
  go(`/app/result/${session.session_id}`);
}

async function fxAbortSession() {
  if (!fx.activeSession) return;
  if (fx.interview.phase === 'SAVING') return;
  if (fx.interview.phase === 'ANSWERING' && fx.interview.busy) {
    // A question replay is cancellable; resume no further capture after abort.
    fxCancelSpeech();
    if (fx.interview.replayPausedAt) fx.interview.answerPausedMs += performance.now() - fx.interview.replayPausedAt;
    fx.interview.replayPausedAt = null;
    fx.interview.busy = false;
  }
  await fxCompleteSession(true);
}

function fxTimelineHtml(question) {
  const segments = question.raw_energy_segments || [];
  if (!segments.length || !question.timing.answer_duration_ms) return '<div class="notice warn">간이 발화 구간을 만들 수 있는 데이터가 없습니다.</div>';
  const total = question.timing.answer_duration_ms;
  const parts = [];
  let cursor = 0;
  for (const [start,end] of segments) {
    if (start > cursor) parts.push(`<i class="pause" style="width:${Math.max(1, ((start - cursor) / total) * 100)}%"></i>`);
    parts.push(`<i class="talk" style="width:${Math.max(1, ((end - start) / total) * 100)}%"></i>`);
    cursor = end;
  }
  if (cursor < total) parts.push(`<i class="pause" style="width:${Math.max(1, ((total - cursor) / total) * 100)}%"></i>`);
  return `<div class="timeline" style="height:24px">${parts.join('')}</div>`;
}

function fxDownload(name, blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

let fxCrcTable = null;
function fxCrc32(bytes) {
  if (!fxCrcTable) {
    fxCrcTable = new Uint32Array(256);
    for (let n = 0; n < 256; n += 1) {
      let c = n;
      for (let k = 0; k < 8; k += 1) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      fxCrcTable[n] = c >>> 0;
    }
  }
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i += 1) crc = fxCrcTable[(crc ^ bytes[i]) & 255] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function fxU16(value) {
  return new Uint8Array([value & 255, (value >>> 8) & 255]);
}

function fxU32(value) {
  return new Uint8Array([value & 255, (value >>> 8) & 255, (value >>> 16) & 255, (value >>> 24) & 255]);
}

function fxConcat(parts) {
  const length = parts.reduce((sum, part) => sum + part.length, 0);
  const out = new Uint8Array(length);
  let offset = 0;
  for (const part of parts) { out.set(part, offset); offset += part.length; }
  return out;
}

async function fxZipStore(files) {
  const encoder = new TextEncoder();
  const locals = [];
  const centrals = [];
  let offset = 0;
  for (const file of files) {
    const nameBytes = encoder.encode(file.name);
    let data;
    if (file.data instanceof Uint8Array) data = file.data;
    else if (file.data instanceof Blob) data = new Uint8Array(await file.data.arrayBuffer());
    else data = encoder.encode(String(file.data));
    const crc = fxCrc32(data);
    const local = fxConcat([
      fxU32(0x04034b50), fxU16(20), fxU16(0), fxU16(0), fxU16(0), fxU16(0), fxU32(crc), fxU32(data.length), fxU32(data.length), fxU16(nameBytes.length), fxU16(0), nameBytes, data
    ]);
    locals.push(local);
    const central = fxConcat([
      fxU32(0x02014b50), fxU16(20), fxU16(20), fxU16(0), fxU16(0), fxU16(0), fxU16(0), fxU32(crc), fxU32(data.length), fxU32(data.length), fxU16(nameBytes.length), fxU16(0), fxU16(0), fxU16(0), fxU16(0), fxU32(0), fxU32(offset), nameBytes
    ]);
    centrals.push(central);
    offset += local.length;
  }
  const centralSize = centrals.reduce((sum, item) => sum + item.length, 0);
  const end = fxConcat([
    fxU32(0x06054b50), fxU16(0), fxU16(0), fxU16(files.length), fxU16(files.length), fxU32(centralSize), fxU32(offset), fxU16(0)
  ]);
  return new Blob([fxConcat([...locals, ...centrals, end])], { type: 'application/zip' });
}

function fxHandoffMarkdown(handoff) {
  const lines = [
    '# 面逆力 면접 기록',
    '',
    `session_id: ${handoff.session.session_id}`,
    `created_at: ${handoff.session.created_at}`,
    `completed_at: ${handoff.session.completed_at}`,
    `question_count: ${handoff.session.question_count}`,
    `source_pack: ${handoff.source_pack.pack_id}`,
    '',
    '# 질문과 답변',
    ''
  ];
  for (const q of handoff.questions) {
    lines.push(`## ${q.sequence}. ${q.question_id}`,'',`질문: ${q.question_text}`,'',`답변 상태: ${q.answer_status}`,'',`답변: ${q.answer_transcript || '(전사 없음)'}`,'');
  }
  return lines.join('\n');
}

function fxTranscriptMarkdown(handoff) {
  const lines = ['# Transcript',''];
  for (const q of handoff.questions) lines.push(`## ${q.sequence}. ${q.question_text}`,'',q.answer_transcript || '(전사 없음)','');
  return lines.join('\n');
}

function fxAnswersCsv(handoff) {
  const columns = ['question_id','sequence','interviewer_id','relation','root_question_id','parent_question_id','question_type','question_intent','question_text','pack_primary_text','cognitive_difficulty','priority','coverage_tags','recommended_answer_min_seconds','recommended_answer_max_seconds','student_record_anchor','evidence_ids','followup_trigger_type','followup_trigger_source_question_id','answer_status','answer_transcript','presentation_mode','question_visible_during_answer','question_replay_count','preparation_time_ms','response_latency_ms','answer_duration_ms','speech_duration_ms','silence_duration_ms','speech_ratio','silence_ratio','pause_500ms_count','pause_1000ms_count','pause_2000ms_count','pause_3000ms_count','longest_pause_ms','mean_pause_ms','median_pause_ms','filler_count','filler_per_minute','repetition_count','restart_count','self_correction_count','character_count','sentence_count','characters_per_minute_total','characters_per_minute_speech','recognition_confidence','stt_complete','timing_quality','vad_quality','stt_quality','recording_available','recording_file'];
  const rows = handoff.questions.map(q => ({
    question_id:q.question_id, sequence:q.sequence, interviewer_id:q.interviewer_id, relation:q.relation, root_question_id:q.root_question_id, parent_question_id:q.parent_question_id,
    question_type:q.question_type, question_intent:q.question_intent, question_text:q.question_text, pack_primary_text:q.pack_primary_text, cognitive_difficulty:q.cognitive_difficulty,
    priority:q.priority, coverage_tags:q.coverage_tags, recommended_answer_min_seconds:q.recommended_answer_seconds?.min ?? null, recommended_answer_max_seconds:q.recommended_answer_seconds?.max ?? null,
    student_record_anchor:q.student_record_anchor, evidence_ids:q.evidence_ids, followup_trigger_type:q.followup_trigger?.type ?? null, followup_trigger_source_question_id:q.followup_trigger?.source_question_id ?? null,
    answer_status:q.answer_status, answer_transcript:q.answer_transcript, presentation_mode:q.presentation.mode, question_visible_during_answer:q.presentation.question_visible_during_answer,
    question_replay_count:q.presentation.question_replay_count, preparation_time_ms:q.presentation.preparation_time_ms, response_latency_ms:q.timing.response_latency_ms,
    answer_duration_ms:q.timing.answer_duration_ms, speech_duration_ms:q.timing.speech_duration_ms, silence_duration_ms:q.timing.silence_duration_ms,
    speech_ratio:q.speech_metrics.speech_ratio, silence_ratio:q.speech_metrics.silence_ratio, pause_500ms_count:q.speech_metrics.pause_500ms_count, pause_1000ms_count:q.speech_metrics.pause_1000ms_count,
    pause_2000ms_count:q.speech_metrics.pause_2000ms_count, pause_3000ms_count:q.speech_metrics.pause_3000ms_count, longest_pause_ms:q.speech_metrics.longest_pause_ms,
    mean_pause_ms:q.speech_metrics.mean_pause_ms, median_pause_ms:q.speech_metrics.median_pause_ms, filler_count:q.speech_metrics.filler_count, filler_per_minute:q.speech_metrics.filler_per_minute,
    repetition_count:q.speech_metrics.repetition_count, restart_count:q.speech_metrics.restart_count, self_correction_count:q.speech_metrics.self_correction_count,
    character_count:q.speech_metrics.character_count, sentence_count:q.speech_metrics.sentence_count, characters_per_minute_total:q.speech_metrics.characters_per_minute_total,
    characters_per_minute_speech:q.speech_metrics.characters_per_minute_speech, recognition_confidence:q.stt.recognition_confidence, stt_complete:q.stt.complete,
    timing_quality:q.data_quality.timing, vad_quality:q.data_quality.vad, stt_quality:q.data_quality.stt, recording_available:q.recording.available, recording_file:q.recording.file
  }));
  return '\ufeff' + [columns.join(','), ...rows.map(row => columns.map(column => fxEscapeCsv(row[column])).join(','))].join('\r\n');
}

function fxEventsCsv(session) {
  const columns = ['event_id','question_id','type','timestamp_ms','duration_ms','pair_id','value','metadata'];
  return '\ufeff' + [columns.join(','), ...session.events.map(e => columns.map(column => fxEscapeCsv(e[column] ?? null)).join(','))].join('\r\n');
}

async function fxExportSession(session) {
  const handoff = fxBuildHandoff(session);
  const readme = [
    '# 面逆力 Result Package',
    '',
    `handoff schema: ${handoff.handoff_schema}`,
    `session_id: ${session.session_id}`,
    `source pack: ${session.pack_id}`,
    `source pack SHA-256: ${session.pack_sha256}`,
    'canonical source: handoff.json',
    'event timestamp: session start = 0ms',
    'response latency: RESPONSE_WINDOW_START to first detected speech',
    'CSV encoding: UTF-8 with BOM',
    `audio included: ${session.questions.some(q => q.recording.available) ? 'yes' : 'no'}`,
    '',
    '주의: 이 테스트 빌드는 Silero VAD가 연결되기 전 단계이며 RMS 기반 간이 발화 구간을 사용합니다. handoff.json의 environment.vad_mode은 DISABLED로 기록됩니다.'
  ].join('\n');
  const files = [
    { name: 'handoff.json', data: JSON.stringify(handoff, null, 2) },
    { name: 'handoff.md', data: fxHandoffMarkdown(handoff) },
    { name: 'answers.csv', data: fxAnswersCsv(handoff) },
    { name: 'events.json', data: JSON.stringify(session.events, null, 2) },
    { name: 'events.csv', data: fxEventsCsv(session) },
    { name: 'transcript.md', data: fxTranscriptMarkdown(handoff) },
    { name: 'README.md', data: readme }
  ];
  for (const q of session.questions) if (q.audio_blob && q.recording.file) files.push({ name: q.recording.file, data: q.audio_blob });
  const zip = await fxZipStore(files);
  fxDownload(`myeonyeokryeok_result_${session.session_id}.zip`, zip);
}

function fxHasAudio(question) {
  return question.audio_blob instanceof Blob && question.audio_blob.size > 0;
}

async function fxExportRecordings(session) {
  const files = session.questions.filter(fxHasAudio).map(q => ({
    name: q.recording?.file || fx.phase1Api.recordingFile(q.question_id, q.audio_blob.type), data: q.audio_blob
  }));
  if (!files.length) return;
  files.push({ name: 'questions.txt', data: session.questions.map((q,index) => `질문 ${index+1}: ${q.question_text}\n녹음: ${fxHasAudio(q) ? q.recording?.file || fx.phase1Api.recordingFile(q.question_id, q.audio_blob.type) : '없음'}\n`).join('\n') });
  fxDownload(`myeok_recordings_${session.session_id}.zip`, await fxZipStore(files));
}

window.myeokDisposeRenderedAudio = function() {
  document.querySelectorAll('[data-answer-audio]').forEach(player => { player.myeokCancelDurationProbe?.(); player.pause(); player.removeAttribute('src'); player.load(); });
  fx.audioUrls.forEach(url => URL.revokeObjectURL(url));
  fx.audioUrls = [];
};

function fxRecordingsMarkup(session) {
  const count = session.questions.filter(fxHasAudio).length;
  return `<section class="card answer-recordings" aria-labelledby="recordingsTitle"><div class="section-heading"><div><h2 id="recordingsTitle">내 답변 다시 듣기</h2><p>${count ? `질문별 녹음 ${count}개 · 말의 속도와 흐름을 직접 돌아보세요.` : '이 면접에는 저장된 답변 녹음이 없습니다.'}</p></div>${count ? '<button class="btn secondary" data-export-audio>녹음 모두 저장 <span class="file-type">ZIP</span></button>' : ''}</div>${session.questions.length ? `<div class="recording-list">${session.questions.map((q,index) => {
    const available = fxHasAudio(q);
    let url = '';
    if (available) { url = URL.createObjectURL(q.audio_blob); fx.audioUrls.push(url); }
    return `<details class="recording-item" ${index === 0 ? 'open' : ''}><summary><span class="recording-number">${String(index+1).padStart(2,'0')}</span><span class="recording-question">${safe(q.question_text)}</span><span class="recording-duration">${fxFormatDuration(q.timing?.answer_duration_ms)}</span></summary><div class="recording-body">${available ? `<audio controls preload="metadata" src="${url}" data-answer-audio="${index}" aria-label="질문 ${index+1} 답변 녹음"></audio><button class="btn ghost" data-download-audio="${index}">음성 파일 저장 <span aria-hidden="true">↓</span></button><p class="audio-playback-error" data-audio-error="${index}" aria-live="polite"></p>` : `<p class="metric-label">${session.config?.recordingEnabled === false ? '녹음을 끈 상태로 답변했습니다.' : '저장된 오디오가 없습니다. 전사와 기록은 다른 탭에서 확인하세요.'}</p>`}${q.data_quality?.recording === 'PARTIAL' ? '<p class="metric-label">녹음 중 장치 오류가 있었습니다. 파일이 일부만 담겼을 수 있습니다.</p>' : ''}</div></details>`;
  }).join('')}</div>` : '<p class="metric-label">답변을 마치면 이곳에서 듣거나 파일로 저장할 수 있습니다.</p>'}<p class="recording-privacy">녹음은 이 브라우저에 보관됩니다. 브라우저 데이터를 지우기 전에 파일을 내려받아 보관하세요.</p></section>`;
}

function fxBindRecordingPlayers(session) {
  document.querySelector('[data-export-audio]')?.addEventListener('click', async event => {
    const button = event.currentTarget;
    button.disabled = true;
    try { await fxExportRecordings(session); }
    catch (_) { button.textContent = '저장 실패 · 다시 시도'; }
    finally { button.disabled = false; }
  });
  document.querySelectorAll('[data-download-audio]').forEach(button => button.addEventListener('click', () => {
    const q = session.questions[Number(button.dataset.downloadAudio)];
    if (fxHasAudio(q)) fxDownload(`myeok_answer_${String(Number(button.dataset.downloadAudio)+1).padStart(2,'0')}_${session.session_id}.${fx.phase1Api.recordingExtension(q.audio_blob.type)}`, q.audio_blob);
  }));
  document.querySelectorAll('[data-answer-audio]').forEach(player => {
    // Some recorded WebM containers initially report Infinity. A paused seek lets
    // the browser discover its real end; keep original bytes untouched.
    const prepareSeek = () => {
      if (player.duration !== Infinity || !player.paused || player.myeokCancelDurationProbe) return;
      let timer;
      const cancel = () => {
        clearTimeout(timer);
        player.removeEventListener('durationchange', reset);
        player.removeEventListener('seeked', reset);
        player.myeokCancelDurationProbe = null;
      };
      const reset = () => {
        if (!Number.isFinite(player.duration)) return;
        cancel();
        if (player.isConnected && player.paused) player.currentTime = 0;
      };
      player.myeokCancelDurationProbe = cancel;
      player.addEventListener('durationchange', reset);
      player.addEventListener('seeked', reset);
      timer = setTimeout(() => { cancel(); if (player.isConnected && player.paused) player.currentTime = 0; }, 2000);
      try { player.currentTime = Number.MAX_SAFE_INTEGER; } catch (_) { cancel(); }
    };
    player.addEventListener('loadedmetadata', prepareSeek);
    if (player.readyState >= 1) prepareSeek();
    player.addEventListener('play', () => {
      if (player.myeokCancelDurationProbe) { player.myeokCancelDurationProbe(); player.currentTime = 0; }
      document.querySelectorAll('[data-answer-audio]').forEach(other => { if (other !== player) other.pause(); });
    });
    player.addEventListener('error', () => {
      const message = document.querySelector(`[data-audio-error="${player.dataset.answerAudio}"]`);
      if (message) message.textContent = '이 브라우저에서 파일을 재생하지 못했습니다. 음성 파일을 저장해 다른 플레이어에서 들어보세요.';
    });
  });
}

async function fxBootstrap() {
  fxSetImportState('INITIALIZING');
  try {
    const snapshot = await fxOpenDb();
    fx.device.storage = 'good';
    fx.packs = snapshot.packs;
    fx.activePackSha256 = snapshot.activePackSha256;
    state.pack = snapshot.activePack?.pack || null;
    fx.sessions = await fx.phase1.listSessions();
    fx.config = fxLoadConfig(snapshot.interviewConfig);
    state.preset = fx.config.preset;
    if (!snapshot.interviewConfig) await fxSaveConfig();
    fxSetImportState('READY');
  } catch (error) {
    fx.device.storage = 'bad';
    console.error(error);
    fx.config = fxDefaultConfig(state.preset || 'NORMAL');
    fxSetImportState('INITIALIZATION_ERROR', {
      stage: error?.phase1Stage || 'UNKNOWN_INITIALIZATION_STAGE',
      message: error?.message || String(error)
    });
  }
  render();
}

const fxOriginalGo = go;
window.myeokGuardInterviewRoute = function(path) {
  if (path === '/app/interview' || !fx.activeSession || fx.activeSession.status !== 'IN_PROGRESS' || fx.interview.phase === 'IDLE') return false;
  if (!fx.interview.leavingRequested) {
    if (!confirm('면접 화면을 벗어나면 면접이 종료됩니다. 현재 답변까지 저장하고 종료할까요?')) {
      history.replaceState(null, '', myeokRouteUrl('/app/interview'));
      return true;
    }
    fx.interview.leavingRequested = true;
    if (fx.interview.phase !== 'SAVING') void fxAbortSession();
  }
  // Keep the current view until final dataavailable and persistence finish.
  return true;
};
go = function(path) {
  const leavingFunctionalArea = !path.startsWith('/app/interview') && !path.startsWith('/app/device-test');
  if (leavingFunctionalArea) fxStopDeviceMeter();
  if (fx.previewIndex !== undefined && !path.startsWith('/app/setup') && !path.startsWith('/app/device-test')) fxCancelSpeech();
  fxOriginalGo(path);
};

readPack = async function(file) {
  const area = document.getElementById('validationArea');
  if (!fx.phase1Api || !fx.phase1 || state.importStatus === 'INITIALIZATION_ERROR') {
    fxShowImportFailure('PHASE1_INITIALIZATION_FAILURE', '질문팩 기능이 준비되지 않았습니다.', '파일을 다시 만들 필요는 없습니다. 페이지를 새로고침한 뒤 다시 시도해 주세요.', state.importError?.message || 'PHASE 1 API is unavailable');
    return;
  }
  fxSetImportState('VALIDATING');
  if (area) area.innerHTML = '<div class="card" style="margin-top:24px" data-import-state="VALIDATING"><h3>질문팩을 검증하고 있습니다.</h3><p>JSON, 구조, enum, 참조, 질문 그래프와 trigger를 확인합니다.</p></div>';
  try {
    const bytes = new Uint8Array(await file.arrayBuffer());
    let text;
    try {
      text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    } catch (error) {
      fxSetImportState('INVALID');
      fxShowImportFailure('JSON_ENCODING_FAILURE', '파일 문자 인코딩을 읽을 수 없습니다.', 'UTF-8로 저장된 interview-pack.json인지 확인해 주세요.', error?.message || String(error));
      return;
    }
    let pack;
    try {
      pack = JSON.parse(text);
    } catch (error) {
      fxSetImportState('INVALID');
      fxShowImportFailure('JSON_PARSING_FAILURE', 'JSON 형식을 읽을 수 없습니다.', '쉼표, 따옴표 또는 중괄호가 빠지지 않았는지 확인해 주세요.', error?.message || String(error));
      return;
    }
    const sha256 = await fxSha256Bytes(bytes);
    await acceptPack(pack, { sha256, sourceName: file.name, rawText: text, rawBytes: bytes, sourceKind: 'file' });
  } catch (error) {
    fxSetImportState('INVALID');
    fxShowImportFailure('UNEXPECTED_IMPORT_FAILURE', '질문팩을 처리하는 중 예상하지 못한 오류가 발생했습니다.', '같은 오류가 반복되면 아래 기술 정보를 개발자에게 전달해 주세요.', error?.message || String(error));
  }
};

acceptPack = async function(pack, meta = {}) {
  if (!fx.phase1Api) {
    fxSetImportState('INITIALIZATION_ERROR', { stage: 'VALIDATOR_INITIALIZATION', message: 'validateInterviewPack API unavailable' });
    fxShowImportFailure('PHASE1_INITIALIZATION_FAILURE', '질문팩 검증기를 시작하지 못했습니다.', '파일 문제가 아니라 사이트 초기화 문제입니다. 페이지를 새로고침해 주세요.', 'VALIDATOR_INITIALIZATION · validateInterviewPack API unavailable');
    return;
  }
  fxSetImportState('VALIDATING');
  const validation = fx.phase1Api.validateInterviewPack(pack);
  const rawText = meta.rawText || JSON.stringify(pack);
  const rawBytes = meta.rawBytes || new TextEncoder().encode(rawText);
  const sha256 = meta.sha256 || await fxSha256Bytes(rawBytes);
  showValidation({ pack, sha256, sourceName: meta.sourceName || 'demo-pack.json', rawText, rawBytes, sourceKind: meta.sourceKind || 'demo' }, validation);
};

showValidation = function(record, validation) {
  const area = document.getElementById('validationArea');
  if (!area) return;
  const pass = validation.ok;
  fxSetImportState(pass ? 'VALID' : 'INVALID');
  const errors = validation.issues.filter(item => item.severity === 'error');
  const warnings = validation.issues.filter(item => item.severity === 'warning');
  const schemaFailed = validation.checks.some(check => check.key === 'schema' && !check.ok);
  const failureTitle = schemaFailed ? '질문팩 구조가 INTERVIEW_PACK/1.0과 맞지 않습니다.' : '질문 관계와 무결성 검증에 실패했습니다.';
  const failureType = schemaFailed ? 'SCHEMA_VALIDATION_FAILURE' : 'SEMANTIC_VALIDATION_FAILURE';
  const detailRows = items => items.slice(0, 30).map(item => `<div class="validation-issue"><strong>${safe(item.message)}</strong><span>${safe(item.code)} · ${safe(item.path)}</span><code>${safe(item.developerDetail)}</code></div>`).join('');
  area.innerHTML = `<div class="card import-result" data-import-state="${pass ? 'VALID' : 'INVALID'}" ${pass ? '' : `data-import-error="${failureType}"`}><h3>${pass ? safe(record.pack.target?.university || '새 질문팩') : failureTitle}</h3>${pass ? `<p>질문 ${record.pack.question_bank.length}개 · 저장하면 이 질문팩이 선택됩니다.</p>` : '<p class="import-guidance">파일을 다시 만들기 전에 아래 오류 필드를 확인해 주세요.</p>'}${errors.length ? `<div class="notice danger">${errors.slice(0,5).map(item=>`<p>${safe(item.message)}</p>`).join('')}</div>` : ''}<details class="validation-details"><summary>${pass ? '검증 상세' : `오류 ${errors.length}개와 기술 정보`}</summary><div class="validation-list">${validation.checks.map(check => `<div class="validation-item"><span>${safe(check.label)}</span><span>${check.ok ? '정상' : '오류'} / ${safe(check.detail)}</span></div>`).join('')}</div>${detailRows(errors)}${pass ? `<div class="pack-hash">SHA-256 ${record.sha256}</div>` : ''}</details>${warnings.length ? `<details class="validation-details"><summary>경고 ${warnings.length}개 보기</summary><div class="notice warn">${detailRows(warnings)}</div></details>` : ''}${pass ? '<button class="btn secondary" id="savePack">저장하고 선택</button>' : ''}</div>`;
  if (pass) document.getElementById('savePack')?.addEventListener('click', async () => {
    const button = document.getElementById('savePack');
    fxSetImportState('SAVING');
    if (button) { button.disabled = true; button.textContent = '저장 중…'; }
    try {
      const result = await fx.phase1.importPack({
        bytes: record.rawBytes,
        rawJson: record.rawText,
        parsed: record.pack,
        sourceName: record.sourceName,
        sourceKind: record.sourceKind,
        activate: true
      });
      const snapshot = await fx.phase1.snapshot();
      fx.packs = snapshot.packs;
      fx.activePackSha256 = snapshot.activePackSha256;
      state.pack = snapshot.activePack?.pack || null;
      fxSetImportState('SAVED');
      if (result.status === 'duplicate') console.info('동일한 SHA-256 질문팩이 이미 있어 기존 레코드를 활성화했습니다.');
      go('/app/packs');
    } catch (error) {
      fxSetImportState('STORAGE_ERROR', { message: error?.message || String(error) });
      fxShowImportFailure('STORAGE_FAILURE', '질문팩 검증은 통과했지만 저장하지 못했습니다.', '브라우저 저장소 사용 가능 여부를 확인한 뒤 다시 시도해 주세요.', error?.message || String(error));
    }
  });
};

bindImport = function() {
  const drop = document.getElementById('dropzone');
  const input = document.getElementById('packFile');
  const demo = document.getElementById('useDemo');
  if (!drop || !input || !demo) return;
  drop.addEventListener('click', event => { if (event.target !== input) input.click(); });
  drop.addEventListener('dragover', event => { event.preventDefault(); drop.classList.add('drag'); });
  drop.addEventListener('dragleave', () => drop.classList.remove('drag'));
  drop.addEventListener('drop', event => { event.preventDefault(); drop.classList.remove('drag'); const file = event.dataTransfer.files[0]; if (file) readPack(file); });
  input.addEventListener('change', () => input.files[0] && readPack(input.files[0]));
  demo.addEventListener('click', () => { void acceptPack(demoPack, { sourceName: 'demo-pack.json', rawText: JSON.stringify(demoPack), sourceKind: 'demo' }); });
};

function fxPresetDescription(key) {
  return {
    COMFORT: '질문을 계속 보며 처음부터 차분하게 연습',
    NORMAL: '실전 감각과 편의성 사이의 균형',
    REALISTIC: '실제 대학 면접에 가까운 제약을 적용',
    HARD: '질문 의존성을 최소화하고 높은 긴장도로 연습'
  }[key] || '';
}

function fxPresentationLabel(mode) {
  return { ALWAYS_VISIBLE:'항상 표시', BLIND_AFTER_DELAY:'잠시 후 숨김', BLIND_AFTER_TTS:'질문 낭독 후 숨김', TTS_ONLY:'음성만' }[mode] || mode;
}

function fxFollowLabel(level) {
  return { LOW:'적음', NORMAL:'보통', HIGH:'많음' }[level] || level;
}

function fxVoiceOptions(profile) {
  const voices = fxKoreanVoices();
  const missing = profile.voiceURI && !voices.some(v => v.voiceURI === profile.voiceURI);
  return `<option value="">자동 선택 · 한국어 로컬 음성 우선</option>${missing ? `<option value="${safe(profile.voiceURI)}" selected>저장한 목소리 · 현재 사용 불가</option>` : ''}${voices.map(voice => `<option value="${safe(voice.voiceURI)}" ${voice.voiceURI === profile.voiceURI ? 'selected' : ''}>${safe(voice.name)} · ${voice.localService ? '로컬' : '온라인'}</option>`).join('')}`;
}

function fxVoiceSettingsMarkup(c) {
  return `<section class="card voice-settings"><div class="section-heading"><div><h2>면접관 음성</h2><p>기본 브라우저 TTS · 목소리와 말하는 방식을 조절하세요.</p></div></div><details class="voice-details"><summary>목소리·말투 조절</summary><div class="voice-profiles">${[0,1].slice(0,c.interviewerCount).map(index => {
    const p = fx.phase1Api.normalizeVoiceProfile(c.voiceProfiles?.[index] || {});
    return `<div class="voice-profile" data-voice-profile="${index}"><h3>면접관 ${index+1}</h3><div class="voice-field-grid"><label for="voiceGender${index}">성별 선호<select id="voiceGender${index}" data-voice-key="gender"><option value="auto" ${p.gender==='auto'?'selected':''}>자동 · 질문팩 선호 반영</option><option value="female" ${p.gender==='female'?'selected':''}>여성 선호</option><option value="male" ${p.gender==='male'?'selected':''}>남성 선호</option></select></label><label for="voiceStyle${index}">말투<select id="voiceStyle${index}" data-voice-key="style">${[['adaptive','면접관 성격에 맞춤'],['balanced','담백하게'],['calm','차분하게'],['warm','부드럽게'],['firm','단호하게']].map(([key,label])=>`<option value="${key}" ${p.style===key?'selected':''}>${label}</option>`).join('')}</select></label><label class="voice-wide" for="voiceName${index}">한국어 목소리<select id="voiceName${index}" data-voice-key="voiceURI">${fxVoiceOptions(p)}</select></label><label for="voiceRate${index}">말의 빠르기 <output>${p.rate.toFixed(2)}배</output><input id="voiceRate${index}" data-voice-key="rate" type="range" min="0.7" max="1.3" step="0.05" value="${p.rate}"></label><label for="voicePitch${index}">높낮이 <output>${p.pitch.toFixed(2)}</output><input id="voicePitch${index}" data-voice-key="pitch" type="range" min="0.7" max="1.3" step="0.05" value="${p.pitch}"></label></div><p class="voice-resolution" data-voice-resolution="${index}"></p><button class="btn secondary" type="button" data-voice-preview="${index}">목소리 미리 듣기</button><p class="metric-label" data-voice-preview-status="${index}" aria-live="polite"></p></div>`;
  }).join('')}</div><p class="voice-limit">성별은 기기에 제공되는 목소리에 따라 달라집니다. 말투는 속도·높낮이 조합이며 감정 합성은 아닙니다. 직접 선택한 목소리가 성별 선호보다 우선합니다. 온라인 목소리는 외부 음성 서비스가 처리할 수 있습니다.</p><div class="setting-row"><div><label for="cfgTts">질문 음성</label><small>재생이 안 되면 질문을 화면으로 표시</small></div><select id="cfgTts"><option value="true" ${c.ttsEnabled ? 'selected' : ''}>사용</option><option value="false" ${!c.ttsEnabled ? 'selected' : ''}>사용 안 함</option></select></div></details></section>`;
}

function fxRefreshVoiceChoices() {
  if (!fx.config || !fx.phase1Api) return;
  document.querySelectorAll('[data-voice-profile]').forEach(el => {
    const index = Number(el.dataset.voiceProfile);
    const profile = fx.config.voiceProfiles[index];
    const select = el.querySelector('[data-voice-key="voiceURI"]');
    if (select) select.innerHTML = fxVoiceOptions(profile);
    const resolved = fx.phase1Api.resolveKoreanVoice(fxKoreanVoices(), profile);
    const note = el.querySelector('[data-voice-resolution]');
    if (note) note.textContent = resolved.warning || `사용할 목소리: ${resolved.voice.name} · ${resolved.voice.localService ? '로컬' : '온라인'}`;
  });
}

async function fxPreviewVoice(index, button) {
  if (fx.previewIndex === index) { fxCancelSpeech(); return; }
  fxCancelSpeech();
  fx.previewIndex = index;
  button.textContent = '미리 듣기 중지';
  const message = document.querySelector(`[data-voice-preview-status="${index}"]`);
  if (message) message.textContent = '설정한 목소리로 읽습니다.';
  const ok = await fxSpeak('안녕하세요. 이 활동에서 본인이 직접 수행한 부분과, 그 과정에서 배운 점을 설명해 주세요.', null, { index, profile: fx.config.voiceProfiles[index] });
  if (fx.previewIndex === index) {
    fx.previewIndex = undefined;
    if (message?.isConnected) {
      message.textContent = ok ? '미리 듣기가 끝났습니다.' : fx.speechDiagnostic?.error === 'cancelled' ? '미리 듣기를 중지했습니다.' : '음성 출력이 응답하지 않았습니다. 기기 음성을 확인하거나 다른 한국어 목소리를 선택해 주세요. 면접에서는 질문을 화면으로 표시합니다.';
      message.classList.toggle('danger-text', !ok && fx.speechDiagnostic?.error !== 'cancelled');
    }
  }
  if (button.isConnected) button.textContent = '목소리 미리 듣기';
}

function fxBindVoiceSettings() {
  fxRefreshVoiceChoices();
  document.querySelectorAll('[data-voice-key]').forEach(input => input.addEventListener('input', () => {
    const index = Number(input.closest('[data-voice-profile]').dataset.voiceProfile);
    const key = input.dataset.voiceKey;
    fx.config.voiceProfiles[index][key] = key === 'rate' || key === 'pitch' ? Number(input.value) : input.value;
    if (key === 'gender') fx.config.voiceProfiles[index].voiceURI = '';
    const output = input.parentElement.querySelector('output');
    if (output) output.textContent = `${Number(input.value).toFixed(2)}${key==='rate'?'배':''}`;
    fxRefreshVoiceChoices();
    fxSaveConfig().catch(() => {
      const status = document.querySelector(`[data-voice-preview-status="${index}"]`);
      if (status) status.textContent = '설정을 저장하지 못했습니다. 브라우저 저장소를 확인하세요.';
    });
  }));
  document.querySelectorAll('[data-voice-preview]').forEach(button => button.addEventListener('click', () => fxPreviewVoice(Number(button.dataset.voicePreview), button)));
}

setup = function() {
  if (!state.pack) return appShell('<div class="empty"><h3>먼저 질문팩이 필요합니다.</h3><p>질문팩을 가져오면 면접 환경을 설정할 수 있습니다.</p><button class="btn primary" data-nav="/app/import">질문팩 가져오기</button></div>','setup');
  fx.config ||= fxLoadConfig();
  const c = fx.config;
  const content = `<div class="app-heading"><div><h1>면접 설정</h1><p>${safe(fxCurrentPackRecord()?.displayName || '선택한 질문팩')} · 변경 내용은 자동 저장됩니다.</p></div></div><div class="preset-grid">${Object.entries(FX_PRESETS).map(([key,p]) => `<button type="button" class="preset ${c.preset === key ? 'selected' : ''}" data-preset="${key}" aria-pressed="${c.preset === key}"><strong>${p.label}</strong><span>${fxPresetDescription(key)}</span></button>`).join('')}</div><div class="settings-grid"><div><div class="card"><div class="setting-list">
  <div class="setting-row"><div><label>면접 시간</label><small>세션 최대 시간</small></div><select id="cfgMinutes">${[5,10,15,20].map(v => `<option value="${v}" ${c.minutes === v ? 'selected' : ''}>${v}분</option>`).join('')}</select></div>
  <div class="setting-row"><div><label>면접관</label><small>질문 배정에 사용하는 인원</small></div><select id="cfgInterviewers">${[1,2].map(v => `<option value="${v}" ${c.interviewerCount === v ? 'selected' : ''}>${v}명</option>`).join('')}</select></div>
  <div class="setting-row"><div><label>질문 표시</label><small>실제 면접 화면 동작</small></div><select id="cfgPresentation">${[['ALWAYS_VISIBLE','항상 표시'],['BLIND_AFTER_TTS','질문 낭독 후 숨김'],['TTS_ONLY','음성만']].map(([v,l]) => `<option value="${v}" ${c.presentationMode === v ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
  <div class="setting-row"><div><label>답변 녹음</label><small>결과에서 듣고 저장 · 이 브라우저에만 보관</small></div><select id="cfgRecording"><option value="true" ${c.recordingEnabled ? 'selected' : ''}>켜짐</option><option value="false" ${!c.recordingEnabled ? 'selected' : ''}>꺼짐</option></select></div>
  <details class="advanced-settings"><summary>세부 설정</summary><div class="setting-row"><div><label>준비 시간</label><small>질문을 들은 뒤 생각 시간</small></div><select id="cfgPrep">${[[0,'없음'],[3000,'3초'],[5000,'5초'],[10000,'10초']].map(([v,l]) => `<option value="${v}" ${c.prepMs === v ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
  <div class="setting-row"><div><label>질문 다시 듣기</label><small>답변 중 TTS 재생 허용</small></div><select id="cfgReplay"><option value="true" ${c.replayAllowed ? 'selected' : ''}>허용</option><option value="false" ${!c.replayAllowed ? 'selected' : ''}>금지</option></select></div>
  <div class="setting-row"><div><label>타이머</label><small>면접 중 남은 시간 표시</small></div><select id="cfgTimer"><option value="true" ${c.timerVisible ? 'selected' : ''}>표시</option><option value="false" ${!c.timerVisible ? 'selected' : ''}>숨김</option></select></div>
  <div class="setting-row"><div><label>꼬리질문</label><small>조건이 맞을 때 삽입하는 최대 경향</small></div><select id="cfgFollow">${[['LOW','적음'],['NORMAL','보통'],['HIGH','많음']].map(([v,l]) => `<option value="${v}" ${c.followupLevel === v ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
  </details></div></div>${fxVoiceSettingsMarkup(c)}</div><aside class="summary-panel"><h3>${FX_PRESETS[c.preset].label} 면접</h3><p>${c.minutes}분 · 면접관 ${c.interviewerCount}명</p><p>${fxPresentationLabel(c.presentationMode)}</p><p>${c.recordingEnabled ? '답변 녹음 켜짐' : '답변 녹음 꺼짐'}</p><button class="btn primary wide" style="margin-top:20px" data-nav="/app/device-test">환경 점검으로</button><button class="btn ghost wide" data-nav="/app/packs">질문팩 변경</button></aside></div>`;
  setTimeout(fxBindSetup, 0);
  return appShell(content,'setup');
};

function fxBindSetup() {
  fxBindVoiceSettings();
  document.querySelectorAll('.setting-row').forEach(row => { const input = row.querySelector('select'); const label = row.querySelector('label'); if (input && label) label.htmlFor = input.id; });
  document.querySelectorAll('[data-preset]').forEach(el => el.addEventListener('click', () => {
    const voiceProfiles = fx.config.voiceProfiles;
    const recordingEnabled = fx.config.recordingEnabled;
    fx.config = { ...fxDefaultConfig(el.dataset.preset), voiceProfiles, recordingEnabled };
    state.preset = el.dataset.preset;
    fxSaveConfig();
    render();
  }));
  const bindings = [
    ['cfgMinutes','minutes', value => Number(value)], ['cfgInterviewers','interviewerCount', value => Number(value)], ['cfgPresentation','presentationMode', String],
    ['cfgPrep','prepMs', value => Number(value)], ['cfgReplay','replayAllowed', value => value === 'true'], ['cfgTimer','timerVisible', value => value === 'true'],
    ['cfgFollow','followupLevel', String], ['cfgTts','ttsEnabled', value => value === 'true'], ['cfgRecording','recordingEnabled', value => value === 'true']
  ];
  for (const [id,key,parse] of bindings) document.getElementById(id)?.addEventListener('change', event => {
    fx.config[key] = parse(event.target.value);
    if ((fx.config.presentationMode === 'TTS_ONLY' || fx.config.presentationMode === 'BLIND_AFTER_TTS') && !fx.config.ttsEnabled) fx.config.presentationMode = 'ALWAYS_VISIBLE';
    if (fx.config.presentationMode === 'TTS_ONLY' || fx.config.presentationMode === 'BLIND_AFTER_TTS') fx.config.ttsEnabled = true;
    fxSaveConfig();
    render();
  });
}

deviceTest = function() {
  fx.config ||= fxLoadConfig();
  const row = (label, desc, status, good) => `<div class="check-row ${good ? 'good' : ''}"><div class="check-dot">${good ? '✓' : status === '확인 전' ? '…' : '!'}</div><div><strong>${label}</strong><div class="metric-label">${desc}</div></div><span class="status">${status}</span></div>`;
  const micStatus = fx.device.mic === 'good' ? ['정상',true] : fx.device.mic === 'bad' ? ['오류',false] : ['확인 전',false];
  const sttStatus = fxSpeechRecognitionCtor() ? ['사용 가능',true] : ['지원 안 됨',false];
  const ttsStatus = !fx.config.ttsEnabled ? ['꺼짐',true] : fxKoreanVoices().length ? ['목소리 있음',true] : ['화면 표시',false];
  const recordingStatus = !fx.config.recordingEnabled ? ['꺼짐',true] : window.MediaRecorder ? ['사용 가능',true] : ['지원 안 됨',false];
  const storageStatus = fx.db ? ['정상',true] : ['오류',false];
  const canStart = fx.device.mic === 'good' && (!fx.config.recordingEnabled || Boolean(window.MediaRecorder));
  const content = `<div class="app-heading"><div><h1>면접 환경 점검</h1><p>마이크 입력과 질문 목소리를 확인하세요.</p></div><button class="btn ${canStart?'secondary':'primary'}" id="runDeviceCheck">${fx.device.mic === 'idle' ? '점검 시작' : '다시 점검'}</button></div>
  <div class="grid-2"><div><div class="check-stack">${row('마이크','답변을 듣는 입력 장치',...micStatus)}${row('한국어 음성 인식','답변 전사에 사용',...sttStatus)}${row('질문 음성','기본 브라우저 한국어 TTS',...ttsStatus)}${row('답변 녹음','질문별 오디오 · 결과에서 듣고 저장',...recordingStatus)}${fx.device.storage==='bad'?row('기록 저장','저장소를 사용할 수 없습니다.',...storageStatus):''}</div>${fx.device.error ? `<div class="notice danger" style="margin-top:16px">${safe(fx.device.error)}</div>` : ''}${!fxSpeechRecognitionCtor()?'<p class="metric-label" style="margin-top:16px">음성 인식이 없어도 면접과 녹음은 가능합니다. 전사 기반 지표는 제한됩니다.</p>':''}</div>
  <div class="card"><h3>평소 말하듯 읽어보세요.</h3><p style="margin:16px 0;color:var(--ink);font-size:18px;line-height:1.65">“안녕하세요. 면접 준비를 시작하겠습니다.”</p><div class="mic-meter"><div class="mic-meter-fill" id="liveMicFill" style="width:2%"></div></div><div class="metric-label" id="liveMicLabel" style="margin-top:9px">마이크 점검을 시작하세요.</div><button class="btn secondary" id="deviceVoicePreview" style="margin-top:20px" ${fx.config.ttsEnabled ? '' : 'disabled'}>질문 목소리 미리 듣기</button><p class="metric-label" data-voice-preview-status="0" aria-live="polite"></p><details class="technical-details"><summary>음성 측정의 한계</summary><p>음성 인식은 브라우저에 따라 온라인 처리될 수 있습니다. Silero VAD는 아직 연결되지 않았으며, 발화·침묵은 마이크 RMS 기반 간이 추정입니다. 이 한계는 결과 ZIP에도 기록됩니다.</p></details></div></div>
  <div class="card device-ready"><div><h3>${canStart?'면접을 시작할 수 있습니다.':'마이크와 녹음 설정을 확인하세요.'}</h3><p>${FX_PRESETS[fx.config.preset].label} 면접 · 최대 ${fx.config.minutes}분<br>${fx.config.recordingEnabled ? '답변 시작부터 완료까지 녹음합니다. 원본 오디오는 이 브라우저에만 저장됩니다.' : '녹음이 꺼져 있습니다. 결과에서 답변 음성을 들을 수 없습니다.'}</p><button class="btn ghost" data-nav="/app/setup">설정으로 돌아가기</button></div><button class="btn ${canStart?'primary':'secondary'}" id="startInterviewFromCheck" disabled>면접 시작</button></div>`;
  setTimeout(() => {
    document.getElementById('runDeviceCheck')?.addEventListener('click', async () => { await fxRunDeviceCheck(); setTimeout(fxStartDeviceMeter, 30); });
    document.getElementById('deviceVoicePreview')?.addEventListener('click', event => fxPreviewVoice(0, event.currentTarget));
    const startButton = document.getElementById('startInterviewFromCheck');
    startButton?.addEventListener('click', async () => {
      const record = fxCurrentPackRecord();
      if (!record) return go('/app/import');
      if (fx.activeSession) return;
      fxCancelSpeech();
      fx.activeSession = fxCreateSession(record);
      await fxSaveActiveSession();
      go('/app/interview');
    });
    if (startButton) startButton.disabled = !canStart;
    if (fx.device.mic === 'good') fxStartDeviceMeter();
  }, 0);
  return appShell(content,'setup');
};

interview = function() {
  if (!fx.activeSession) {
    setTimeout(() => go('/app/packs'),0);
    return appShell('<p>질문팩 화면에서 면접을 준비하거나 저장된 면접을 이어가세요.</p>','packs');
  }
  const current = fxCurrentQuestionData();
  if (!current) {
    setTimeout(() => fxCompleteSession(false), 10);
    return '<div class="interview-shell"><div class="interview-stage"><div class="empty"><h3>면접을 마무리하고 있습니다.</h3></div></div></div>';
  }
  const session = fx.activeSession;
  const packRecord = current.packRecord;
  const interviewerCards = session.interviewers.map((id,index) => {
    return `<div class="interview-persona ${id === current.entry.interviewer_id ? 'active' : ''}" data-interviewer="${id}"><div class="portrait" aria-hidden="true"></div><div class="name">면접관 ${index+1}</div></div>`;
  }).join('');
  const initiallyVisible = session.config.presentationMode !== 'TTS_ONLY';
  setTimeout(fxBindInterviewRuntime, 0);
  return `<div class="interview-shell"><div class="interview-top"><span class="brand-mark">面逆力</span><div class="interview-toolbar"><span id="interviewProgress">질문 ${session.cursor+1} / ${session.queue.length}</span><span id="interviewTimer">${session.config.timerVisible ? `${Math.ceil(fxRemainingMs(session) / 60000)}분 남음` : ''}</span><button class="btn ghost" id="quitInterview">면접 종료</button></div></div><div class="interview-stage"><div class="interview-personas">${interviewerCards}</div><div class="question-zone"><h2 id="interviewQuestion" class="${initiallyVisible ? '' : 'question-hidden'}">${safe(current.entry.selected_text)}</h2></div><div class="speaking-state"><div class="pulse"></div><span id="interviewStatus" aria-live="polite">질문을 준비하고 있습니다</span></div><div class="live-answer-panel"><div class="mic-meter" aria-label="마이크 입력"><div class="mic-meter-fill" id="answerMeterFill" style="width:2%"></div></div><details class="live-transcript-detail"><summary>답변 전사 보기</summary><div id="liveTranscript" class="live-transcript">음성 인식이 지원되면 답변이 여기에 표시됩니다.</div></details></div><div class="answer-actions">${session.config.replayAllowed ? '<button class="btn secondary" id="replayQuestionButton" disabled>질문 다시 듣기</button>' : ''}<button class="btn primary" id="answerCompleteButton" disabled>답변 완료</button></div></div></div>`;
};

function fxBindInterviewRuntime() {
  const panel = document.querySelector('.live-answer-panel');
  if (panel && !document.getElementById('recordingStatus')) {
    const status = document.createElement('p');
    status.id = 'recordingStatus';
    status.className = 'recording-status';
    status.setAttribute('aria-live', 'polite');
    status.textContent = fx.activeSession?.config.recordingEnabled ? '답변 시작부터 녹음합니다.' : '답변 녹음 꺼짐';
    panel.appendChild(status);
  }
  document.getElementById('answerCompleteButton')?.addEventListener('click', fxFinishAnswer);
  document.getElementById('replayQuestionButton')?.addEventListener('click', fxReplayQuestion);
  document.getElementById('quitInterview')?.addEventListener('click', async () => {
    if (confirm('면접을 종료할까요? 지금까지의 답변은 저장됩니다.')) await fxAbortSession();
  });
  if (fx.interview.phase === 'IDLE') setTimeout(fxPrepareCurrentQuestion, 80);
}

resultPage = function() {
  const rawPath = myeokCurrentPath();
  const id = rawPath.split('/').pop();
  let session = (fx.activeResult?.session_id === id ? fx.activeResult : null) || fx.sessions.find(item => item.session_id === id);
  if (!session && id === 'demo') session = fx.sessions[0] || null;
  if (!session) {
    setTimeout(async () => {
      const loaded = await fxDbGet('sessions', id);
      if (loaded) { fx.activeResult = loaded; render(); }
    }, 0);
    return appShell('<div class="empty"><h3>결과를 불러오는 중입니다.</h3><p>저장된 세션을 확인하고 있습니다.</p></div>','history');
  }
  fx.activeResult = session;
  session.summary ||= fxSummary(session);
  const s = session.summary;
  const tabs = [['overview','요약'],['questions','질문별'],['timeline','타임라인'],['transcript','전사']];
  setTimeout(() => {
    fxBindRecordingPlayers(session);
    document.querySelectorAll('[data-tab]').forEach(el => el.addEventListener('click', () => { state.resultTab = el.dataset.tab; render(); }));
    document.querySelectorAll('[data-export-zip]').forEach(el => el.addEventListener('click', () => fxExportSession(session)));
    document.getElementById('downloadHandoff')?.addEventListener('click', () => fxDownload(`handoff_${session.session_id}.json`, new Blob([JSON.stringify(fxBuildHandoff(session), null, 2)], { type: 'application/json' })));
  }, 0);
  const header = `<div class="result-header"><div><h1>${session.truncated ? '면접을 종료했습니다.' : '면접 결과'}</h1><p>${fxFormatDuration(session.interview_duration_ms)} · 질문 ${session.questions.length}개 · 발화 ${fxFormatDuration(s.total_speech_duration_ms)}</p></div><button class="btn primary" data-export-zip>평가용 ZIP 저장</button></div>`;
  const stats = `<div class="stat-grid" style="margin-top:18px"><div class="stat-card"><div class="value">${s.mean_response_latency_ms === null ? 'N/A' : (s.mean_response_latency_ms / 1000).toFixed(1) + '초'}</div><div class="label">평균 답변 시작</div></div><div class="stat-card"><div class="value">${s.total_answer_duration_ms ? Math.round(s.total_answer_duration_ms / Math.max(1, session.questions.length) / 1000) + '초' : 'N/A'}</div><div class="label">평균 답변 길이</div></div><div class="stat-card"><div class="value">${s.total_pause_2000ms_count ?? 'N/A'}</div><div class="label">2초 이상 정지</div></div><div class="stat-card"><div class="value">${s.mean_characters_per_minute_total === null ? 'N/A' : Math.round(s.mean_characters_per_minute_total)}</div><div class="label">평균 분당 글자</div></div></div>`;
  return appShell(`${header}${session.save_error ? `<div class="notice danger" role="alert">${safe(session.save_error)}</div>` : ''}${state.resultTab === 'overview' ? fxRecordingsMarkup(session) : ''}${stats}<div class="tabs" role="tablist" aria-label="면접 결과">${tabs.map(([key,label]) => `<button type="button" role="tab" aria-selected="${state.resultTab===key}" class="tab ${state.resultTab === key ? 'active' : ''}" data-tab="${key}">${label}</button>`).join('')}</div>${fxResultContent(session)}<details class="result-tools"><summary>다시 연습·추가 자료</summary><div class="secondary-actions"><button class="btn secondary" data-nav="/app/packs">새 면접 준비</button><a class="btn secondary" href="./core_md/학생부기반_실전면접_평가엔진_v1.2_FINAL.md" download>평가 엔진 받기</a><button class="btn ghost" id="downloadHandoff">원본 기록 JSON</button><button class="btn ghost" data-nav="/app/compare">최근 기록 비교</button></div></details>`,'history');
};

function fxResultContent(session) {
  if (state.resultTab === 'questions') return `<div class="q-list" style="margin-top:22px">${session.questions.map((q,index) => `<div class="q-row"><div class="q-index">${index+1}</div><div><h4>${safe(q.question_text)}</h4><p>${fxFormatMs(q.timing.answer_duration_ms)} · 시작 ${fxFormatMs(q.timing.response_latency_ms)} · 2초 이상 정지 ${q.speech_metrics.pause_2000ms_count ?? 'N/A'}회</p></div></div>`).join('')}</div>`;
  if (state.resultTab === 'timeline') return `<div style="display:grid;gap:14px;margin-top:22px">${session.questions.map((q,index) => `<div class="card"><h3>질문 ${index+1}. ${safe(q.question_text)}</h3>${fxTimelineHtml(q)}<div class="metric-label">검은 구간은 발화, 밝은 구간은 침묵의 간이 추정입니다.</div></div>`).join('')}</div>`;
  if (state.resultTab === 'transcript') return `<div style="display:grid;gap:14px;margin-top:22px">${session.questions.map((q,index) => `<div class="card"><h3>질문 ${index+1}. ${safe(q.question_text)}</h3><p style="margin-top:20px;line-height:1.9;color:#3e3e3a">${safe(q.answer_transcript || '전사 결과가 없습니다.')}</p><details><summary>기록 상태</summary><p>답변 ${safe(q.answer_status)} · STT ${safe(q.data_quality.stt)} · 녹음 ${safe(q.data_quality.recording)}</p></details></div>`).join('')}</div>`;
  const summary = session.summary || fxSummary(session);
  return `<section class="card result-summary"><h2>다음 답변을 더 좋게.</h2><p>녹음으로 말하는 흐름을 돌아보고, 질문별 기록과 전사를 함께 확인하세요. 내용 분석은 평가용 ZIP과 평가 엔진을 ChatGPT에 첨부해 진행할 수 있습니다.</p><p class="metric-label">발화·정지 수치는 간이 추정값이며 내용 평가나 점수가 아닙니다.</p><details class="technical-details"><summary>측정 범위·기술 정보</summary><div class="validation-list"><div class="validation-item"><span>시간 측정</span><strong>${summary.coverage.question_count_with_timing} / ${summary.coverage.question_count_total}</strong></div><div class="validation-item"><span>간이 발화 측정</span><strong>${summary.coverage.question_count_with_vad} / ${summary.coverage.question_count_total}</strong></div><div class="validation-item"><span>전사</span><strong>${summary.coverage.question_count_with_stt} / ${summary.coverage.question_count_total}</strong></div><div class="validation-item"><span>필러 지표</span><strong>${summary.coverage.question_count_with_filler_metrics} / ${summary.coverage.question_count_total}</strong></div></div><p>Silero VAD 미연결. 현재 발화와 정지는 마이크 RMS 기반 테스트 측정치입니다. 원본 이벤트와 한계는 평가용 ZIP에 그대로 기록됩니다.</p></details></section>`;
}

dashboard = function() {
  const active = fxCurrentPackRecord();
  state.pack = active?.pack || state.pack;
  const recent = fx.sessions.filter(s => s.status === 'COMPLETED').slice(0,3);
  const latest = recent[0];
  const content = `<div class="app-heading"><div><h1>면접 공간</h1><p>이 브라우저의 질문팩과 실제 면접 세션을 관리합니다.</p></div><button class="btn primary" data-nav="${active ? '/app/setup' : '/app/import'}">새 면접</button></div>${active ? `<div class="card pack-card"><div><div class="page-kicker">활성 질문팩</div><h3 style="margin-top:8px">${safe(active.pack.target?.university || '지원 대학 미지정')} ${safe(active.pack.target?.department || '')}</h3><div class="pack-meta"><span>질문 ${active.pack.question_bank?.length || 0}개</span><span>면접관 ${active.pack.interviewer_pool?.length || 0}명</span><span class="badge success">검증 완료</span></div></div><button class="btn accent" data-nav="/app/setup">이 질문팩으로 면접</button></div>` : `<div class="empty"><h3>첫 면접을 준비해볼까요?</h3><p>interview-pack.json 하나만 있으면 시작할 수 있습니다.</p><button class="btn primary" data-nav="/app/import">질문팩 가져오기</button></div>`}<div style="height:28px"></div><div class="grid-2"><div><div class="app-heading" style="margin-bottom:14px"><div><h1 style="font-size:24px">최근 면접</h1></div><button class="btn ghost" data-nav="/app/history">전체 보기</button></div><div class="card">${recent.length ? recent.map(x => `<div class="validation-item"><div><strong>${new Date(x.created_at).toLocaleDateString('ko-KR')}</strong><div class="metric-label">${FX_PRESETS[x.config?.preset]?.label || x.config?.preset} / ${x.questions?.length || 0}문항</div></div><button class="btn ghost" data-nav="/app/result/${x.session_id}">${fxFormatDuration(x.interview_duration_ms)}</button></div>`).join('') : '<div class="metric-label">아직 완료된 면접이 없습니다.</div>'}</div></div><div><div class="app-heading" style="margin-bottom:14px"><div><h1 style="font-size:24px">최근 측정</h1></div></div><div class="card">${latest ? `<div class="stat-grid" style="grid-template-columns:1fr 1fr"><div class="stat-card"><div class="value">${latest.summary?.mean_response_latency_ms ? (latest.summary.mean_response_latency_ms / 1000).toFixed(1) + '초' : 'N/A'}</div><div class="label">평균 답변 시작</div></div><div class="stat-card"><div class="value">${latest.summary?.total_silence_duration_ms && latest.summary?.total_answer_duration_ms ? Math.round(latest.summary.total_silence_duration_ms / latest.summary.total_answer_duration_ms * 100) + '%' : 'N/A'}</div><div class="label">침묵 비율</div></div></div>` : '<div class="metric-label">첫 면접을 완료하면 실제 측정값이 표시됩니다.</div>'}</div></div></div>`;
  return appShell(content,'dashboard');
};

packs = function() {
  const activeSha = fx.activePackSha256;
  const selected = fx.packs.find(record => record.sha256 === activeSha);
  const others = fx.packs.filter(record => record.sha256 !== activeSha);
  const checkpoint = fx.sessions.find(session => session.status === 'IN_PROGRESS' && !fx.dismissedCheckpoints?.includes(session.session_id));
  const packDetails = record => `<details class="pack-details"><summary>관리·상세 정보</summary><dl><dt>원본 파일</dt><dd>${safe(record.sourceName)}</dd><dt>규격</dt><dd>${safe(record.pack.pack_schema || 'INTERVIEW_PACK/1.0')}</dd><dt>질문팩 ID</dt><dd>${safe(record.pack_id || record.pack.pack_id || record.packId)}</dd><dt>SHA-256</dt><dd>${safe(record.sha256)}</dd></dl><button class="btn ghost danger-text" data-delete-pack="${record.sha256}">질문팩 삭제</button></details>`;
  const packSummary = record => `<h3>${safe(record.displayName || record.pack.target?.university || '질문팩')}</h3><p class="pack-meta">질문 ${record.questionCount ?? record.pack.question_bank?.length ?? 0}개 · 최근 사용 ${record.lastUsedAt ? new Date(record.lastUsedAt).toLocaleDateString('ko-KR') : '없음'}</p>${record.validationStatus === 'VALID' ? '' : '<p class="danger-text">검증 오류가 있어 사용할 수 없습니다.</p>'}`;
  const content = `<div class="app-heading"><div><h1>질문팩</h1><p>사용할 질문팩을 고르고 면접을 준비하세요.</p></div></div><div id="packsError" aria-live="polite"></div>${checkpoint ? `<section class="checkpoint"><div><h2>진행 중이던 면접이 있습니다.</h2><p>${new Date(checkpoint.created_at).toLocaleString('ko-KR')} · 답변 ${checkpoint.questions?.length || 0}개 저장됨</p></div><div class="secondary-actions"><button class="btn secondary" id="resumeInterview">이어하기</button><button class="btn ghost" id="prepareNewInterview">새 면접 준비</button></div></section>` : ''}${selected ? `<section class="card selected-pack" aria-label="선택한 질문팩"><div class="selected-pack-main"><div><span class="metric-label">선택한 질문팩</span>${packSummary(selected)}</div><button class="btn primary" data-nav="/app/setup" ${selected.validationStatus==='VALID'?'':'disabled'}>면접 설정으로</button></div>${packDetails(selected)}</section>` : state.importStatus==='INITIALIZING' ? '' : '<p class="empty-pack">아직 질문팩이 없습니다. 아래에서 JSON 파일을 추가하세요.</p>'}${others.length ? `<section class="other-packs"><h2>다른 질문팩</h2><div class="pack-list">${others.map(record => `<article class="card"><div class="pack-row"><div>${packSummary(record)}</div><button class="btn secondary" data-activate-pack="${record.sha256}" ${record.validationStatus === 'VALID' ? '' : 'disabled'}>선택</button></div>${packDetails(record)}</article>`).join('')}</div></section>` : ''}${importMarkup()}`;
  setTimeout(() => {
    bindImport();
    const report = error => { const area=document.getElementById('packsError'); if(area) area.innerHTML=`<div class="notice danger">질문팩 작업을 완료하지 못했습니다. 저장소를 확인해 주세요.<details><summary>기술 정보</summary><code>${safe(error?.message || String(error))}</code></details></div>`; };
    document.getElementById('resumeInterview')?.addEventListener('click', async () => {
      try {
        const record=fx.packs.find(pack=>pack.sha256===checkpoint.pack_sha256);
        if (!record) throw new Error('진행 중 면접의 질문팩이 없습니다. 원래 JSON 파일을 다시 추가해 주세요.');
        await fx.phase1.activatePack(record.sha256);
        fx.activePackSha256=record.sha256; state.pack=record.pack;
        fx.activeSession={...checkpoint, started_perf:performance.now()-(checkpoint.interview_duration_ms||0)};
        fx.interview.phase='IDLE';
        go('/app/interview');
      } catch(error) { report(error); }
    });
    document.getElementById('prepareNewInterview')?.addEventListener('click', () => { fx.activeSession=null; fx.interview.phase='IDLE'; fx.dismissedCheckpoints=[...(fx.dismissedCheckpoints||[]),checkpoint.session_id]; go('/app/packs'); });
    document.querySelectorAll('[data-activate-pack]').forEach(el => el.addEventListener('click', async () => {
      try {
      await fx.phase1.activatePack(el.dataset.activatePack);
      const snapshot = await fx.phase1.snapshot();
      fx.packs = snapshot.packs;
      fx.activePackSha256 = snapshot.activePackSha256;
      state.pack = snapshot.activePack?.pack || null;
      render();
      } catch(error) { report(error); }
    }));
    document.querySelectorAll('[data-delete-pack]').forEach(el => el.addEventListener('click', async () => {
      const target = fx.packs.find(record => record.sha256 === el.dataset.deletePack);
      if (!target || !confirm(`'${target.displayName}' 질문팩을 삭제할까요?`)) return;
      try {
      const snapshot = await fx.phase1.deletePack(target.sha256);
      fx.packs = snapshot.packs;
      fx.activePackSha256 = snapshot.activePackSha256;
      state.pack = snapshot.activePack?.pack || null;
      render();
      } catch(error) { report(error); }
    }));
  }, 0);
  return appShell(content,'packs');
};

historyPage = function() {
  const completed = fx.sessions.filter(s => s.status === 'COMPLETED');
  const content = `<div class="app-heading"><div><h1>면접 기록</h1><p>이 브라우저에 저장된 면접입니다.</p></div></div>${completed.length ? `<div class="card">${completed.map(session => `<div class="validation-item"><div><strong>${new Date(session.created_at).toLocaleString('ko-KR')}</strong><div class="metric-label">${FX_PRESETS[session.config?.preset]?.label || '면접'} · 질문 ${session.questions?.length || 0}개${session.truncated?' · 중도 종료':''}</div></div><div class="secondary-actions"><span>${fxFormatDuration(session.interview_duration_ms)}</span><button class="btn secondary" data-nav="/app/result/${session.session_id}">결과 보기</button></div></div>`).join('')}</div>` : '<div class="empty"><h3>아직 면접 기록이 없습니다.</h3><p>면접을 마치면 이곳에서 다시 볼 수 있습니다.</p><button class="btn primary" data-nav="/app/packs">면접 준비하기</button></div>'}`;
  return appShell(content,'history');
};

comparePage = function() {
  const completed = fx.sessions.filter(s => s.status === 'COMPLETED').slice(0,2);
  if (completed.length < 2) return appShell('<div class="empty"><h3>비교할 면접이 아직 부족합니다.</h3><p>완료된 세션이 두 개 이상 필요합니다.</p><button class="btn primary" data-nav="/app/setup">면접 연습하기</button></div>','history');
  const current = completed[0];
  const previous = completed[1];
  const pairs = [
    ['평균 답변 시작', previous.summary?.mean_response_latency_ms, current.summary?.mean_response_latency_ms, fxFormatMs],
    ['2초 이상 정지', previous.summary?.total_pause_2000ms_count, current.summary?.total_pause_2000ms_count, value => value === null || value === undefined ? 'N/A' : `${value}회`],
    ['최장 정지', previous.summary?.session_longest_pause_ms, current.summary?.session_longest_pause_ms, fxFormatMs],
    ['평균 CPM', previous.summary?.mean_characters_per_minute_total, current.summary?.mean_characters_per_minute_total, value => value === null || value === undefined ? 'N/A' : Math.round(value)]
  ];
  return appShell(`<div class="app-heading"><div><h1>세션 비교</h1><p>최근 두 세션의 실제 측정값만 비교합니다.</p></div></div><div class="card"><div class="grid-2"><div><div class="page-kicker">이전</div><h3>${new Date(previous.created_at).toLocaleString('ko-KR')}</h3></div><div><div class="page-kicker">현재</div><h3>${new Date(current.created_at).toLocaleString('ko-KR')}</h3></div></div></div><div class="card" style="margin-top:18px"><div class="validation-list">${pairs.map(([label,a,b,format]) => `<div class="validation-item"><strong>${label}</strong><span style="display:flex;gap:28px"><span>${format(a)}</span><span>→</span><span>${format(b)}</span></span></div>`).join('')}</div></div><div class="notice" style="margin-top:18px">변화 수치를 그대로 보여주며 실력 향상이나 하락으로 자동 해석하지 않습니다.</div>`,'history');
};

window.addEventListener('beforeunload', () => {
  fxStopDeviceMeter();
  fxCancelSpeech();
});

window.addEventListener('beforeunload', event => {
  if (fx.activeSession?.status === 'IN_PROGRESS') { event.preventDefault(); event.returnValue = ''; }
});
if ('speechSynthesis' in window) speechSynthesis.addEventListener('voiceschanged', fxRefreshVoiceChoices);

fxBootstrap();
