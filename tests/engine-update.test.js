import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { runInNewContext } from 'node:vm';
import { describe, expect, it } from 'vitest';
import { makeValidPack } from './fixtures/validPack';

const runtime = readFileSync('runtime.js', 'utf8');
function sourceFunction(name, next) {
  const start = runtime.indexOf(`function ${name}(`);
  const end = runtime.indexOf(`function ${next}(`, start);
  if (start < 0 || end < 0) throw new Error(`Missing runtime function: ${name}`);
  return runtime.slice(start, end).trim().replace(/async\s*$/, '');
}

function handoffRuntime(packs = []) {
  const fx = { packs };
  const code = [
    sourceFunction('fxSummary', 'fxSessionSourcePack'),
    sourceFunction('fxSessionSourcePack', 'fxHandoffQuestion'),
    sourceFunction('fxHandoffQuestion', 'fxBuildHandoff'),
    sourceFunction('fxBuildHandoff', 'fxCompleteSession'),
    sourceFunction('fxObserveTrigger', 'fxMaybeInsertFollowup'),
    sourceFunction('fxHandoffEvents', 'fxExportSession'),
    '({ fxBuildHandoff, fxSessionSourcePack, fxObserveTrigger, fxHandoffEvents })'
  ].join('\n');
  return runInNewContext(code, { fx, Blob, Uint8Array, TextDecoder, fxSpeechRecognitionCtor: () => null, fxRemainingMs: () => 84000 });
}

function sessionFixture() {
  const pack = makeValidPack();
  pack.generator.engine_version = '1.2';
  const question = pack.question_bank[0];
  const bytes = new TextEncoder().encode(JSON.stringify(pack, null, 2) + '\n');
  return {
    session_id: 'test-session', created_at: '2026-10-03T00:00:00Z', completed_at: '2026-10-03T00:01:00Z', interview_duration_ms: 60000,
    pack_id: pack.pack_id, pack_generator_version: '1.2', pack_raw_bytes: bytes,
    pack_sha256: createHash('sha256').update(bytes).digest('hex'), session_seed: 'test', technical_errors: [], notes: [], truncated: false,
    config: { preset: 'NORMAL', presentationMode: 'ALWAYS_VISIBLE', timerVisible: true, prepMs: 0, replayAllowed: true, interviewerCount: 1, ttsEnabled: false, recordingEnabled: false },
    questions: [{
      ...question, sequence: 1, interviewer_id: pack.interviewer_pool[0].interviewer_id, question_text: question.primary_text,
      pack_primary_text: question.primary_text, answer_status: 'ANSWERED', answer_transcript: '실제 원문입니다.',
      student_record_anchor: null, student_record_excerpt: null, runtime_signal: { type: 'AFTER_PARENT', observed: true, used_for_branching: true },
      timing: { response_latency_ms: null, answer_duration_ms: 60000, speech_duration_ms: 30000, silence_duration_ms: 30000 },
      speech_metrics: { filler_count: 2, restart_count: 0, self_correction_count: 0, pause_1000ms_count: 0, pause_2000ms_count: 0, pause_3000ms_count: 0, longest_pause_ms: 0, characters_per_minute_total: null, characters_per_minute_speech: null },
      filler_detection: { method: 'TRANSCRIPT_HEURISTIC', estimated: true },
      stt: { available: true, complete: true }, data_quality: { timing: 'GOOD', vad: 'PARTIAL', stt: 'GOOD', recording: 'UNAVAILABLE' },
      recording: { available: false, file: null, mime_type: null }, audio_blob: null, raw_energy_segments: []
    }]
  };
}

describe('최신 엔진 배포 연결', () => {
  it.each([
    ['question-engine-v1.2.md', '2C34CE4F2C925ED241A71581D3AAABBDA90DA859A848E1815A87E1273B5B81D3'],
    ['evaluation-engine-v1.4.md', '19025D938DDAC2E5ED924AD39D7CBFEE77D89CE11ABB1084CFA48823A3EA4F2C'],
    ['evaluation-handoff-v1.2.md', '53B2DD79288507A238D0BD9B866C787E5A268B854DD36E4911B9ABA5743C11F2']
  ])('%s는 사용자 제공 원본 bytes를 보존한다', (name, hash) => {
    expect(createHash('sha256').update(readFileSync(`core_md/${name}`)).digest('hex').toUpperCase()).toBe(hash);
  });

  it('실제 다운로드 링크는 최신 엔진을 가리키고 구버전은 제거한다', () => {
    const app = readFileSync('app.js', 'utf8');
    expect(app).toContain('./core_md/question-engine-v1.2.md');
    expect(app).toContain('./core_md/evaluation-engine-v1.4.md');
    expect(runtime).toContain('./core_md/evaluation-engine-v1.4.md');
    for (const old of ['학생부기반_공통_실전면접_질문엔진_v1.0_FINAL.md', '학생부기반_실전면접_평가엔진_v1.2_FINAL.md', '면접_평가_핸드오프_규격_v1.1_FINAL.md']) {
      expect(existsSync(`core_md/${old}`)).toBe(false);
      expect(app + runtime).not.toContain(old);
    }
  });
});

