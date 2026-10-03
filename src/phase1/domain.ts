export const recordEvidenceCategories = [
  'subject_detail', 'career_activity', 'autonomous_activity', 'club_activity',
  'volunteer_activity', 'reading', 'behavior', 'award', 'attendance', 'grade',
  'coursework', 'other'
] as const;

export const recordEvidenceTags = [
  'topic', 'motivation', 'concept', 'method', 'tool', 'data', 'number',
  'direct_action', 'decision', 'result', 'interpretation', 'limitation',
  'revision', 'failure', 'role', 'collaboration', 'communication', 'reading',
  'growth', 'career', 'teacher_observation', 'ownership', 'evidence_boundary'
] as const;

export const personalityTraits = [
  'CALM', 'RESERVED', 'CURIOUS', 'ANALYTICAL', 'SKEPTICAL', 'FAST_PACED',
  'PATIENT', 'MINIMAL_RESPONSE'
] as const;

export const interviewerValues = [
  'SPECIFICITY', 'EVIDENCE', 'OWNERSHIP', 'CONCEPT', 'LIMITATION', 'GROWTH',
  'CAREER', 'COMMUNITY', 'BREADTH', 'DEPTH'
] as const;

export const responseStyles = [
  'RESP_MINIMAL', 'RESP_CURIOUS', 'RESP_FAST', 'RESP_CONFIRMING', 'RESP_MIXED'
] as const;

export const interestBiases = [
  'BIAS_BALANCED', 'BIAS_PROCESS', 'BIAS_CONCEPT', 'BIAS_EVIDENCE', 'BIAS_LIMIT',
  'BIAS_CAREER', 'BIAS_BREADTH', 'BIAS_DEPTH'
] as const;

export const startModes = [
  'START_DIRECT', 'START_SELF', 'START_MOTIVE', 'START_ICE', 'START_SURPRISE'
] as const;

export const endingModes = [
  'END_DIRECT', 'END_LAST_WORD', 'END_FINAL_QUESTION', 'END_TIME_CUT', 'END_LIGHT'
] as const;

export const rootQuestionTypes = [
  'ACTIVITY_VERIFY', 'CONCEPT', 'METHOD', 'RESULT_EVIDENCE', 'LIMITATION',
  'CAREER', 'ACADEMIC', 'READING', 'COMMUNITY', 'GROWTH', 'CROSS_RECORD',
  'SURPRISE', 'SELF_INTRO', 'MOTIVATION', 'DAILY'
] as const;

export const followupQuestionTypes = [
  'VERIFY', 'CLARIFY', 'CONCEPT_CHECK', 'METHOD_CHECK', 'EVIDENCE_CHECK',
  'BOUNDARY', 'COUNTERFACTUAL', 'ALTERNATIVE', 'TRANSFER', 'SELF_CORRECTION',
  'RECOVERY'
] as const;

export const questionTypes = [...rootQuestionTypes, ...followupQuestionTypes] as const;
export const cognitiveDifficulties = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'] as const;
export const questionRelations = ['ROOT', 'FOLLOWUP'] as const;

export const coverageTags = [
  'activity', 'concept', 'method', 'evidence', 'boundary', 'ownership', 'career',
  'academic', 'reading', 'community', 'growth', 'surprise', 'cross_record',
  'year_1', 'year_2', 'year_3', 'direct_action', 'teamwork', 'result', 'limitation'
] as const;

export const runtimeTriggerTypes = [
  'ALWAYS_ELIGIBLE', 'RANDOM', 'KEYWORD_ANY', 'ANSWER_TOO_SHORT',
  'ANSWER_TOO_LONG', 'NO_ANSWER', 'DONT_KNOW_PATTERN', 'AFTER_PARENT',
  'SESSION_TIME_REMAINING'
] as const;

