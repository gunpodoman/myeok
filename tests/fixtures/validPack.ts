import type { InterviewPack } from '../../src/phase1/domain';

export function makeValidPack(overrides: Partial<InterviewPack> = {}): InterviewPack {
  const pack: InterviewPack = {
    schema: 'INTERVIEW_PACK/1.0',
    pack_id: 'PACK_TEST001',
    generator: {
      engine_name: '학생부기반_공통_실전면접_질문엔진',
      engine_version: '1.0',
      created_at: '2026-09-27T12:00:00+09:00',
      language: 'ko-KR'
    },
    target: {
      university: '테스트대학교',
      department: '테스트학과',
      interview_type: 'student_record_based',
      default_session_minutes: 10
    },
    source_record: {
      available: true,
      embedded_full_text: false,
      student_name_included: false
    },
    record_evidence: [
      {
        evidence_id: 'E001',
        anchor: '3학년 진로활동',
        year: 3,
        category: 'career_activity',
        topic: '방법 선택',
        excerpt: '탐구 방법을 선택하고 결과를 비교함',
        normalized_summary: '방법 선택과 결과 비교',
        tags: ['method', 'result', 'ownership']
      },
      {
        evidence_id: 'E002',
        anchor: '3학년 진로활동',
        year: 3,
        category: 'career_activity',
        topic: '결과 한계',
        excerpt: '결과의 한계를 검토함',
        normalized_summary: '결과의 적용 범위를 검토함',
        tags: ['limitation', 'evidence_boundary']
      }
    ],
    interviewer_pool: [
      {
        interviewer_id: 'I01',
        presentation_gender: 'female',
        personality_traits: ['CALM', 'ANALYTICAL'],
        values: ['EVIDENCE', 'SPECIFICITY'],
        response_style: 'RESP_MINIMAL',
        interest_bias: 'BIAS_EVIDENCE',
        pressure_tendency: 3,
        voice_preference: 'female'
      },
      {
        interviewer_id: 'I02',
        presentation_gender: 'male',
        personality_traits: ['CURIOUS'],
        values: ['OWNERSHIP', 'DEPTH'],
        response_style: 'RESP_CURIOUS',
        interest_bias: 'BIAS_DEPTH',
        pressure_tendency: 2,
        voice_preference: 'male'
      }
    ],
    session_policy: {
      supported_interviewer_count: [1, 2],
      default_interviewer_count: 2,
      start_modes: ['START_DIRECT', 'START_SELF'],
      ending_modes: ['END_DIRECT'],
      default_max_followup_depth: 3,
      absolute_max_followup_depth: 4,
      surprise_per_session_min: 0,
      surprise_per_session_max: 1,
      allow_cross_record: true,
      allow_weakness_question: true,
      allow_rare_human_events: true
    },
    question_bank: [
      {
        question_id: 'Q001',
        relation: 'ROOT',
        root_question_id: 'Q001',
        parent_question_id: null,
        question_type: 'METHOD',
        question_intent: '방법 선택 이유 확인',
        primary_text: '왜 이 방법을 선택했나요?',
        text_variants: ['이 방법을 고른 기준은 무엇인가요?'],
        evidence_ids: ['E001'],
        cognitive_difficulty: 'D3',
        priority: 4,
        coverage_tags: ['method', 'ownership'],
        recommended_answer_seconds: { min: 30, max: 60 },
        eligible_interviewer_values: ['EVIDENCE', 'DEPTH'],
        runtime_trigger: { type: 'ALWAYS_ELIGIBLE' },
        followup_ids: ['Q002']
      },
      {
        question_id: 'Q002',
        relation: 'FOLLOWUP',
        root_question_id: 'Q001',
        parent_question_id: 'Q001',
        question_type: 'BOUNDARY',
        question_intent: '결과 범위 확인',
        primary_text: '그 결과로 어디까지 말할 수 있나요?',
        text_variants: [],
        evidence_ids: ['E002'],
        cognitive_difficulty: 'D4',
        priority: 5,
        coverage_tags: ['boundary', 'limitation'],
        recommended_answer_seconds: { min: 20, max: 50 },
        eligible_interviewer_values: ['LIMITATION'],
        runtime_trigger: { type: 'AFTER_PARENT' },
        followup_ids: []
      }
    ],
    integrity: {
      warnings: [],
      insufficient_record_areas: [],
      questions_without_record_evidence: [],
      duplicate_intent_check_passed: true,
      graph_validation_passed: true,
      enum_validation_passed: true,
      reference_validation_passed: true,
      runtime_trigger_validation_passed: true
    }
  };
  return { ...pack, ...overrides };
}
