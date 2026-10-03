import type { InterviewPack, Question, ValidationIssue } from './domain';
import { interviewPackSchema, schemaEnumSets } from './schema';

export interface ValidationCheck {
  key: 'schema' | 'enum' | 'reference' | 'graph' | 'runtimeTrigger' | 'integrity';
  label: string;
  ok: boolean;
  detail: string;
}

export interface PackValidationResult {
  ok: boolean;
  pack: InterviewPack | null;
  issues: ValidationIssue[];
  checks: ValidationCheck[];
}

const evidenceOptionalQuestionTypes = new Set(['DAILY', 'SELF_INTRO', 'MOTIVATION']);

function pathText(path: PropertyKey[]): string {
  return path.length ? path.map(String).join('.') : '$';
}

function schemaIssueMessage(code: string): string {
  if (code === 'unrecognized_keys') return '정의되지 않은 핵심 필드가 있습니다.';
  if (code === 'invalid_type') return '필드 형식이 올바르지 않습니다.';
  if (code === 'too_small' || code === 'too_big') return '허용 범위를 벗어난 값이 있습니다.';
  return '허용되지 않은 값이거나 규격에 맞지 않습니다.';
}

function issue(
  code: string,
  path: string,
  message: string,
  developerDetail: string,
  severity: ValidationIssue['severity'] = 'error'
): ValidationIssue {
  return { severity, code, path, message, developerDetail };
}

