import { describe, expect, it } from 'vitest';
import { validateInterviewPack } from '../src/phase1/validator';
import samplePack from './fixtures/question-engine-sample-pack.json';

describe('질문 엔진 대표 샘플', () => {
  it('실제 JSON 파일이 INTERVIEW_PACK/1.0 계약을 통과한다', () => {
    const result = validateInterviewPack(samplePack);

    expect(result.ok, result.issues.map(issue => `${issue.code}: ${issue.message}`).join('\n')).toBe(true);
  });

  it('최신 질문 엔진 1.2 Pack도 기존 폐쇄형 계약으로 가져온다', () => {
    const pack = structuredClone(samplePack);
    pack.generator.engine_version = '1.2';
    const result = validateInterviewPack(pack);
    expect(result.ok, result.issues.map(issue => issue.message).join('\n')).toBe(true);
    expect(result.pack?.generator.engine_version).toBe('1.2');
  });

  it('알 수 없는 엔진 버전은 여전히 거부한다', () => {
    const pack = structuredClone(samplePack);
    pack.generator.engine_version = '99.0';
    expect(validateInterviewPack(pack).ok).toBe(false);
  });
});
