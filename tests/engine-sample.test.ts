import { describe, expect, it } from 'vitest';
import { validateInterviewPack } from '../src/phase1/validator';
import samplePack from './fixtures/question-engine-sample-pack.json';

describe('질문 엔진 대표 샘플', () => {
  it('실제 JSON 파일이 INTERVIEW_PACK/1.0 계약을 통과한다', () => {
    const result = validateInterviewPack(samplePack);

    expect(result.ok, result.issues.map(issue => `${issue.code}: ${issue.message}`).join('\n')).toBe(true);
  });
});