function duplicateValues(values: string[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return [...duplicates];
}

function sameStringSet(left: string[], right: string[]): boolean {
  return left.length === right.length && left.every(value => right.includes(value));
}

function addDuplicateIssues(
  values: string[],
  code: string,
  path: string,
  label: string,
  issues: ValidationIssue[]
): void {
  for (const value of duplicateValues(values)) {
    issues.push(issue(code, path, `${label}가 중복되었습니다.`, `Duplicate ${label}: ${value}`));
  }
}

function traceRoot(question: Question, byId: Map<string, Question>): string | null {
  let cursor: Question | undefined = question;
  const visited = new Set<string>();
  while (cursor) {
    if (visited.has(cursor.question_id)) return null;
    visited.add(cursor.question_id);
    if (cursor.relation === 'ROOT') return cursor.question_id;
    if (!cursor.parent_question_id) return null;
    cursor = byId.get(cursor.parent_question_id);
  }
  return null;
}

export function validatePackSemantics(pack: InterviewPack): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const questionIds = pack.question_bank.map(question => question.question_id);
  const evidenceIds = pack.record_evidence.map(evidence => evidence.evidence_id);
  const interviewerIds = pack.interviewer_pool.map(interviewer => interviewer.interviewer_id);

  addDuplicateIssues(questionIds, 'DUPLICATE_QUESTION_ID', 'question_bank', '질문 ID', issues);
  addDuplicateIssues(evidenceIds, 'DUPLICATE_EVIDENCE_ID', 'record_evidence', '근거 ID', issues);
  addDuplicateIssues(interviewerIds, 'DUPLICATE_INTERVIEWER_ID', 'interviewer_pool', '면접관 ID', issues);

  const byId = new Map(pack.question_bank.map(question => [question.question_id, question]));
  const evidenceIdSet = new Set(evidenceIds);
  const graphCodes = new Set([
    'INVALID_ROOT_RULE', 'INVALID_FOLLOWUP_RULE', 'MISSING_PARENT', 'MISSING_ROOT',
    'INVALID_ROOT_REFERENCE', 'DIRECT_CHILD_MISMATCH', 'SELF_REFERENCE', 'GRAPH_CYCLE'
  ]);
  const referenceCodes = new Set(['MISSING_EVIDENCE_REFERENCE', 'MISSING_PARENT', 'MISSING_ROOT']);

  for (const [index, question] of pack.question_bank.entries()) {
    const basePath = `question_bank.${index}`;
    for (const evidenceId of question.evidence_ids) {
      if (!evidenceIdSet.has(evidenceId)) {
        issues.push(issue(
          'MISSING_EVIDENCE_REFERENCE',
          `${basePath}.evidence_ids`,
          '질문이 존재하지 않는 학생부 근거를 참조합니다.',
          `${question.question_id} references missing evidence ${evidenceId}`
        ));
      }
    }

    if (question.relation === 'ROOT') {
      if (question.root_question_id !== question.question_id || question.parent_question_id !== null) {
        issues.push(issue(
          'INVALID_ROOT_RULE',
          basePath,
          'ROOT 질문의 root/parent 관계가 올바르지 않습니다.',
          `${question.question_id} must reference itself as root and have null parent`
        ));
      }
      if (!schemaEnumSets.rootQuestionTypes.has(question.question_type)) {
        issues.push(issue(
          'ROOT_QUESTION_TYPE_MISMATCH',
          `${basePath}.question_type`,
          'ROOT 질문에 Follow-up 전용 질문 유형을 사용할 수 없습니다.',
          `${question.question_id} uses ${question.question_type} as ROOT`
        ));
      }
    } else {
      if (schemaEnumSets.rootQuestionTypes.has(question.question_type)) {
        issues.push(issue(
          'FOLLOWUP_QUESTION_TYPE_MISMATCH',
          `${basePath}.question_type`,
          'FOLLOWUP 질문에 Root 전용 질문 유형을 사용할 수 없습니다.',
          `${question.question_id} uses ${question.question_type} as FOLLOWUP`
        ));
      }
      if (question.parent_question_id === question.question_id || question.root_question_id === question.question_id) {
        issues.push(issue(
          'SELF_REFERENCE',
          basePath,
          '질문이 자기 자신을 부모 또는 Root로 참조합니다.',
          `${question.question_id} has a self reference`
        ));
      }
      const parent = question.parent_question_id ? byId.get(question.parent_question_id) : undefined;
      if (!parent) {
        issues.push(issue(
          'MISSING_PARENT',
          `${basePath}.parent_question_id`,
          'FOLLOWUP 질문의 직접 부모를 찾을 수 없습니다.',
          `${question.question_id} parent ${String(question.parent_question_id)} does not exist`
        ));
      } else if (!parent.followup_ids.includes(question.question_id)) {
        issues.push(issue(
          'DIRECT_CHILD_MISMATCH',
          `${basePath}.parent_question_id`,
          '부모 질문의 followup_ids와 직접 자식 관계가 일치하지 않습니다.',
          `${parent.question_id}.followup_ids does not include ${question.question_id}`
        ));
      }
      const root = byId.get(question.root_question_id);
      if (!root) {
        issues.push(issue(
          'MISSING_ROOT',
          `${basePath}.root_question_id`,
          'FOLLOWUP 질문의 최상위 ROOT를 찾을 수 없습니다.',
          `${question.question_id} root ${question.root_question_id} does not exist`
        ));
      } else if (root.relation !== 'ROOT') {
        issues.push(issue(
          'INVALID_ROOT_REFERENCE',
          `${basePath}.root_question_id`,
          'root_question_id는 ROOT 질문을 가리켜야 합니다.',
          `${question.question_id} root ${question.root_question_id} is not ROOT`
        ));
      }
      const tracedRoot = traceRoot(question, byId);
      if (tracedRoot !== null && tracedRoot !== question.root_question_id) {
        issues.push(issue(
          'INVALID_ROOT_REFERENCE',
          `${basePath}.root_question_id`,
          'root_question_id가 실제 부모 경로의 최상위 ROOT와 일치하지 않습니다.',
          `${question.question_id} declares ${question.root_question_id}, traced ${tracedRoot}`
        ));
      }
    }

    for (const childId of question.followup_ids) {
      if (childId === question.question_id) {
        issues.push(issue(
          'SELF_REFERENCE',
          `${basePath}.followup_ids`,
          '질문이 자기 자신을 follow-up으로 참조합니다.',
          `${question.question_id} includes itself in followup_ids`
        ));
        continue;
      }
      const child = byId.get(childId);
      if (!child) {
        issues.push(issue(
          'MISSING_PARENT',
          `${basePath}.followup_ids`,
          'followup_ids가 존재하지 않는 질문을 참조합니다.',
          `${question.question_id} references missing child ${childId}`
        ));
      } else if (child.relation !== 'FOLLOWUP' || child.parent_question_id !== question.question_id) {
        issues.push(issue(
          'DIRECT_CHILD_MISMATCH',
          `${basePath}.followup_ids`,
          'followup_ids는 직접 자식 FOLLOWUP 질문만 가리켜야 합니다.',
          `${question.question_id} -> ${childId} is not a direct child relationship`
        ));
      }
    }
  }

  const color = new Map<string, 0 | 1 | 2>();
  const visit = (id: string): boolean => {
    if (color.get(id) === 1) return false;
    if (color.get(id) === 2) return true;
    color.set(id, 1);
    const current = byId.get(id);
    for (const childId of current?.followup_ids ?? []) {
      if (byId.has(childId) && !visit(childId)) return false;
    }
    color.set(id, 2);
    return true;
  };
  for (const id of questionIds) {
    if (!visit(id)) {
      issues.push(issue('GRAPH_CYCLE', 'question_bank', '질문 그래프에 순환 참조가 있습니다.', `Cycle detected from ${id}`));
      break;
    }
  }

  const duplicatedIntents = duplicateValues(pack.question_bank.map(question => question.question_intent.trim()));
  const questionsWithoutRecordEvidence = pack.question_bank
    .filter(question => question.evidence_ids.length === 0 && !evidenceOptionalQuestionTypes.has(question.question_type))
    .map(question => question.question_id);

  const graphValid = !issues.some(item => graphCodes.has(item.code));
  const referenceValid = !issues.some(item => referenceCodes.has(item.code));
  const expectedFlags: Array<[keyof InterviewPack['integrity'], boolean]> = [
    ['graph_validation_passed', graphValid],
    ['enum_validation_passed', !issues.some(item => item.code.endsWith('_QUESTION_TYPE_MISMATCH'))],
    ['reference_validation_passed', referenceValid],
    ['runtime_trigger_validation_passed', true],
    ['duplicate_intent_check_passed', duplicatedIntents.length === 0]
  ];

  for (const [key, expected] of expectedFlags) {
    if (pack.integrity[key] !== expected) {
      issues.push(issue(
        'INTEGRITY_FLAG_MISMATCH',
        `integrity.${key}`,
        '질문팩 무결성 플래그가 실제 검증 결과와 일치하지 않습니다.',
        `${key}=${String(pack.integrity[key])}, actual=${String(expected)}`
      ));
    }
  }

  if (!sameStringSet(pack.integrity.questions_without_record_evidence, questionsWithoutRecordEvidence)) {
    issues.push(issue(
      'INTEGRITY_EVIDENCE_LIST_MISMATCH',
      'integrity.questions_without_record_evidence',
      '근거 없는 질문 목록이 실제 질문 데이터와 일치하지 않습니다.',
      `declared=${JSON.stringify(pack.integrity.questions_without_record_evidence)}, actual=${JSON.stringify(questionsWithoutRecordEvidence)}`
    ));
  }

  for (const warning of pack.integrity.warnings) {
    issues.push(issue('PACK_DECLARED_WARNING', 'integrity.warnings', warning, `Pack declared warning: ${warning}`, 'warning'));
  }

  return issues;
}