describe('HANDOFF 1.2 호환', () => {
  it('근거 snapshot·배열 신호·버전·발화 시간 기반 pooled rate를 내보낸다', () => {
    const session = sessionFixture();
    const handoff = handoffRuntime().fxBuildHandoff(session);
    expect(handoff.handoff_schema).toBe('INTERVIEW_EVAL_HANDOFF/1.2');
    expect(handoff.session.runtime_policy_version).toBeTruthy();
    expect(handoff.session.difficulty_engine_version).toBeTruthy();
    expect(handoff.questions[0].record_evidence.map(e => e.evidence_id)).toEqual(session.questions[0].evidence_ids);
    expect(handoff.questions[0].runtime_signals).toEqual([]);
    for (const key of ['audio_blob', 'raw_energy_segments', 'student_record_anchor', 'student_record_excerpt', 'runtime_signal']) expect(handoff.questions[0]).not.toHaveProperty(key);
    expect(handoff.summary.filler_per_minute).toBe(4);
    expect(handoff.integrity.status).toBe('PARTIAL');
    expect(handoff.integrity.missing_fields).toEqual([]);
  });

  it('구세션의 빈 전사를 답변으로 주장하지 않으며 저장 원본은 변경하지 않는다', () => {
    const session = sessionFixture();
    session.questions[0].answer_transcript = '';
    const question = handoffRuntime().fxBuildHandoff(session).questions[0];
    expect(question.answer_transcript).toBeNull();
    expect(question.answer_status).toBe('STT_UNAVAILABLE');
    expect(question.stt.available).toBe(false);
    expect(question.stt.complete).toBe(false);
    expect(session.questions[0].answer_status).toBe('ANSWERED');
  });

  it('Pack 삭제 후에도 세션 원본 bytes를 보존하고 타 Pack을 대입하지 않는다', () => {
    const session = sessionFixture();
    expect(handoffRuntime().fxSessionSourcePack(session).bytes).toBe(session.pack_raw_bytes);
    const unrelated = { sha256: 'other', pack: makeValidPack(), rawBytes: new Uint8Array([1]) };
    const legacy = { ...session, pack_raw_bytes: undefined };
    expect(handoffRuntime([unrelated]).fxSessionSourcePack(legacy).bytes).toBeNull();
    expect(handoffRuntime([unrelated]).fxBuildHandoff(legacy).integrity.missing_fields).toContain('interview-pack.json');
  });

  it('null/경계값을 짧은 답변이나 probability=0 분기로 조작하지 않는다', () => {
    const { fxObserveTrigger } = handoffRuntime();
    expect(fxObserveTrigger({ type: 'ANSWER_TOO_SHORT', threshold_ms: 1000 }, { timing: { answer_duration_ms: null } }, {}, () => 0)).toBeNull();
    expect(fxObserveTrigger({ type: 'ANSWER_TOO_SHORT', threshold_ms: 1000 }, { timing: { answer_duration_ms: 1000 } }, {}, () => 0).matched).toBe(false);
    expect(fxObserveTrigger({ type: 'RANDOM', probability: 0 }, {}, {}, () => 0).matched).toBe(false);
  });

  it('문구/남은 시간 분기의 실제 원자료와 closed-object payload를 유지한다', () => {
    const { fxObserveTrigger } = handoffRuntime();
    const phrase = fxObserveTrigger({ type: 'DONT_KNOW_PATTERN', phrases: ['잘 모르겠습니다'] }, { answer_transcript: '그 부분은 잘 모르겠습니다.' }, {}, () => 0);
    expect(phrase.branch).toEqual({ type: 'DONT_KNOW_PATTERN', matched_phrase: '잘 모르겠습니다', matched_text: '그 부분은 잘 모르겠습니다.' });
    const remaining = fxObserveTrigger({ type: 'SESSION_TIME_REMAINING', operator: 'LTE', threshold_ms: 90000 }, {}, {}, () => 0);
    expect(remaining.branch).toEqual({ type: 'SESSION_TIME_REMAINING', operator: 'LTE', measured_value: 84000, threshold_value: 90000, unit: 'ms' });
    expect(fxObserveTrigger({ type: 'AFTER_PARENT' }, {}, {}, () => 0).signal).toBeNull();
  });

  it('과거 STT 이벤트를 closed-object 형식으로 변환하되 저장 원본은 보존한다', () => {
    const session = { events: [
      { event_id: 'EV000001', question_id: 'Q001', type: 'STT_ERROR', timestamp_ms: 1, value: 'network' },
      { event_id: 'EV000002', question_id: 'Q001', type: 'STT_FINAL', timestamp_ms: 2, value: '원문' }
    ] };
    const events = handoffRuntime().fxHandoffEvents(session);
    expect(events[0]).toEqual({ event_id: 'EV000001', question_id: 'Q001', type: 'STT_ERROR', timestamp_ms: 1, metadata: { code: 'network', message: null } });
    expect(events[1]).not.toHaveProperty('value');
    expect(session.events[1].value).toBe('원문');
  });
});
