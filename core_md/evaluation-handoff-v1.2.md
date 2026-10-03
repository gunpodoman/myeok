# 면접-평가 핸드오프 규격 v1.2 FINAL

## 0. 문서의 역할

이 문서는 面逆力 웹사이트와 평가 엔진 사이의 공식 데이터 계약인 `INTERVIEW_EVAL_HANDOFF/1.2`의 사람이 읽는 최종 명세다.

전체 흐름:

```text
INTERVIEW_PACK/1.0
→ 面逆力 웹사이트에서 실제 면접 진행
→ INTERVIEW_EVAL_HANDOFF/1.2
→ 평가 엔진
```

질문 생성 엔진은 HANDOFF를 직접 생성하지 않는다.

HANDOFF 생성 주체:

```text
面逆力 웹사이트
```

핵심 철학:

> 사이트는 기록한다.

> 평가 엔진은 해석한다.

> handoff.json이 canonical source다.

> HANDOFF는 평가 결과가 아니라 관찰 기록이다.

> null과 0을 구분한다.

> 질문 Intent를 사후 수정하지 않는다.

> STT 원문을 임의 복원하지 않는다.

> Runtime Signals는 평가 정답이 아니다.

---

# 1. 표준 결과 패키지

면접 종료 후 사이트가 생성하는 표준 패키지:

```text
myeonyeokryeok_result_<session_id>.zip
```

기본 구조:

```text
handoff.json
interview-pack.json
handoff.md
answers.csv
events.json
events.csv
transcript.md
README.md
audio/
```

`interview-pack.json`은 해당 세션에서 실제 사용한 원본 Pack 파일의 원본 byte sequence를 그대로 포함한다. 사이트가 parse 후 재직렬화하거나 정렬·공백·인코딩을 변경한 복사본으로 대체하지 않는다.

`audio/`는 선택 사항.

세션 관찰의 canonical source of truth:

```text
handoff.json
```

source Pack 독립 검증의 canonical artifact:

```text
interview-pack.json
```

`interview-pack.json`은 평가 결과를 담지 않으며, source Pack provenance와 HANDOFF snapshot의 일치 여부를 독립 검증하기 위한 입력이다.

사람이 읽는 mirror:

```text
handoff.md
```

보조 분석:

```text
answers.csv
events.json
events.csv
transcript.md
audio/
```

JSON과 mirror가 충돌하면 `handoff.json`을 우선한다.

---

# 2. V1 폐쇄형 규격 원칙

`INTERVIEW_EVAL_HANDOFF/1.2` 핵심 object에는 본 문서에 정의되지 않은 임의 필드를 생성하지 않는다.

새 핵심 필드 또는 enum이 필요하면 schema version 변경으로 처리한다.

원칙:

- 알 수 없는 enum 생성 금지
- 임의 평가 필드 추가 금지
- 질문 의미 재해석 금지
- 사이트의 사후 판단 추가 금지

---

# 3. handoff_schema

최상위 식별자:

```json
{
  "handoff_schema": "INTERVIEW_EVAL_HANDOFF/1.2"
}
```

다른 값 금지.

---

# 4. 최상위 구조

공식 구조:

```json
{
  "handoff_schema": "INTERVIEW_EVAL_HANDOFF/1.2",
  "session": {},
  "source_pack": {},
  "environment": {},
  "summary": {},
  "questions": [],
  "integrity": {}
}
```

핵심 최상위 구조를 임의 변경하지 않는다.

---

# 5. session

정확한 구조:

```json
{
  "session": {
    "session_id": "550e8400-e29b-41d4-a716-446655440000",
    "created_at": "2026-09-22T12:00:00+09:00",
    "completed_at": "2026-09-22T12:10:12+09:00",
    "interview_duration_ms": 612000,
    "question_count": 10,
    "site_version": "1.0.0",
    "runtime_policy_version": "1.0.0",
    "difficulty_engine_version": "1.0.0",
    "metrics_engine_version": "1.0.0",
    "language": "ko-KR",
    "session_seed": "string"
  }
}
```

---

# 6. session_id 생성 주체

`session_id`는 질문 생성 GPT가 만들지 않는다.

생성 주체:

```text
面逆力 웹사이트
```

V1 구현 권장:

```javascript
crypto.randomUUID()
```

규격상 충분히 고유한 사이트 생성 문자열을 허용할 수 있으나 실제 구현은 UUID 사용을 권장한다.

---

# 7. session 시간 필드

- `created_at`: ISO-8601
- `completed_at`: ISO-8601
- `interview_duration_ms`: 0 이상 정수
- `question_count`: 0 이상 정수
- `runtime_policy_version`: 질문엔진 문서에 통합된 `QUESTION_ENGINE_RUNTIME/1.0`을 구현한 실제 사이트 세션 선택 로직 버전
- `difficulty_engine_version`: 실제 UI/표현 난이도 로직 버전
- `metrics_engine_version`: 실제 측정 로직 버전

`question_count`는 실제 `questions` 배열 길이와 일치해야 한다.

---

# 8. source_pack

정확한 구조:

```json
{
  "source_pack": {
    "schema": "INTERVIEW_PACK/1.0",
    "pack_id": "PACK_8F3A91C2",
    "generator_version": "1.2",
    "sha256": "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
  }
}
```

규칙:

- `schema`: 실제 source Pack의 `schema`를 그대로 복사
- `pack_id`: 실제 source Pack의 `pack_id`를 그대로 복사
- `generator_version`: 실제 source Pack의 `generator.engine_version` 문자열을 그대로 복사
- 특정 질문엔진 버전 문자열을 HANDOFF 규격의 고정값으로 간주하지 않음
- 포함된 `interview-pack.json`과 값이 충돌하면 source Pack 원본을 우선하여 integrity 문제로 기록

---

# 9. source_pack.sha256

알고리즘:

```text
SHA-256
```

대상:

> 면접 세션에서 실제 사용했고 결과 ZIP에 함께 포함된 원본 `interview-pack.json` 파일의 원본 byte sequence.

평가엔진 또는 검증기는 ZIP에 포함된 `interview-pack.json`의 byte sequence로 SHA-256을 다시 계산하여 `source_pack.sha256`과 비교할 수 있어야 한다.

금지:

- JSON parse 후 재직렬화한 결과를 hash
- 정규화된 JSON을 hash
- pack_id를 hash처럼 사용

표현:

```text
64자리 lowercase hexadecimal
```

목적:

- 원본 Pack 동일성 확인
- 디버깅
- 세션 재현
- pack_id 충돌 보조 방지

hash를 개인정보 보호·전자서명 기능으로 과장하지 않는다.

---

# 9A. source Pack 독립 검증

표준 결과 ZIP에는 면접 당시 실제 사용한 원본 `interview-pack.json`을 포함한다.

검증 순서:

```text
1. ZIP의 interview-pack.json 존재 확인
2. 원본 bytes SHA-256 재계산
3. handoff.source_pack.sha256과 비교
4. Pack schema / pack_id / generator.engine_version 대조
5. HANDOFF에 등장한 question_id가 Pack question_bank에 존재하는지 확인
6. interviewer_id가 Pack interviewer_pool에 존재하는지 확인
7. question_type / question_intent / cognitive_difficulty / priority / coverage_tags / recommended_answer_seconds / evidence_ids / pack_primary_text를 Pack 원값과 대조
8. record_evidence snapshot을 Pack record_evidence 원값과 대조
```

원칙:

- 실제 제시 문구 `question_text`는 text variant일 수 있으므로 Pack `primary_text`와 반드시 같을 필요는 없다.
- `pack_primary_text`는 Pack의 `primary_text`와 일치해야 한다.
- source Pack 원본은 세션 평가의 새로운 정답 데이터가 아니라 provenance 검증 자료다.
- source Pack과 HANDOFF snapshot이 충돌하면 충돌 필드를 명시하고 지원자에게 책임을 전가하지 않는다.
- 표준 ZIP에서 `interview-pack.json`이 누락되면 독립 검증이 불가능하므로 `PARTIAL`로 처리한다. 단, HANDOFF 자체가 충분하면 평가 가능한 범위의 평가는 계속할 수 있다.
- 포함된 Pack의 hash 또는 pack_id가 HANDOFF와 충돌하면 provenance를 신뢰할 수 없으므로 `INVALID`로 처리한다.

---

# 10. environment

정확한 구조:

