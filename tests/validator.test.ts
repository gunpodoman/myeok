import { describe, expect, it } from 'vitest';
import type { InterviewPack, Question } from '../src/phase1/domain';
import { validateInterviewPack } from '../src/phase1/validator';
import { makeValidPack } from './fixtures/validPack';

function clonePack(): InterviewPack {
  return structuredClone(makeValidPack());
}

function expectInvalid(pack: unknown, pathPart?: string, code?: string): void {
  const result = validateInterviewPack(pack);
  expect(result.ok).toBe(false);
  if (pathPart) expect(result.issues.some(item => item.path.includes(pathPart))).toBe(true);
  if (code) expect(result.issues.some(item => item.code === code)).toBe(true);
  expect(result.issues.every(item => item.message && item.developerDetail)).toBe(true);
}

describe('INTERVIEW_PACK/1.0 structural validation', () => {
  it('accepts a valid closed pack', () => {
    const result = validateInterviewPack(makeValidPack());
    expect(result.ok).toBe(true);
    expect(result.pack?.schema).toBe('INTERVIEW_PACK/1.0');
  });

  it('rejects an invalid schema identifier', () => {
    expectInvalid({ ...makeValidPack(), schema: 'INTERVIEW_PACK/2.0' }, 'schema');
  });

  it('rejects an unknown core field', () => {
    expectInvalid({ ...makeValidPack(), unexpected: true }, '$', 'SCHEMA_INVALID');
  });

  it('rejects an invalid enum', () => {
    const pack = clonePack();
    (pack.question_bank[0] as unknown as { cognitive_difficulty: string }).cognitive_difficulty = 'D7';
    expectInvalid(pack, 'cognitive_difficulty');
  });

  it('rejects malformed runtime triggers', () => {
    const pack = clonePack();
    (pack.question_bank[0] as unknown as { runtime_trigger: unknown }).runtime_trigger = {
      type: 'ANSWER_TOO_SHORT', threshold_ms: 0
    };
    expectInvalid(pack, 'runtime_trigger');
  });

  it('rejects invalid recommended answer ranges', () => {
    const pack = clonePack();
    pack.question_bank[0].recommended_answer_seconds = { min: 61, max: 60 };
    expectInvalid(pack, 'recommended_answer_seconds');
  });

  it('rejects invalid priority and coverage tags', () => {
    const priorityPack = clonePack();
    priorityPack.question_bank[0].priority = 6;
    expectInvalid(priorityPack, 'priority');

    const coveragePack = clonePack();
    (coveragePack.question_bank[0] as unknown as { coverage_tags: string[] }).coverage_tags = ['unknown'];
    expectInvalid(coveragePack, 'coverage_tags');
  });
});

describe('INTERVIEW_PACK/1.0 semantic validation', () => {
  it.each([
    ['question', 'DUPLICATE_QUESTION_ID', (pack: InterviewPack) => { pack.question_bank[1].question_id = 'Q001'; }],
    ['evidence', 'DUPLICATE_EVIDENCE_ID', (pack: InterviewPack) => { pack.record_evidence[1].evidence_id = 'E001'; }],
    ['interviewer', 'DUPLICATE_INTERVIEWER_ID', (pack: InterviewPack) => { pack.interviewer_pool[1].interviewer_id = 'I01'; }]
  ])('rejects duplicate %s IDs', (_label, code, mutate) => {
    const pack = clonePack();
    mutate(pack);
    expectInvalid(pack, undefined, code);
  });

  it('rejects a missing evidence reference', () => {
    const pack = clonePack();
    pack.question_bank[0].evidence_ids = ['E999'];
    expectInvalid(pack, undefined, 'MISSING_EVIDENCE_REFERENCE');
  });

  it('rejects a missing parent', () => {
    const pack = clonePack();
    pack.question_bank[1].parent_question_id = 'Q999';
    expectInvalid(pack, undefined, 'MISSING_PARENT');
  });

  it('rejects an invalid root reference', () => {
    const pack = clonePack();
    pack.question_bank[1].root_question_id = 'Q002';
    expectInvalid(pack, undefined, 'SELF_REFERENCE');
  });

  it('rejects a direct child mismatch', () => {
    const pack = clonePack();
    pack.question_bank[0].followup_ids = [];
    expectInvalid(pack, undefined, 'DIRECT_CHILD_MISMATCH');
  });

  it('rejects self references', () => {
    const pack = clonePack();
    pack.question_bank[0].followup_ids = ['Q001'];
    expectInvalid(pack, undefined, 'SELF_REFERENCE');
  });

  it('rejects graph cycles', () => {
    const pack = clonePack();
    const third = structuredClone(pack.question_bank[1]);
    third.question_id = 'Q003';
    third.parent_question_id = 'Q002';
    third.root_question_id = 'Q001';
    third.followup_ids = ['Q002'];
    pack.question_bank[1].parent_question_id = 'Q003';
    pack.question_bank[1].followup_ids = ['Q003'];
    pack.question_bank[0].followup_ids = [];
    pack.question_bank.push(third);
    expectInvalid(pack, undefined, 'GRAPH_CYCLE');
  });

  it('rejects ROOT/FOLLOWUP question type mismatches', () => {
    const pack = clonePack();
    pack.question_bank[0].question_type = 'BOUNDARY';
    expectInvalid(pack, undefined, 'ROOT_QUESTION_TYPE_MISMATCH');
  });

  it('rejects integrity flags that disagree with actual data', () => {
    const pack = clonePack();
    pack.integrity.graph_validation_passed = false;
    expectInvalid(pack, 'integrity.graph_validation_passed', 'INTEGRITY_FLAG_MISMATCH');
  });
});
