import { z } from 'zod';
import {
  cognitiveDifficulties,
  coverageTags,
  endingModes,
  followupQuestionTypes,
  interestBiases,
  interviewerValues,
  personalityTraits,
  questionRelations,
  questionTypes,
  recordEvidenceCategories,
  recordEvidenceTags,
  responseStyles,
  rootQuestionTypes,
  startModes
} from './domain';

const nonEmptyText = z.string().trim().min(1);
const uniqueTextArray = (minimum = 0, maximum?: number) => {
  let schema = z.array(nonEmptyText).min(minimum);
  if (maximum !== undefined) schema = schema.max(maximum);
  return schema.superRefine((items, context) => {
    if (new Set(items).size !== items.length) {
      context.addIssue({ code: 'custom', message: '배열에 중복 값이 있습니다.' });
    }
  });
};

const isoDateTime = z.string().refine(value => !Number.isNaN(Date.parse(value)), {
  message: '유효한 ISO-8601 날짜/시간이어야 합니다.'
});

export const generatorSchema = z.object({
  engine_name: z.literal('학생부기반_공통_실전면접_질문엔진'),
  engine_version: z.enum(['1.0', '1.2']),
  created_at: isoDateTime,
  language: z.literal('ko-KR')
}).strict();

export const targetSchema = z.object({
  university: nonEmptyText.nullable(),
  department: nonEmptyText.nullable(),
  interview_type: z.literal('student_record_based'),
  default_session_minutes: z.number().int().min(1)
}).strict();

export const sourceRecordSchema = z.object({
  available: z.boolean(),
  embedded_full_text: z.literal(false),
  student_name_included: z.boolean()
}).strict();

export const recordEvidenceSchema = z.object({
  evidence_id: z.string().regex(/^E\d{3,}$/),
  anchor: nonEmptyText,
  year: z.number().int().min(1).max(3),
  category: z.enum(recordEvidenceCategories),
  topic: nonEmptyText,
  excerpt: nonEmptyText,
  normalized_summary: nonEmptyText,
  tags: z.array(z.enum(recordEvidenceTags)).superRefine((items, context) => {
    if (new Set(items).size !== items.length) context.addIssue({ code: 'custom', message: 'tags에 중복 값이 있습니다.' });
  })
}).strict();

export const interviewerSchema = z.object({
  interviewer_id: z.string().regex(/^I\d{2,}$/),
  presentation_gender: z.enum(['male', 'female']),
  personality_traits: z.array(z.enum(personalityTraits)).min(1).max(4).superRefine((items, context) => {
    if (new Set(items).size !== items.length) context.addIssue({ code: 'custom', message: 'personality_traits에 중복 값이 있습니다.' });
  }),
  values: z.array(z.enum(interviewerValues)).min(1).max(4).superRefine((items, context) => {
    if (new Set(items).size !== items.length) context.addIssue({ code: 'custom', message: 'values에 중복 값이 있습니다.' });
  }),
  response_style: z.enum(responseStyles),
  interest_bias: z.enum(interestBiases),
  pressure_tendency: z.number().int().min(1).max(5),
  voice_preference: z.enum(['male', 'female', 'system_default'])
}).strict();

export const sessionPolicySchema = z.object({
  supported_interviewer_count: z.tuple([z.literal(1), z.literal(2)]),
  default_interviewer_count: z.union([z.literal(1), z.literal(2)]),
  start_modes: z.array(z.enum(startModes)),
  ending_modes: z.array(z.enum(endingModes)),
  default_max_followup_depth: z.number().int().min(0),
  absolute_max_followup_depth: z.number().int().min(0),
  surprise_per_session_min: z.number().int().min(0),
  surprise_per_session_max: z.number().int().min(0),
  allow_cross_record: z.boolean(),
  allow_weakness_question: z.boolean(),
  allow_rare_human_events: z.boolean()
}).strict().superRefine((policy, context) => {
  if (policy.default_max_followup_depth > policy.absolute_max_followup_depth) {
    context.addIssue({ code: 'custom', path: ['default_max_followup_depth'], message: '기본 꼬리질문 깊이가 절대 최대 깊이를 초과합니다.' });
  }
  if (policy.surprise_per_session_min > policy.surprise_per_session_max) {
    context.addIssue({ code: 'custom', path: ['surprise_per_session_min'], message: 'Surprise 최소값이 최대값을 초과합니다.' });
  }
});

const runtimeTriggerSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('ALWAYS_ELIGIBLE') }).strict(),
  z.object({ type: z.literal('RANDOM'), probability: z.number().min(0).max(1) }).strict(),
  z.object({ type: z.literal('KEYWORD_ANY'), keywords: uniqueTextArray(1) }).strict(),
  z.object({ type: z.literal('ANSWER_TOO_SHORT'), threshold_ms: z.number().int().positive() }).strict(),
  z.object({ type: z.literal('ANSWER_TOO_LONG'), threshold_ms: z.number().int().positive() }).strict(),
  z.object({ type: z.literal('NO_ANSWER') }).strict(),
  z.object({ type: z.literal('DONT_KNOW_PATTERN'), phrases: uniqueTextArray(1) }).strict(),
  z.object({ type: z.literal('AFTER_PARENT') }).strict(),
  z.object({
    type: z.literal('SESSION_TIME_REMAINING'),
    operator: z.enum(['LT', 'LTE', 'GT', 'GTE']),
    threshold_ms: z.number().int().min(0)
  }).strict()
]);

export const questionSchema = z.object({
  question_id: z.string().regex(/^Q\d{3,}$/),
  relation: z.enum(questionRelations),
  root_question_id: z.string().regex(/^Q\d{3,}$/),
  parent_question_id: z.string().regex(/^Q\d{3,}$/).nullable(),
  question_type: z.enum(questionTypes),
  question_intent: nonEmptyText,
  primary_text: nonEmptyText,
  text_variants: uniqueTextArray(),
  evidence_ids: uniqueTextArray(),
  cognitive_difficulty: z.enum(cognitiveDifficulties),
  priority: z.number().int().min(1).max(5),
  coverage_tags: z.array(z.enum(coverageTags)).superRefine((items, context) => {
    if (new Set(items).size !== items.length) context.addIssue({ code: 'custom', message: 'coverage_tags에 중복 값이 있습니다.' });
  }),
  recommended_answer_seconds: z.object({
    min: z.number().int().min(0),
    max: z.number().int().min(0)
  }).strict().superRefine((value, context) => {
    if (value.min > value.max) context.addIssue({ code: 'custom', path: ['min'], message: 'min은 max보다 클 수 없습니다.' });
  }).nullable(),
  eligible_interviewer_values: z.array(z.enum(interviewerValues)).superRefine((items, context) => {
    if (new Set(items).size !== items.length) context.addIssue({ code: 'custom', message: 'eligible_interviewer_values에 중복 값이 있습니다.' });
  }),
  runtime_trigger: runtimeTriggerSchema,
  followup_ids: uniqueTextArray()
}).strict();

export const packIntegritySchema = z.object({
  warnings: z.array(z.string()),
  insufficient_record_areas: z.array(z.string()),
  questions_without_record_evidence: z.array(z.string()),
  duplicate_intent_check_passed: z.boolean(),
  graph_validation_passed: z.boolean(),
  enum_validation_passed: z.boolean(),
  reference_validation_passed: z.boolean(),
  runtime_trigger_validation_passed: z.boolean()
}).strict();

export const interviewPackSchema = z.object({
  schema: z.literal('INTERVIEW_PACK/1.0'),
  pack_id: z.string().regex(/^PACK_.+/),
  generator: generatorSchema,
  target: targetSchema,
  source_record: sourceRecordSchema,
  record_evidence: z.array(recordEvidenceSchema),
  interviewer_pool: z.array(interviewerSchema).min(2),
  session_policy: sessionPolicySchema,
  question_bank: z.array(questionSchema).min(1),
  integrity: packIntegritySchema
}).strict();

export const schemaEnumSets = {
  rootQuestionTypes: new Set<string>(rootQuestionTypes),
  followupQuestionTypes: new Set<string>(followupQuestionTypes)
};