```json
{
  "environment": {
    "difficulty_preset": "REALISTIC",
    "question_presentation_mode": "BLIND_AFTER_TTS",
    "timer_visible": false,
    "default_preparation_time_ms": 0,
    "question_replay_allowed": false,
    "interviewer_visual_mode": "PORTRAIT",
    "interviewer_count": 2,
    "tts_enabled": true,
    "stt_mode": "WEB_SPEECH",
    "vad_mode": "SILERO_VAD",
    "recording_enabled": true
  }
}
```

---

# 11. difficulty_preset enum

V1 허용값:

```text
COMFORT
NORMAL
REALISTIC
HARD
CUSTOM
```

질문 cognitive difficulty D1~D6와 혼동하지 않는다.

---

# 12. question_presentation_mode enum

V1 허용값:

```text
ALWAYS_VISIBLE
BLIND_AFTER_DELAY
BLIND_AFTER_TTS
TTS_ONLY
```

---

# 13. interviewer_visual_mode enum

V1 허용값:

```text
NONE
PORTRAIT
PANEL
```

---

# 14. stt_mode enum

V1 허용값:

```text
WEB_SPEECH
LOCAL_WEB_SPEECH
DISABLED
```

---

# 15. vad_mode enum

V1 허용값:

```text
SILERO_VAD
DISABLED
```

---

# 16. environment 조합 검증

다음 조합은 INVALID:

```text
question_presentation_mode = TTS_ONLY
tts_enabled = false
```

다음 조합도 INVALID:

```text
question_presentation_mode = BLIND_AFTER_TTS
tts_enabled = false
```

이러한 구조적 모순은 schema validation 또는 `integrity.technical_errors`에 기록하며, 최종 severity는 §71A의 canonical mapping에 따라 `INVALID`로 결정한다.

---

# 17. 질문별 공식 구조

각 질문 object는 다음 구조를 따른다.

```json
{
  "question_id": "Q012",
  "sequence": 4,
  "interviewer_id": "I02",
  "relation": "FOLLOWUP",
  "root_question_id": "Q010",
  "parent_question_id": "Q010",
  "question_type": "EVIDENCE_CHECK",
  "question_intent": "결과의 출처를 구분할 수 있는지 확인",
  "question_text": "그 수치는 직접 측정한 건가요?",
  "pack_primary_text": "그 수치는 어디서 나온 값인가요?",
  "cognitive_difficulty": "D4",
  "priority": 4,
  "coverage_tags": ["evidence", "ownership"],
  "recommended_answer_seconds": {
    "min": 30,
    "max": 60
  },
  "evidence_ids": ["E004"],
  "record_evidence": [
    {
      "evidence_id": "E004",
      "anchor": "3학년 진로활동",
      "year": 3,
      "category": "career_activity",
      "topic": "string",
      "excerpt": "string",
      "normalized_summary": "string",
      "tags": ["method", "ownership"]
    }
  ],
  "followup_trigger": null,
  "answer_status": "ANSWERED",
  "answer_transcript": "실제 STT 원문",
  "presentation": {},
  "timing": {},
  "speech_metrics": {},
  "filler_detection": {},
  "stt": {},
  "data_quality": {},
  "runtime_signals": [],
  "recording": {}
}
```

---

# 18. question_id

`INTERVIEW_PACK/1.0`의 실제 선택된 question_id를 그대로 보존한다.

세션에서 새 ID를 재발급하지 않는다.

질문 variant를 사용해도 원본 question_id 유지.

한 세션에서 중복 금지.

---

# 19. sequence

실제 제시 순서.

규칙:

- 1부터 시작하는 정수
- 중복 금지
- 가능하면 연속
- 누락 또는 중복 시 integrity 경고

---

# 20. interviewer_id

`source Pack`의 `interviewer_pool`에 실제 존재하는 ID여야 한다.

없는 ID면 integrity 오류.

---

# 21. relation enum

허용:

```text
ROOT
FOLLOWUP
```

---

# 22. ROOT 규칙

ROOT:

```text
root_question_id = 자기 question_id
parent_question_id = null
followup_trigger = null
```

---

# 23. FOLLOWUP 규칙

FOLLOWUP:

```text
root_question_id = 최상위 ROOT question_id
parent_question_id = 직접 부모 question_id
```

`followup_trigger.source_question_id`가 존재하면 반드시 `parent_question_id`와 같아야 한다.

---

# 24. question_type

Pack에서 받은 값을 그대로 보존.

사이트가 사후 변경하지 않는다.

---

# 25. question_intent

Pack 생성 당시 Intent를 그대로 보존.

답변을 본 뒤 수정하지 않는다.

---

# 26. 실제 제시 문구 question_text

`question_text`는 Pack의 `primary_text`가 아니라 실제 세션에서 사용자에게 제시한 최종 문구다.

text variant를 사용했다면 해당 variant 문자열 저장.

평가엔진은 실제로 들은 질문을 기준으로 평가한다.

---

# 27. pack_primary_text

필수 snapshot 필드.

Pack의 원래 `primary_text`를 문자열로 그대로 저장한다.

규칙:

- 모든 question object에 반드시 존재
- 비어 있지 않은 UTF-8 문자열
- 실제 `question_text`와 같아도 반드시 기록
- source Pack의 해당 `question_id.primary_text`와 정확히 일치해야 함
- 사이트가 variant 문구 또는 사후 수정 문구로 대체하지 않음
- 누락 또는 source Pack과의 불일치는 §71A에 따라 `PARTIAL_IF`로 처리

평가엔진은 이 필드로 실제 제시 variant와 Pack 원문을 구분하고 provenance를 검증한다.

---

# 28. cognitive_difficulty

Pack에서 받은 값을 그대로 보존.

V1 enum:

```text
D1
D2
D3
D4
D5
D6
```

새 값 생성 금지.

---

# 29. priority

Pack에서 받은 값을 그대로 보존.

규칙:

- 정수
- 1~5
- 소수 금지

사이트가 재계산하지 않는다.

---

# 30. coverage_tags

Pack에서 받은 배열을 그대로 보존.

사이트가 실행 후 새로운 tag를 추론해 추가하지 않는다.

허용값은 source Pack의 `INTERVIEW_PACK/1.0` 명세와 동일.

---

# 31. recommended_answer_seconds

Pack에서 받은 값을 그대로 보존.

형식:

```json
{
  "min": 30,
  "max": 60
}
```

또는:

```json
null
```

단위:

```text
초
```

실제 timing은 ms이므로 혼동하지 않는다.

사이트가 임의 재계산하지 않는다.

---

# 32. 학생부 근거

질문별:

```text
evidence_ids
record_evidence
```

`record_evidence`는 해당 질문의 `evidence_ids`가 가리키는 source Pack의 evidence object를 손실 없이 snapshot한 배열이다.

각 항목:

```json
{
  "evidence_id": "E004",
  "anchor": "3학년 진로활동",
  "year": 3,
  "category": "career_activity",
  "topic": "string",
  "excerpt": "string",
  "normalized_summary": "string",
  "tags": ["method", "ownership"]
}
```

규칙:

- `evidence_ids`의 모든 ID는 `record_evidence[].evidence_id`에 정확히 존재
- `record_evidence`에 `evidence_ids`에 없는 추가 evidence를 넣지 않음
- `evidence_ids = []`이면 `record_evidence = []`
- CROSS_RECORD처럼 여러 근거를 사용하는 질문은 evidence를 모두 보존
- 학생부 전체 원문을 HANDOFF에 자동 복제하지 않음
- 사이트가 excerpt를 새로 요약하거나 수정하지 않음
- source Pack의 해당 evidence object 값을 그대로 보존

이 구조는 단수 `student_record_anchor` / `student_record_excerpt`가 복수 evidence 질문에서 정보를 잃는 문제를 방지한다.

---

# 33. answer_status enum

V1 허용값:

```text
ANSWERED
NO_ANSWER
CUT_OFF
STT_UNAVAILABLE
USER_SKIPPED
TECHNICAL_FAILURE
```

다른 문자열 금지.

## 33A. answer_status operational definition

`answer_status`는 답변 내용의 품질 평가가 아니라 질문별 응답 lifecycle의 종료 상태다.

| status | operational definition |
|---|---|
| `ANSWERED` | 실제 발화가 있었고 사용자/사이트가 정상적인 답변 종료로 처리함 |
| `NO_ANSWER` | 응답 창이 종료될 때까지 실제 발화가 확인되지 않았고, 사용자 스킵이나 기술 실패가 아님 |
| `CUT_OFF` | 실제 발화가 시작되었으나 세션 시간 제한·답변 제한 등 비기술적 종료로 정상 완료 전에 잘림 |
| `STT_UNAVAILABLE` | 실제 발화가 있었음은 VAD/recording 등으로 확인되지만 raw STT transcript를 얻을 수 없음 |
| `USER_SKIPPED` | 사용자가 명시적 skip 동작으로 해당 질문을 건너뛰었고 평가할 답변을 제출하지 않음 |
| `TECHNICAL_FAILURE` | 마이크·녹음·STT·세션 처리 등 기술 오류로 응답을 신뢰성 있게 수집/완료하지 못함 |