export function validateInterviewPack(input: unknown): PackValidationResult {
  const parsed = interviewPackSchema.safeParse(input);
  if (!parsed.success) {
    const issues = parsed.error.issues.map(item => issue(
      'SCHEMA_INVALID',
      pathText(item.path),
      schemaIssueMessage(item.code),
      `${item.code}: ${item.message}`
    ));
    return {
      ok: false,
      pack: null,
      issues,
      checks: [
        { key: 'schema', label: '구조 검증', ok: false, detail: `오류 ${issues.length}개` },
        { key: 'enum', label: 'Enum 검증', ok: false, detail: '구조 오류를 먼저 수정해야 합니다.' },
        { key: 'reference', label: '참조 검증', ok: false, detail: '구조 오류를 먼저 수정해야 합니다.' },
        { key: 'graph', label: '질문 그래프', ok: false, detail: '구조 오류를 먼저 수정해야 합니다.' },
        { key: 'runtimeTrigger', label: 'Trigger 검증', ok: false, detail: '구조 오류를 먼저 수정해야 합니다.' },
        { key: 'integrity', label: '무결성 선언', ok: false, detail: '구조 오류를 먼저 수정해야 합니다.' }
      ]
    };
  }

  const pack = parsed.data as InterviewPack;
  const issues = validatePackSemantics(pack);
  const errorCodes = new Set(issues.filter(item => item.severity === 'error').map(item => item.code));
  const graphError = [...errorCodes].some(code => [
    'INVALID_ROOT_RULE', 'INVALID_FOLLOWUP_RULE', 'MISSING_PARENT', 'MISSING_ROOT',
    'INVALID_ROOT_REFERENCE', 'DIRECT_CHILD_MISMATCH', 'SELF_REFERENCE', 'GRAPH_CYCLE'
  ].includes(code));
  const referenceError = [...errorCodes].some(code => [
    'MISSING_EVIDENCE_REFERENCE', 'MISSING_PARENT', 'MISSING_ROOT',
    'DUPLICATE_QUESTION_ID', 'DUPLICATE_EVIDENCE_ID', 'DUPLICATE_INTERVIEWER_ID'
  ].includes(code));
  const enumError = [...errorCodes].some(code => code.endsWith('_QUESTION_TYPE_MISMATCH'));
  const integrityError = [...errorCodes].some(code => code.startsWith('INTEGRITY_'));

  return {
    ok: issues.every(item => item.severity !== 'error'),
    pack,
    issues,
    checks: [
      { key: 'schema', label: '구조 검증', ok: true, detail: 'INTERVIEW_PACK/1.0 폐쇄형 구조' },
      { key: 'enum', label: 'Enum 검증', ok: !enumError, detail: enumError ? '질문 유형 관계 오류' : '공식 V1 값만 사용' },
      { key: 'reference', label: '참조 검증', ok: !referenceError, detail: referenceError ? 'ID 또는 참조 오류' : '근거·질문·면접관 참조 정상' },
      { key: 'graph', label: '질문 그래프', ok: !graphError, detail: graphError ? 'ROOT/FOLLOWUP 그래프 오류' : '비순환 직접 자식 관계 정상' },
      { key: 'runtimeTrigger', label: 'Trigger 검증', ok: true, detail: '공식 trigger 구조' },
      { key: 'integrity', label: '무결성 선언', ok: !integrityError, detail: integrityError ? '선언과 실제 결과 불일치' : '선언과 실제 결과 일치' }
    ]
  };
}