export type RecordEvidenceCategory = typeof recordEvidenceCategories[number];
export type RecordEvidenceTag = typeof recordEvidenceTags[number];
export type PersonalityTrait = typeof personalityTraits[number];
export type InterviewerValue = typeof interviewerValues[number];
export type ResponseStyle = typeof responseStyles[number];
export type InterestBias = typeof interestBiases[number];
export type StartMode = typeof startModes[number];
export type EndingMode = typeof endingModes[number];
export type QuestionType = typeof questionTypes[number];
export type CognitiveDifficulty = typeof cognitiveDifficulties[number];
export type QuestionRelation = typeof questionRelations[number];
export type CoverageTag = typeof coverageTags[number];
export type RuntimeTriggerType = typeof runtimeTriggerTypes[number];

export interface Generator {
  engine_name: '학생부기반_공통_실전면접_질문엔진';
  engine_version: '1.0';
  created_at: string;
  language: 'ko-KR';
}

export interface Target {
  university: string | null;
  department: string | null;
  interview_type: 'student_record_based';
  default_session_minutes: number;
}

export interface SourceRecord {
  available: boolean;
  embedded_full_text: false;
  student_name_included: boolean;
}

export interface RecordEvidence {
  evidence_id: string;
  anchor: string;
  year: number;
  category: RecordEvidenceCategory;
  topic: string;
  excerpt: string;
  normalized_summary: string;
  tags: RecordEvidenceTag[];
}

export interface Interviewer {
  interviewer_id: string;
  presentation_gender: 'male' | 'female';
  personality_traits: PersonalityTrait[];
  values: InterviewerValue[];
  response_style: ResponseStyle;
  interest_bias: InterestBias;
  pressure_tendency: number;
  voice_preference: 'male' | 'female' | 'system_default';
}

export interface SessionPolicy {
  supported_interviewer_count: [1, 2];
  default_interviewer_count: 1 | 2;
  start_modes: StartMode[];
  ending_modes: EndingMode[];
  default_max_followup_depth: number;
  absolute_max_followup_depth: number;
  surprise_per_session_min: number;
  surprise_per_session_max: number;
  allow_cross_record: boolean;
  allow_weakness_question: boolean;
  allow_rare_human_events: boolean;
}

export type RuntimeTrigger =
  | { type: 'ALWAYS_ELIGIBLE' }
  | { type: 'RANDOM'; probability: number }
  | { type: 'KEYWORD_ANY'; keywords: string[] }
  | { type: 'ANSWER_TOO_SHORT'; threshold_ms: number }
  | { type: 'ANSWER_TOO_LONG'; threshold_ms: number }
  | { type: 'NO_ANSWER' }
  | { type: 'DONT_KNOW_PATTERN'; phrases: string[] }
  | { type: 'AFTER_PARENT' }
  | { type: 'SESSION_TIME_REMAINING'; operator: 'LT' | 'LTE' | 'GT' | 'GTE'; threshold_ms: number };

export interface Question {
  question_id: string;
  relation: QuestionRelation;
  root_question_id: string;
  parent_question_id: string | null;
  question_type: QuestionType;
  question_intent: string;
  primary_text: string;
  text_variants: string[];
  evidence_ids: string[];
  cognitive_difficulty: CognitiveDifficulty;
  priority: number;
  coverage_tags: CoverageTag[];
  recommended_answer_seconds: { min: number; max: number } | null;
  eligible_interviewer_values: InterviewerValue[];
  runtime_trigger: RuntimeTrigger;
  followup_ids: string[];
}

export interface PackIntegrity {
  warnings: string[];
  insufficient_record_areas: string[];
  questions_without_record_evidence: string[];
  duplicate_intent_check_passed: boolean;
  graph_validation_passed: boolean;
  enum_validation_passed: boolean;
  reference_validation_passed: boolean;
  runtime_trigger_validation_passed: boolean;
}

export interface InterviewPack {
  schema: 'INTERVIEW_PACK/1.0';
  pack_id: string;
  generator: Generator;
  target: Target;
  source_record: SourceRecord;
  record_evidence: RecordEvidence[];
  interviewer_pool: Interviewer[];
  session_policy: SessionPolicy;
  question_bank: Question[];
  integrity: PackIntegrity;
}

export type ValidationSeverity = 'error' | 'warning';

export interface ValidationIssue {
  severity: ValidationSeverity;
  code: string;
  path: string;
  message: string;
  developerDetail: string;
}