상태 선택 우선 원칙:

- 기술 오류 때문에 정상 응답 여부 자체를 신뢰할 수 없으면 `TECHNICAL_FAILURE`를 사용한다.
- 실제 발화가 확인되었지만 STT만 얻지 못했고 다른 수집 흐름은 정상이라면 `STT_UNAVAILABLE`를 사용한다.
- 실제 발화 후 비기술적 시간 종료로 잘린 경우 `CUT_OFF`를 사용한다.
- 명시적 skip 전 평가 가능한 발화가 이미 존재하고 그 발화가 종료 전에 잘렸다면 `CUT_OFF`를 사용한다. `USER_SKIPPED`는 평가할 답변이 없는 명시적 skip에 사용한다.
- 실제 무발화와 수집 실패를 구분할 근거가 없으면 `NO_ANSWER`로 추정하지 않고 `TECHNICAL_FAILURE` 또는 integrity/data-quality 문제로 처리한다.

## 33B. status별 transcript / STT / recording 계약

빈 문자열 `""`은 모든 status에서 금지한다. transcript가 없으면 `null`을 사용한다.

| status | `answer_transcript` | `stt.available` / `stt.complete` | `data_quality.stt` | recording/VAD 관계 |
|---|---|---|---|---|
| `ANSWERED` | 비어 있지 않은 raw STT 문자열 필수 | `available=true`; `complete=true`가 원칙, 부분 손상이 있으면 `complete=false` 허용 | `GOOD/PARTIAL/LOW` | recording은 선택; 없어도 가능 |
| `NO_ANSWER` | `null` 필수 | STT 서비스 상태에 따라 `available=true/false`; transcript는 생성하지 않음 | 실제 수집상태에 맞게 `GOOD/PARTIAL/LOW/UNAVAILABLE` | 무발화를 판정할 신뢰 가능한 응답-window/VAD 등 근거 필요 |
| `CUT_OFF` | raw STT가 있으면 비어 있지 않은 문자열, STT 자체가 없으면 `null` | transcript가 있으면 `available=true`, `complete=false`; 없으면 `available=false`, `complete=false` | 실제 수집상태에 맞게 설정 | 실제 발화가 시작되었음이 확인되어야 함 |
| `STT_UNAVAILABLE` | `null` 필수 | `available=false`, `complete=false` | `UNAVAILABLE` | 실제 발화 존재를 VAD 또는 recording 등으로 확인해야 함 |
| `USER_SKIPPED` | `null` 필수 | 서비스 상태와 무관하나 평가 transcript를 생성하지 않음 | 실제 수집상태에 맞게 설정 | 평가할 답변이 없어야 함 |
| `TECHNICAL_FAILURE` | `null` 또는 장애 전 확보된 비어 있지 않은 raw STT 문자열 | 장애 상태에 따라 설정; `complete=false` | 보통 `LOW` 또는 `UNAVAILABLE`, 실제 상태를 기록 | technical error 근거를 `integrity.technical_errors`에 기록 |

`TECHNICAL_FAILURE`에 부분 transcript가 남아 있어도 정상 답변으로 승격하지 않는다. 해당 문자열은 장애 진단용 원자료이며 지원자 감점 근거로 자동 사용하지 않는다.

---

# 34. answer_transcript

raw STT 원문 또는 위 status 계약에 따른 `null`.

규칙:

- 임의 문법 교정 금지
- 전문용어 자동 수정 금지
- filler 제거 금지
- 더 자연스러운 문장으로 재작성 금지
- transcript 부재를 빈 문자열로 표현하지 않음
- `NO_ANSWER`, `STT_UNAVAILABLE`, `USER_SKIPPED`는 `null`
- `ANSWERED`는 비어 있지 않은 문자열
- `CUT_OFF`, `TECHNICAL_FAILURE`는 §33B 계약을 따름

수정본은 별도 `stt.edited_transcript`.

---

# 35. presentation

정확한 구조:

```json
{
  "presentation": {
    "mode": "BLIND_AFTER_TTS",
    "question_visible_during_answer": false,
    "question_visible_duration_ms": 6200,
    "question_replay_count": 0,
    "preparation_time_ms": 0,
    "timer_visible": false,
    "tts_used": true
  }
}
```

---

# 36. presentation 규칙

- `mode`: environment enum과 동일 계열
- `question_visible_during_answer`: boolean
- `question_visible_duration_ms`: 0 이상 정수 또는 null
- `question_replay_count`: 0 이상 정수
- `preparation_time_ms`: 0 이상 정수
- `timer_visible`: boolean
- `tts_used`: boolean

question replay 무결성:

- `environment.question_replay_allowed = false`이면 모든 `questions[].presentation.question_replay_count`는 반드시 `0`
- 같은 조건에서 `QUESTION_REPLAYED` event가 존재해서도 안 됨
- event log가 정상적으로 보존된 세션에서는 질문별 `QUESTION_REPLAYED` event 개수와 `question_replay_count`가 정확히 일치해야 함
- event 손실 또는 technical error 때문에 개수를 검증할 수 없으면 값을 추정하여 맞추지 않고 §71A `PARTIAL_IF`로 처리하며 해당 질문의 replay 맥락 신뢰도를 낮춤

---

# 37. timing

정확한 구조:

```json
{
  "timing": {
    "response_latency_ms": 1420,
    "answer_duration_ms": 72000,
    "speech_duration_ms": 52400,
    "silence_duration_ms": 19600
  }
}
```

모든 값:

- 0 이상 정수 또는 null
- 단위 ms

`answer_duration_ms` 공식 의미:

> 첫 실제 발화 시작부터 해당 답변 lifecycle 종료(`ANSWER_END` 또는 비기술적 cut-off)까지의 경과시간. `response_latency_ms` 구간은 포함하지 않는다.

원칙:

- 실제 발화가 없으면 `answer_duration_ms = null`
- `CUT_OFF`라도 실제 발화 시작과 종료 시점을 측정할 수 있으면 관찰된 구간의 `answer_duration_ms`를 기록할 수 있음
- speech/silence가 모두 정상 측정된 경우 작은 측정 오차를 제외하고 `speech_duration_ms + silence_duration_ms ≈ answer_duration_ms`
- `ANSWER_TOO_SHORT` / `ANSWER_TOO_LONG`의 유일한 공식 비교 metric은 이 `answer_duration_ms`

---

# 38. response_latency 기준

질문별 `response_latency_ms`는 해당 질문의:

```text
RESPONSE_WINDOW_START
```

이후 첫 실제 발화까지의 시간.

NO_ANSWER 또는 기술 실패를 임의의 큰 latency 값으로 만들지 않는다.

측정 불가면 null.

---

# 39. speech_metrics

정확한 구조:

```json
{
  "speech_metrics": {
    "speech_ratio": 0.7278,
    "silence_ratio": 0.2722,
    "pause_500ms_count": 9,
    "pause_1000ms_count": 4,
    "pause_2000ms_count": 1,
    "pause_3000ms_count": 0,
    "longest_pause_ms": 2810,
    "mean_pause_ms": 910,
    "median_pause_ms": 680,
    "filler_count": 7,
    "filler_per_minute": 8.0,
    "repetition_count": 2,
    "restart_count": 3,
    "self_correction_count": 1,
    "character_count": 164,
    "sentence_count": 7,
    "characters_per_minute_total": 136.7,
    "characters_per_minute_speech": 187.8
  }
}
```

각 값은 측정되지 않았으면 null.

---

# 40. speech_ratio / silence_ratio

둘 다 측정된 경우:

```text
0.0 <= value <= 1.0
```

일반적으로:

```text
speech_ratio + silence_ratio ≈ 1
```

작은 floating point 오차는 epsilon 허용.

한 값이 미수집이면 null.

나머지 값을 임의로 계산하여 채우지 않는다.

---

# 41. filler_detection

정확한 구조:

```json
{
  "filler_detection": {
    "method": "TRANSCRIPT_HEURISTIC",
    "estimated": true
  }
}
```

사이트 filler 값이 STT 기반 휴리스틱임을 명시한다.

평가엔진이 실제 음성에서 완벽히 검출된 값으로 오해하지 않게 한다.

---

# 42. stt

정확한 구조:

```json
{
  "stt": {
    "available": true,
    "complete": true,
    "recognition_confidence": null,
    "restart_count": 0,
    "error_count": 0,
    "manually_edited": true,
    "edited_transcript": "사용자가 수정한 텍스트"
  }
}
```

---

# 43. recognition_confidence

`null` 허용.

Web Speech API 환경에서 confidence가 없거나 신뢰하기 어려울 수 있다.

null은 자동 오류가 아니다.

---

# 44. edited_transcript

수동 수정 기능을 구현하면:

- `answer_transcript`는 raw STT 원문 유지
- `stt.edited_transcript`에 수정본 저장
- `stt.manually_edited = true`
- `integrity.manual_edit_log`에 수정 기록

수정하지 않았으면:

```json
"edited_transcript": null
```

원본을 덮어쓰지 않는다.

---

# 45. data_quality enum

질문별 구조:

```json
{
  "data_quality": {
    "timing": "GOOD",
    "vad": "GOOD",
    "stt": "PARTIAL",
    "recording": "GOOD"
  }
}
```

각 값의 V1 enum:

```text
GOOD
PARTIAL
LOW
UNAVAILABLE
```

다른 문자열 금지.

---

# 46. runtime rule 공식 enum

Pack의 runtime trigger와 연결되는 공식 값:

```text
ALWAYS_ELIGIBLE
RANDOM
KEYWORD_ANY
ANSWER_TOO_SHORT
ANSWER_TOO_LONG
NO_ANSWER
DONT_KNOW_PATTERN
AFTER_PARENT
SESSION_TIME_REMAINING
```

단, `runtime_signals`에 실제 관찰·평가 결과를 기록하는 type은 다음을 기본으로 한다.

```text
RANDOM
KEYWORD_ANY
ANSWER_TOO_SHORT
ANSWER_TOO_LONG
NO_ANSWER
DONT_KNOW_PATTERN
SESSION_TIME_REMAINING
```

`ALWAYS_ELIGIBLE`과 `AFTER_PARENT`는 구조적 eligibility 규칙이므로 관찰 signal을 만들 필요가 없다.

---

# 47. runtime_signals의 의미

`runtime_signals`는:

> 해당 질문의 답변 처리 또는 직후 세션 상태에서 사이트가 관찰한 규칙 기반 신호들의 배열.

한 질문에서 여러 signal이 동시에 발생할 수 있으므로 단수 object를 사용하지 않는다.

예:

- 답변이 짧음
- 동시에 특정 keyword가 포함됨

이면 두 signal을 모두 기록할 수 있다.

평가 정답이 아니며 의미론적 판단이 아니다.

---

# 48. runtime_signals 공통 구조

`runtime_signals`는 배열.

signal 공통 필수:

```text
type
observed
used_for_branching
```

- `observed`: 해당 규칙 조건이 실제 관찰되었는지
- `used_for_branching`: 실제 후속 질문 선택에 이 signal이 사용되었는지

측정하지 않은 조건을 `observed=false`로 대량 생성하지 않는다. 실제 평가한 규칙만 기록한다.

---

# 49. runtime_signals — ANSWER_TOO_SHORT / LONG

예:

```json
{
  "type": "ANSWER_TOO_SHORT",
  "observed": true,
  "measured_value": 8200,
  "threshold_value": 15000,
  "unit": "ms",
  "used_for_branching": true
}
```

공식 의미:

```text
measured_value = 해당 source 질문의 timing.answer_duration_ms
threshold_value = source Pack runtime_trigger.threshold_ms
```

판정:

```text
ANSWER_TOO_SHORT: measured_value < threshold_value
ANSWER_TOO_LONG : measured_value > threshold_value
```

규칙:

- `measured_value`, `threshold_value`는 0 이상 정수이며 `threshold_value`는 Pack 규칙상 0보다 큼
- unit은 `"ms"`
- 경계값 동일이면 해당 short/long signal은 `observed=true`가 될 수 없음
- `timing.answer_duration_ms = null`이면 판정 자체를 수행할 수 없으므로 해당 short/long signal을 생성하지 않음
- `response_latency_ms`, `speech_duration_ms`, `silence_duration_ms`를 `measured_value`로 대체하지 않음

---

# 50. runtime_signals — KEYWORD_ANY / DONT_KNOW_PATTERN

KEYWORD_ANY:

```json
{
  "type": "KEYWORD_ANY",
  "observed": true,
  "matched_keyword": "정확도",
  "matched_text": "정확도가 높아졌습니다",
  "used_for_branching": true
}
```

DONT_KNOW_PATTERN:

```json
{
  "type": "DONT_KNOW_PATTERN",
  "observed": true,
  "matched_phrase": "잘 모르겠습니다",
  "matched_text": "그 부분은 잘 모르겠습니다",
  "used_for_branching": false
}
```

문자열 감지 사실만 기록한다.

---

# 51. runtime_signals — RANDOM / SESSION_TIME_REMAINING / NO_ANSWER

RANDOM 예:

```json
{
  "type": "RANDOM",
  "observed": true,
  "probability": 0.25,
  "draw_value": 0.18,
  "used_for_branching": true
}
```

`draw_value`를 보존할 수 있으면 0~1 값을 기록한다. 미보존이면 생략 가능.

SESSION_TIME_REMAINING 예:

```json
{
  "type": "SESSION_TIME_REMAINING",
  "observed": true,
  "operator": "LTE",
  "measured_value": 84000,
  "threshold_value": 90000,
  "unit": "ms",
  "used_for_branching": false
}
```

NO_ANSWER 예:

```json
{
  "type": "NO_ANSWER",
  "observed": true,
  "used_for_branching": true
}
```

---

# 52. runtime_signals 의미론적 판정 금지

다음을 signal type으로 만들지 않는다.

```text
CONCEPT_ERROR
RECORD_CONFLICT
ROLE_CONFUSION
EVIDENCE_CONFUSION
OVERCLAIM
```

사이트는 평가 의미론을 생성하지 않는다.

`runtime_signals`가 여러 개 있더라도 평가엔진은 실제 질문·transcript·학생부 근거를 독립적으로 해석한다.

---

# 53. followup_trigger

FOLLOWUP 질문의 `followup_trigger`는 `null` 또는 아래 closed object 중 정확히 하나다.

`followup_trigger`는 실제로 현재 FOLLOWUP이 선택될 때 적용된 하나의 Pack runtime rule을 기록한다.

FOLLOWUP에서 허용되는 type:

```text
AFTER_PARENT
RANDOM
KEYWORD_ANY
ANSWER_TOO_SHORT
ANSWER_TOO_LONG
NO_ANSWER
DONT_KNOW_PATTERN
SESSION_TIME_REMAINING
```

모든 FOLLOWUP은 `parent_question_id`가 실제 제시되고 답변 처리가 종료된 이후에만 선택될 수 있으므로, 이 구조적 parent gate 자체는 별도 signal로 중복 기록하지 않는다.

ROOT는 항상:

```json
"followup_trigger": null
```

실제 선택 원인을 보존하지 못했으면 허용 type을 추측하지 않고 `null`을 기록한다.

---

# 54. followup_trigger — ANSWER_TOO_SHORT / ANSWER_TOO_LONG

정확한 구조:

```json
{
  "type": "ANSWER_TOO_SHORT",
  "source_question_id": "Q001",
  "used_signal": true,
  "measured_value": 8200,
  "threshold_value": 15000,
  "unit": "ms"
}
```

`ANSWER_TOO_LONG`도 동일 구조에서 `type`만 바꾼다.

필수/허용 규칙:

- required keys: `type`, `source_question_id`, `used_signal`, `measured_value`, `threshold_value`, `unit`
- `used_signal`은 실제 선택 원인이므로 반드시 `true`
- `measured_value`는 source 질문의 `timing.answer_duration_ms`
- `threshold_value`는 Pack의 `threshold_ms`
- `unit`은 정확히 `"ms"`
- SHORT는 `measured_value < threshold_value`, LONG은 `measured_value > threshold_value`
- 경계값 동일 또는 `answer_duration_ms=null`인 경우 이 trigger로 FOLLOWUP을 선택할 수 없음
- 위 key 외 추가 필드 금지

---

# 55. followup_trigger — KEYWORD_ANY / DONT_KNOW_PATTERN

`KEYWORD_ANY` 정확한 구조:

```json
{
  "type": "KEYWORD_ANY",
  "source_question_id": "Q001",
  "used_signal": true,
  "matched_keyword": "정확도",
  "matched_text": "정확도가 높아졌습니다"
}
```

`DONT_KNOW_PATTERN` 정확한 구조:

```json
{
  "type": "DONT_KNOW_PATTERN",
  "source_question_id": "Q001",
  "used_signal": true,
  "matched_phrase": "잘 모르겠습니다",
  "matched_text": "그 부분은 잘 모르겠습니다"
}
```

규칙:

- 각 object의 표시된 모든 key는 required
- `used_signal`은 반드시 `true`
- `matched_keyword` / `matched_phrase`는 실제 Pack rule에 포함되어 매칭된 비어 있지 않은 문자열
- `matched_text`는 실제 source transcript에서 매칭된 비어 있지 않은 표면 문자열
- KEYWORD_ANY에 `matched_phrase` 금지, DONT_KNOW_PATTERN에 `matched_keyword` 금지
- 표시된 key 외 추가 필드 금지

---

# 56. followup_trigger — RANDOM / SESSION_TIME_REMAINING

`RANDOM` 정확한 구조:

```json
{
  "type": "RANDOM",
  "source_question_id": "Q001",
  "used_signal": true,
  "probability": 0.25
}
```

규칙:

- required keys: `type`, `source_question_id`, `used_signal`, `probability`
- `used_signal`은 반드시 `true`
- `probability`는 source Pack rule의 0~1 숫자
- 추가 필드 금지

`SESSION_TIME_REMAINING` 정확한 구조:

```json
{
  "type": "SESSION_TIME_REMAINING",
  "source_question_id": "Q001",
  "used_signal": true,
  "operator": "LTE",
  "measured_value": 84000,
  "threshold_value": 90000,
  "unit": "ms"
}
```

규칙:

- required keys: `type`, `source_question_id`, `used_signal`, `operator`, `measured_value`, `threshold_value`, `unit`
- `used_signal`은 반드시 `true`
- `operator`는 source Pack rule의 `LT/LTE/GT/GTE` 중 하나
- `measured_value`는 해당 trigger 평가 시점의 실제 세션 남은 시간(ms)
- `threshold_value`는 source Pack rule의 `threshold_ms`
- `unit`은 정확히 `"ms"`
- `operator` 비교식이 실제로 참일 때만 이 trigger로 FOLLOWUP 선택 가능
- 추가 필드 금지

---

# 57. followup_trigger — AFTER_PARENT / NO_ANSWER

`AFTER_PARENT` 정확한 구조:

```json
{
  "type": "AFTER_PARENT",
  "source_question_id": "Q001",
  "used_signal": true
}
```

`NO_ANSWER` 정확한 구조:

```json
{
  "type": "NO_ANSWER",
  "source_question_id": "Q001",
  "used_signal": true
}
```

규칙:

- 두 object 모두 required keys는 `type`, `source_question_id`, `used_signal`
- `used_signal`은 반드시 `true`
- `NO_ANSWER`는 source 질문의 `answer_status=NO_ANSWER`와 논리적으로 일치해야 함
- `AFTER_PARENT`는 별도 answer-derived signal 없이 parent gate 종료만으로 선택된 경우 사용
- 추가 필드 금지

---

# 58. followup_trigger 참조 및 closed-object 무결성

FOLLOWUP에서:

```text
followup_trigger.source_question_id == parent_question_id
```

이어야 한다.

다른 질문의 신호를 원인처럼 기록하지 않는다.

각 `type`은 §54~§57의 required key와 허용 key만 사용한다. 다른 trigger type의 전용 필드를 혼합하거나 unknown key를 추가하지 않는다.

JSON Schema 구현 시 `type` discriminator 기반 `oneOf`와 `additionalProperties: false`로 표현할 수 있어야 한다.

answer-derived 또는 session signal 기반 trigger가 선택 원인이면 대응 `runtime_signals`에 같은 관찰을 기록하고 `used_for_branching=true`로 일치시킨다. `AFTER_PARENT`는 구조 규칙이므로 runtime signal을 요구하지 않는다.

---

# 59. recording

질문별 optional 구조:

```json
{
  "recording": {
    "available": true,
    "file": "audio/Q012.webm",
    "mime_type": "audio/webm"
  }
}
```

녹음 없음:

```json
{
  "recording": {
    "available": false,
    "file": null,
    "mime_type": null
  }
}
```

audio 파일이 ZIP에 없으면 `available = false`.

---

# 60. events.json event object

모든 이벤트의 공통 필수 필드:

```json
{
  "event_id": "EV000001",
  "question_id": "Q012",
  "type": "SPEECH_START",
  "timestamp_ms": 1420
}
```

공통 필수 필드 외의 선택 필드는 event type별로만 허용한다.

허용 가능한 선택 필드의 타입:

```text
duration_ms : 0 이상 정수
pair_id     : 비어 있지 않은 문자열
value       : 문자열
metadata    : STT_ERROR 전용 closed object
```

`metadata`를 임의 확장 object로 사용하지 않는다. 허용되지 않은 event type에 선택 필드를 추가하면 schema 오류다.

---

# 61. event_id

형식 권장:

```text
EV000001
EV000002
...
```

세션 안에서 고유.

중복 금지.

---

# 62. event type enum

V1 허용값:

```text
QUESTION_SHOWN
QUESTION_HIDDEN
QUESTION_REPLAYED
TTS_START
TTS_END
RESPONSE_WINDOW_START
SPEECH_START
SPEECH_END
PAUSE_START
PAUSE_END
STT_START
STT_RESTART
STT_ERROR
STT_FINAL
FILLER_DETECTED
ANSWER_END
```

다른 event type 임의 생성 금지.

발화행동 detection event는 사이트가 실제로 관찰·계산한 경우에만 기록하며, 심리상태나 답변 품질을 의미하지 않는다.

---

# 63. event timestamp 기준

`events.json.timestamp_ms`는:

```text
세션 시작 = 0ms
```

기준 상대시간.

항상:

- 0 이상 정수
- 세션 시간 범위 내

질문 내부 `response_latency_ms`는 별도 정의로 `RESPONSE_WINDOW_START` 기준.

둘을 혼동하지 않는다.

README에 기준을 명시한다.

---

# 64. event type별 선택 필드 규격

## PAUSE_START

허용:

```text
pair_id (optional)
```

## PAUSE_END

허용:

```text
duration_ms (required)
pair_id     (optional)
```

`pair_id`를 사용하면 대응 PAUSE_START / PAUSE_END에서 같은 값을 사용하며 세션 내 다른 pause pair와 중복하지 않는다.

## FILLER_DETECTED

허용:

```text
value (optional)
```

`value`는 실제 감지된 filler의 짧은 표면 문자열이다. 추정한 의도나 평가 문장을 넣지 않는다.

예:

```json
{
  "event_id": "EV000120",
  "question_id": "Q006",
  "type": "FILLER_DETECTED",
  "timestamp_ms": 182440,
  "value": "음"
}
```

## STT_ERROR

허용되는 `metadata` 정확한 구조:

```json
{
  "code": "string-or-null",
  "message": "string-or-null"
}
```

추가 key 금지. `value`, `duration_ms`, `pair_id`는 사용하지 않는다.

## 그 밖의 event type

공통 필수 필드 외 선택 필드 금지.

이 규칙은 JSON Schema에서 event `type`을 discriminator로 하는 `oneOf`로 구현하는 것을 권장한다.

---

# 65. summary

정확한 구조:

```json
{
  "summary": {
    "total_answer_duration_ms": 0,
    "total_speech_duration_ms": 0,
    "total_silence_duration_ms": 0,
    "mean_response_latency_ms": 0,
    "median_response_latency_ms": 0,
    "max_response_latency_ms": 0,
    "total_pause_1000ms_count": 0,
    "total_pause_2000ms_count": 0,
    "total_pause_3000ms_count": 0,
    "session_longest_pause_ms": 0,
    "total_filler_count": 0,
    "filler_per_minute": 0,
    "total_restart_count": 0,
    "total_self_correction_count": 0,
    "mean_characters_per_minute_total": 0,
    "mean_characters_per_minute_speech": 0,
    "coverage": {
      "question_count_total": 10,
      "question_count_with_timing": 10,
      "question_count_with_vad": 9,
      "question_count_with_stt": 10,
      "question_count_with_filler_metrics": 8
    }
  }
}
```

각 summary metric은 측정불가 시 null 허용.

---

# 66. summary.coverage

필수 목적:

> 일부 질문만 측정되었는데 전체 통계가 완전한 것처럼 보이는 문제 방지.

필드:

```text
question_count_total
question_count_with_timing
question_count_with_vad
question_count_with_stt
question_count_with_filler_metrics
```

모두 0 이상 정수이며 각 coverage count는 `question_count_total`을 초과할 수 없다.

재계산 규칙:

```text
question_count_total
= questions.length

question_count_with_timing
= count(data_quality.timing in {GOOD, PARTIAL, LOW}
        AND timing의 4개 필드 중 하나 이상 non-null)

question_count_with_vad
= count(data_quality.vad in {GOOD, PARTIAL, LOW}
        AND VAD 유래 timing/speech metric 중 하나 이상 non-null)

question_count_with_stt
= count(stt.available == true
        AND data_quality.stt in {GOOD, PARTIAL, LOW})

question_count_with_filler_metrics
= count(speech_metrics.filler_count != null
        AND filler_detection.method == "TRANSCRIPT_HEURISTIC")
```

`LOW`는 “수집됨” coverage에는 포함하지만 평가 신뢰도는 낮게 해석한다. `UNAVAILABLE`은 해당 coverage에 포함하지 않는다.

VAD 유래 metric에는 최소 다음이 포함된다.

```text
speech_duration_ms
silence_duration_ms
speech_ratio
silence_ratio
pause_500ms_count
pause_1000ms_count
pause_2000ms_count
pause_3000ms_count
longest_pause_ms
mean_pause_ms
median_pause_ms
```

---

# 67. summary 집계 정책

summary는 `questions` 배열에서 다음 규칙으로 유일하게 재계산 가능해야 한다.

합계/최댓값:

- `total_answer_duration_ms` = non-null `timing.answer_duration_ms` 합계
- `total_speech_duration_ms` = non-null `timing.speech_duration_ms` 합계
- `total_silence_duration_ms` = non-null `timing.silence_duration_ms` 합계
- `total_pause_1000ms_count` = non-null `speech_metrics.pause_1000ms_count` 합계
- `total_pause_2000ms_count` = non-null `speech_metrics.pause_2000ms_count` 합계
- `total_pause_3000ms_count` = non-null `speech_metrics.pause_3000ms_count` 합계
- `session_longest_pause_ms` = non-null `speech_metrics.longest_pause_ms`의 최댓값
- `total_filler_count` = non-null `speech_metrics.filler_count` 합계
- `total_restart_count` = non-null `speech_metrics.restart_count` 합계. `stt.restart_count`를 사용하지 않음
- `total_self_correction_count` = non-null `speech_metrics.self_correction_count` 합계

평균/중앙값:

- `mean_response_latency_ms` = non-null `timing.response_latency_ms`의 산술평균
- `median_response_latency_ms` = 같은 집합의 중앙값
- `max_response_latency_ms` = 같은 집합의 최댓값
- `mean_characters_per_minute_total` = non-null 질문별 `speech_metrics.characters_per_minute_total`의 산술평균
- `mean_characters_per_minute_speech` = non-null 질문별 `speech_metrics.characters_per_minute_speech`의 산술평균

`summary.filler_per_minute`는 질문별 rate의 단순평균이 아니라 pooled rate로 계산한다.

```text
eligible = filler_count != null
           AND speech_duration_ms != null
           AND speech_duration_ms > 0

filler_per_minute
= sum(eligible filler_count)
  / (sum(eligible speech_duration_ms) / 60000)
```

eligible 질문이 0개면 `filler_per_minute = null`.

공통 null 규칙:

- 해당 summary metric의 source 값이 하나도 없으면 `null`
- 일부 질문이 null이면 그 질문만 해당 metric의 집계에서 제외
- null을 0으로 치환하지 않음
- rate/mean의 분모가 0이면 `null`
- 불완전 coverage 자체는 오류가 아니지만 coverage와 집계값이 위 규칙으로 재계산되지 않으면 integrity 문제

예:

```text
Q1 filler_count=2, speech_duration_ms=30000
Q2 filler_count=3, speech_duration_ms=60000
Q3 filler_count=null

summary.total_filler_count = 5
summary.filler_per_minute = 5 / (90000/60000) = 3.333...
question_count_with_filler_metrics = 2
```

---

# 68. response_latency 평균

평균 대상:

> 실제 첫 발화가 감지되어 `response_latency_ms != null`인 질문만.

NO_ANSWER 또는 TECHNICAL_FAILURE를 큰 latency로 변환하지 않는다.

질문 수가 0이면 mean/median/max 모두 `null`.

---

# 69. filler total

`filler_count = null`인 질문을 0으로 간주하지 않는다.

`total_filler_count`는 `speech_metrics.filler_count`가 non-null인 질문들의 합계다.

반드시:

```text
summary.coverage.question_count_with_filler_metrics
```

와 함께 해석한다.

측정 질문 0개:

```json
"total_filler_count": null
```

`summary.filler_per_minute`는 §67 pooled rate 공식을 사용한다.

---

# 70. integrity

정확한 기본 구조:

```json
{
  "integrity": {
    "status": "VALID",
    "missing_fields": [],
    "stt_warning_questions": [],
    "timing_warning_questions": [],
    "vad_warning_questions": [],
    "manually_edited_transcript": false,
    "manual_edit_log": [],
    "session_truncated": false,
    "technical_errors": [],
    "notes": []
  }
}
```

status enum:

```text
VALID
PARTIAL
INVALID
```

기존 배열 원소 계약:

```text
missing_fields            : string[]
stt_warning_questions     : question_id string[]
timing_warning_questions  : question_id string[]
vad_warning_questions     : question_id string[]
manual_edit_log           : object[]
technical_errors          : string[]
notes                     : string[]
```

세부 규칙:

- 모든 string 원소는 비어 있으면 안 됨
- `missing_fields`는 누락된 필드의 점 경로 또는 JSON Pointer 성격의 경로 문자열을 저장하며 object를 넣지 않음
- warning question 배열의 각 ID는 `questions[].question_id`에 실제 존재해야 하며 중복 금지
- `technical_errors`, `notes`는 자연어 문자열 배열이며 object를 넣지 않음
- 모든 배열은 중복 원소 금지

`manual_edit_log` 각 object의 정확한 구조:

```json
{
  "question_id": "Q003",
  "edited_at": "2026-09-22T12:06:10+09:00"
}
```

규칙:

- required keys: `question_id`, `edited_at`
- `question_id`는 실제 questions 배열에 존재
- `edited_at`은 ISO-8601 문자열
- 추가 key 금지
- 같은 question에 여러 번 수정이 발생하면 서로 다른 `edited_at`으로 여러 항목을 기록할 수 있음

---

# 71. integrity 추가 검증 대상

반드시 확인:

- source Pack SHA-256 형식
- Pack question reference
- evidence_ids / record_evidence 1:1 대응
- interviewer reference
- ROOT/FOLLOWUP 관계
- followup_trigger source reference
- enum
- event_id uniqueness
- event timestamp
- environment 조합
- summary coverage
- summary/questions 심각한 불일치
- runtime_signals 배열 구조 및 type별 필드
- audio reference / 실제 파일 일치
- answer_status / answer_transcript / stt 조합
- question replay 전역/문항/event 일치
- integrity 배열 원소 schema와 question_id reference

오류를 숨기지 않는다.

## 71A. integrity status 결정 규칙

이 절이 HANDOFF integrity severity의 단일 canonical rule이다. 다른 절에서 `INVALID`, `PARTIAL`, warning을 설명하더라도 최종 `integrity.status`는 반드시 이 절의 mapping으로 결정한다.

상태는 다음 우선순위로 결정한다.

```text
INVALID > PARTIAL > VALID
```

하나라도 `INVALID_IF` 조건이 있으면 전체 status는 `INVALID`다.
`INVALID_IF`가 없고 하나라도 `PARTIAL_IF`가 있으면 `PARTIAL`이다.
둘 다 없으면 `VALID`이다.
`WARNING_ONLY`는 단독으로 status를 낮추지 않는다.

### INVALID_IF

다음은 source identity 또는 질문-답변 매핑을 신뢰할 수 없어 정상 평가를 만들 수 없는 오류다.

- `handoff_schema`가 공식 값이 아님
- `session.session_id` 또는 `source_pack.pack_id`가 없음
- `source_pack.schema`가 공식 Pack schema가 아님
- `source_pack.sha256` 형식이 잘못됨
- 포함된 `interview-pack.json`의 실제 SHA-256이 `source_pack.sha256`과 다름
- 포함된 `interview-pack.json`의 `pack_id`가 HANDOFF `source_pack.pack_id`와 다름
- `environment.question_presentation_mode = TTS_ONLY`인데 `environment.tts_enabled = false`
- `environment.question_presentation_mode = BLIND_AFTER_TTS`인데 `environment.tts_enabled = false`
- `question_id` 중복 등으로 질문-답변 대응 전반을 고유하게 복원할 수 없음
- ROOT/FOLLOWUP 참조 손상이 세션 전반에 걸쳐 있어 질문 트리를 복원할 수 없음
- questions 배열 또는 필수 질문 본문/answer_status가 광범위하게 손상되어 문항 단위 평가 자체가 성립하지 않음

### PARTIAL_IF

다음은 일부 분석 또는 독립 검증이 제한되지만 평가 가능한 데이터가 남는 오류다.

- 표준 ZIP에서 `interview-pack.json` 누락
- `source_pack.generator_version`이 포함된 Pack의 `generator.engine_version`과 불일치
- 일부 interviewer reference 불일치
- 일부 HANDOFF question_id가 source Pack에서 확인되지 않아 해당 문항을 독립 검증할 수 없음
- 일부 ROOT/FOLLOWUP 참조 손상이나 question_count 불일치가 있으나 실제 questions 배열에서 나머지 문항을 고유하게 복원 가능
- 일부 질문의 Pack snapshot 필드가 source Pack 원값과 불일치
- 일부 질문의 필수 `pack_primary_text` 누락 또는 source Pack 원값과 불일치
- 일부 `record_evidence` snapshot 누락 또는 불일치
- answer_status / answer_transcript / stt 조합이 §33B와 일부 불일치하지만 영향 질문을 분리 가능
- `environment.question_replay_allowed=false`인데 일부 question의 replay_count가 양수이거나 `QUESTION_REPLAYED` event가 존재
- event log가 정상 보존되었다고 주장되지만 질문별 `QUESTION_REPLAYED` event 수와 `question_replay_count`가 일부 불일치
- event 손실/technical error 때문에 replay count 상호검증이 불가능
- 일부 timing / VAD / STT / recording 데이터 누락 또는 LOW
- event의 type별 선택 필드 규격 위반이 일부 존재
- 일부 event timestamp 또는 pause pair 손상
- summary와 질문별 metric이 일부 불일치
- 세션이 중간 종료되었지만 평가 가능한 질문이 남아 있음

PARTIAL 오류는 영향을 받은 질문·평가축을 N/A 또는 신뢰도 하향 처리할 수 있으며, 지원자 감점으로 직접 전환하지 않는다.

### WARNING_ONLY

다음은 기록하거나 사용자에게 알릴 수 있으나 그 자체로 status를 낮추지 않는다.

- sequence가 비연속이지만 중복이 없고 실제 순서를 복원 가능
- optional audio가 원래 비활성화되어 없음
- recognition_confidence가 null
- 수동 transcript 수정이 규격대로 원문과 분리 보존됨
- summary coverage가 낮지만 개별 원자료와 coverage가 정확히 표시됨
- 작은 floating point ratio 오차

기술 오류가 여러 개 결합되어 실제 평가 가능성이 더 낮아지면 개별 항목이 WARNING_ONLY여도 상위 PARTIAL/INVALID 조건에 해당하는지 다시 판정한다.

---

# 72. null과 0

절대 구분.

```text
null = 미수집 / 적용 불가
0 = 측정했으며 실제 값이 0
```

예:

```json
{
  "recognition_confidence": null,
  "filler_count": 0
}
```

의미가 다르다.

---

# 73. handoff.md

`handoff.json`의 사람용 mirror.

원칙:

- 새 해석 없음
- 점수 없음
- 칭찬 없음
- 개선점 없음
- 합격 가능성 없음
- 원본 질문/답변/주요 측정치만 표현
- JSON에 없는 사실 추가 금지

충돌 시 JSON 우선.

---

# 74. answers.csv

질문별 1행.

최소 컬럼:

```text
question_id
sequence
interviewer_id
relation
root_question_id
parent_question_id
question_type
question_intent
question_text
pack_primary_text
cognitive_difficulty
priority
coverage_tags
recommended_answer_min_seconds
recommended_answer_max_seconds
evidence_ids
record_evidence_json
followup_trigger_type
followup_trigger_source_question_id
runtime_signals_json
answer_status
answer_transcript
presentation_mode
question_visible_during_answer
question_replay_count
preparation_time_ms
response_latency_ms
answer_duration_ms
speech_duration_ms
silence_duration_ms
speech_ratio
silence_ratio
pause_500ms_count
pause_1000ms_count
pause_2000ms_count
pause_3000ms_count
longest_pause_ms
mean_pause_ms
median_pause_ms
filler_count
filler_per_minute
repetition_count
restart_count
self_correction_count
character_count
sentence_count
characters_per_minute_total
characters_per_minute_speech
recognition_confidence
stt_complete
timing_quality
vad_quality
stt_quality
recording_available
recording_file
```

---

# 75. CSV 배열 직렬화

배열 필드는 CSV에서 JSON 배열 문자열로 직렬화한다.

예:

```text
["evidence","ownership"]
```

따라서:

```text
coverage_tags
evidence_ids
```

는 JSON array text를 CSV cell에 저장.

임의의 쉼표 결합 문자열을 사용하지 않는다.

---

# 76. CSV 인코딩

기본 데이터 의미는 UTF-8.

한국어 Excel 호환을 위해 실제 사이트는 UTF-8 BOM CSV를 생성할 수 있다.

README에 인코딩 명시.

---

# 77. events.csv

`events.json`의 mirror.

최소 컬럼:

```text
event_id
question_id
type
timestamp_ms
duration_ms
pair_id
value
metadata
```

`duration_ms`, `pair_id`, `value`, `metadata`는 §64에서 허용된 event type에만 값이 존재할 수 있으며, 그 밖의 행에서는 빈 값으로 둔다. CSV 열의 존재가 JSON event의 임의 확장을 허용하는 것은 아니다.

canonical은 events.json.

---

# 78. transcript.md

질문과 답변을 순서대로 표시.

규칙:

- raw STT 원문 보존
- 질문 원문 수정 금지
- 누락 답변 추정 금지
- 기술 오류 표시 가능
- 평가 문장 추가 금지

---

# 79. audio/

녹음 세션에서만 포함.

권장:

```text
audio/Q001.webm
audio/Q002.webm
...
```

사용자가 음성 미포함을 선택하면 없는 것이 정상.

`recording.available`과 실제 파일 존재가 일치해야 한다.

---

# 80. README.md 필수 내용

최소:

- handoff schema
- session_id
- source pack id
- source pack SHA-256
- 원본 `interview-pack.json` 포함 여부
- source Pack 독립 검증 결과
- site version
- runtime policy version
- difficulty engine version
- metrics engine version
- canonical source가 handoff.json임
- event timestamp 기준
- 질문 timing 기준
- audio 포함 여부
- CSV 인코딩
- summary coverage 의미
- record_evidence가 복수 evidence snapshot 배열이라는 점
- runtime_signals가 복수 규칙 관찰 배열이라는 점
- null과 0의 차이

평가 결과를 적지 않는다.

---

# 81. 수동 transcript 수정 로그

`stt.manually_edited = true`인 경우 반드시:

```text
integrity.manual_edit_log
```

에 §70에서 정의한 exact object를 1개 이상 기록한다.

필수:

- `question_id`
- `edited_at` ISO-8601 timestamp
- 수정 전 raw는 `answer_transcript`에 유지
- 수정본은 `stt.edited_transcript`에 존재

`stt.manually_edited = false`이면 해당 question_id의 manual_edit_log 항목을 생성하지 않는다.

원문 덮어쓰기 금지.

---

# 82. HANDOFF에서 금지되는 평가

사이트는 HANDOFF에 다음을 넣지 않는다.

- 점수
- 등급
- 잘한 점
- 못한 점
- 개선 방법
- 합격 가능성
- 성격 판단
- 개념 오류 확정
- 학생부 충돌 확정
- 진정성 평가

---

# 83. Schema Validation Checklist

개발자가 그대로 테스트 케이스로 사용할 수 있는 최소 검증 목록:

1. `handoff_schema == INTERVIEW_EVAL_HANDOFF/1.2`
2. session_id 존재
3. source_pack.schema == INTERVIEW_PACK/1.0
4. source_pack.pack_id 존재
5. source_pack.sha256 64자리 lowercase hex
6. session.question_count == questions.length
7. question_id 고유
8. sequence 중복 없음
9. sequence 연속성 검사
10. interviewer_id가 source Pack에 존재
11. relation enum 유효
12. ROOT 규칙 유효
13. FOLLOWUP 규칙 유효
14. root_question_id 참조 유효
15. parent_question_id 참조 유효
16. cognitive_difficulty enum 유효
17. priority 정수 1~5
18. coverage_tags가 Pack 원값과 일치
19. recommended_answer_seconds 구조 유효
20. question_text 비어 있지 않음
21. pack_primary_text 필수 존재, 비어 있지 않은 문자열, source Pack primary_text와 일치
22. answer_status enum 유효
23. answer_status별 transcript null/string 규칙이 §33B와 일치
24. presentation mode 유효
25. environment enum 유효
26. TTS/presentation 조합 유효
27. timing 값 음수 금지
28. speech_ratio 0~1
29. silence_ratio 0~1
30. 두 ratio 합의 심각한 불일치 확인
31. stt 구조 유효
32. edited_transcript 규칙 유효
33. data_quality enum 유효
34. runtime_signals 배열 구조 유효
35. runtime_signals type enum 유효
36. followup_trigger 구조 유효
37. followup_trigger source == parent_question_id
38. FOLLOWUP의 trigger type이 source Pack relation 규칙과 호환
39. runtime_signals의 `used_for_branching=true`와 followup_trigger가 가능한 범위에서 논리 일치
40. event_id 고유
41. event type enum 유효
42. event timestamp 0 이상
43. pause duration 0 이상
44. summary.coverage 존재
45. coverage count <= question_count_total
46. null과 0 정책 준수
47. summary와 질문별 metric 심각한 불일치 검사
48. integrity 존재
49. recording 구조 유효
50. recording.available과 audio 파일 존재 일치
51. evidence_ids와 record_evidence ID 집합 일치
52. 복수 evidence 질문에서 모든 evidence snapshot 보존
53. runtime_policy_version 존재
54. difficulty_engine_version 존재
55. unknown 핵심 필드 없음
56. HANDOFF에 평가 결과 없음
57. 표준 ZIP에 원본 `interview-pack.json` 존재 여부 확인
58. 포함된 Pack bytes SHA-256 == source_pack.sha256
59. source_pack.pack_id == 포함된 Pack pack_id
60. source_pack.generator_version == 포함된 Pack generator.engine_version
61. 선택 question_id가 포함된 Pack question_bank에 존재
62. pack_primary_text 및 평가용 snapshot 메타데이터가 Pack 원값과 일치
63. record_evidence snapshot이 Pack 원값과 일치
64. event type별 허용 optional field만 존재
65. PAUSE_END에 duration_ms 존재 및 0 이상
66. PAUSE pair_id 사용 시 START/END pair 일치
67. STT_ERROR.metadata가 정확한 closed object 구조
68. FILLER_DETECTED의 value가 문자열 또는 생략
69. integrity.status가 §71A severity mapping과 일치
70. FOLLOWUP trigger `NO_ANSWER` exact object 검증
71. FOLLOWUP trigger `DONT_KNOW_PATTERN` exact object 및 matched_phrase/text 검증
72. FOLLOWUP trigger `SESSION_TIME_REMAINING` operator/measured/threshold/unit 검증
73. FOLLOWUP trigger 각 type의 required/forbidden field 및 unknown key 금지 검증
74. `ANSWER_TOO_SHORT`: `answer_duration_ms < threshold_ms`일 때만 true
75. `ANSWER_TOO_LONG`: `answer_duration_ms > threshold_ms`일 때만 true
76. short/long 경계값 동일 시 false, `answer_duration_ms=null`이면 판정/선택 불가
77. short/long runtime_signal과 followup_trigger `measured_value == timing.answer_duration_ms`
78. `ANSWERED`의 transcript/STT 조합이 §33B와 일치
79. `NO_ANSWER`, `STT_UNAVAILABLE`, `USER_SKIPPED`의 `answer_transcript == null`
80. `CUT_OFF`, `TECHNICAL_FAILURE` 조합이 §33B와 일치
81. `TTS_ONLY + tts_enabled=false`이면 expected integrity.status = INVALID
82. `BLIND_AFTER_TTS + tts_enabled=false`이면 expected integrity.status = INVALID
83. `question_replay_allowed=false`이면 모든 replay_count=0이며 QUESTION_REPLAYED event 없음
84. event log 정상 시 질문별 QUESTION_REPLAYED count == question_replay_count
85. summary.coverage가 §66 boolean rule로 재계산됨
86. summary.filler_per_minute가 §67 pooled rate와 일치
87. summary.total_restart_count가 `speech_metrics.restart_count` 합계와 일치하고 `stt.restart_count`를 사용하지 않음
88. integrity 배열 원소 타입/구조 및 manual_edit_log timestamp/question reference 유효

status는 §71A의 `INVALID > PARTIAL > VALID` 우선순위로 결정한다. 구현자가 임의로 severity를 변경하지 않는다.

---

# 84. source Pack과의 데이터 보존 검사

사이트는 선택된 질문에 대해 평가에 필요한 Pack 메타데이터를 손실 없이 보존해야 한다. 또한 표준 ZIP의 원본 `interview-pack.json`을 이용해 평가엔진 또는 별도 validator가 이 snapshot을 독립적으로 대조할 수 있어야 한다.

```text
question_id
question_type
question_intent
cognitive_difficulty
priority
coverage_tags
recommended_answer_seconds
evidence_ids
record_evidence snapshot
primary_text → pack_primary_text
```

실제 제시 variant는:

```text
question_text
```

에 저장.

`record_evidence`는 `evidence_ids`가 가리키는 source Pack의 evidence object를 그대로 snapshot한다.

Pack의 모든 미선택 질문이나 전체 question_bank를 HANDOFF에 복제할 필요는 없다.

---

# 85. Runtime Signals과 Follow-up Trigger 관계

정의:

```text
runtime_signals
= 부모 질문 답변 처리 또는 직후 세션 상태에서 실제 평가된 규칙 기반 관찰들의 배열

followup_trigger
= 그 규칙 중 현재 FOLLOWUP 선택에 실제 사용된 Pack runtime rule의 기록
```

둘은 같은 객체가 아니다.

한 부모 질문에서 여러 `runtime_signals`가 동시에 존재할 수 있다.

`followup_trigger`가 signal 기반이면 대응 signal의 `used_for_branching = true`와 논리적으로 일치해야 한다.

`AFTER_PARENT`처럼 구조적 eligibility만으로 선택된 경우 대응 runtime signal이 없어도 정상이다.

---

# 86. 평가엔진이 신뢰하면 안 되는 것

HANDOFF에 있더라도 다음은 지원자의 실력 판정 그 자체가 아니다.

- runtime_signals
- followup_trigger
- difficulty_preset
- question_replay_count
- response_latency
- filler_count
- pause count
- data_quality

평가엔진이 맥락과 원자료를 함께 해석해야 한다.

---

# 87. 공식 철학

`INTERVIEW_EVAL_HANDOFF/1.2`이 답해야 하는 질문:

> 면접에서 실제로 무슨 일이 있었는가?

답하지 말아야 하는 질문:

> 그 답변은 잘했는가?

두 번째 질문은 평가엔진의 책임이다.

---

# 88. 최종 데이터 흐름

```text
INTERVIEW_PACK/1.0
→ 面逆力 웹사이트
→ myeonyeokryeok_result_<session_id>.zip
   ├─ handoff.json
   ├─ interview-pack.json
   ├─ handoff.md
   ├─ answers.csv
   ├─ events.json
   ├─ events.csv
   ├─ transcript.md
   ├─ README.md
   └─ audio/ (optional)
→ 평가 엔진
```

canonical source:

```text
handoff.json
```

---

# 89. 최종 성공 기준

본 규격의 목표는 평가를 사이트에 추가하는 것이 아니다.

성공 기준:

- 평가에 필요한 선택 질문의 Pack 메타데이터가 손실되지 않음
- 복수 evidence 질문의 근거가 모두 보존됨
- 실제 제시 문구가 보존됨
- trigger 원인과 복수 runtime signal이 구조화됨
- 원본 `interview-pack.json`을 결과 ZIP에서 독립 검증 가능
- source_pack SHA-256과 포함 Pack bytes의 일치 여부를 재계산 가능
- Pack snapshot 필드를 source Pack 원값과 독립 대조 가능
- event timestamp 기준이 명확
- summary coverage가 보존됨
- null과 0을 구분함
- STT 원문과 수정본을 구분함
- audio reference가 추적 가능함
- 모든 enum과 참조가 JSON Schema로 옮길 수 있을 만큼 명확함

최종적으로:

> 사이트의 주관을 끼워 넣지 않고, 실제 면접에서 발생한 질문·답변·환경·시간·STT·발화행동·기술상태를 평가엔진이 독립적으로 해석할 수 있을 정도로 손실 없이 보존한다.

이 문서는 이후 작성될 `INTERVIEW_EVAL_HANDOFF/1.2` JSON Schema의 사람이 읽는 공식 명세 역할을 한다.
