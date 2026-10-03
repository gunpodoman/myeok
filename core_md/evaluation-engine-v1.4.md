# 학생부 기반 실전면접 평가엔진 v1.4 FINAL

## 0. 문서의 역할

이 문서는 面逆力 서비스에서 사용하는 실전면접 평가엔진 v1.4의 최종 기준 명세다.

평가엔진은 `INTERVIEW_EVAL_HANDOFF/1.2`을 입력받아 실제 면접 결과를 사후 해석한다.

핵심 철학:

> 사이트는 측정하고 평가 엔진은 해석한다.

> 내용과 전달을 분리한다.

> 질문별 평가 후 세션을 종합한다.

> 학생부 사실성·역할·출처 경계를 우선한다.

> Root와 Follow-up의 흐름을 본다.

> STT/VAD 품질과 면접 환경을 맥락으로 사용한다.

> 발화 비유창성은 단순 횟수가 아니라 위치·군집·전달 영향·회복 여부를 함께 본다.

> filler·pause·restart 같은 현상을 긴장, 불안, 성격, 자신감 같은 심리상태로 단정하지 않는다.

> 총점보다 실패 원인을 찾는 것을 중요하게 본다.

---

# 1. 공식 입력

공식 입력 규격:

```text
INTERVIEW_EVAL_HANDOFF/1.2
```

canonical source:

```text
handoff.json
```

ZIP 패키지가 입력되면 ZIP 내부의 `handoff.json`을 source of truth로 사용한다.

보조자료:

```text
interview-pack.json
handoff.md
answers.csv
events.json
events.csv
transcript.md
audio/
학생부 원문
```

정보 충돌 우선순위:

1. 학생부 원문
2. handoff.json의 실제 질문·record_evidence·질문 Intent
3. answer_transcript / edited_transcript
4. events.json 원시 이벤트
5. handoff.json 파생 통계
6. CSV / Markdown mirror
7. 평가엔진의 해석

`interview-pack.json`은 이 우선순위에서 지원자 답변의 내용 정답으로 사용하지 않는다. source Pack provenance와 HANDOFF snapshot 일치 여부를 검증하는 용도이며, 실제 제시 문구는 HANDOFF의 `question_text`를 우선한다.

학생부 원문과 excerpt가 충돌하면 별도 이슈로 표시한다.

---

# 2. 입력 검증

평가 전에 최소 다음을 검사한다.

```text
handoff_schema
session.session_id
source_pack.schema
source_pack.pack_id
source_pack.sha256
session.question_count
question_id uniqueness
sequence
ROOT/FOLLOWUP relationship
root_question_id
parent_question_id
question_text
question_intent
cognitive_difficulty
priority
coverage_tags
recommended_answer_seconds
answer_status
answer_transcript
presentation
timing
speech_metrics
filler_detection
runtime_signals
stt
data_quality
recording
summary.coverage
integrity
원본 interview-pack.json 존재 여부 및 SHA-256 일치
Pack question/interviewer/snapshot cross-check
```

입력 상태:

```text
VALID
PARTIAL
INVALID
```

HANDOFF의 `integrity.status`는 그대로 신뢰하는 평가 정답이 아니라 검증 대상이다. 평가엔진은 가능하면 패키지 원자료를 이용해 HANDOFF §71A severity mapping을 다시 확인한다.

INVALID이면 정상 세션처럼 종합점수를 만들지 않는다.

표준 ZIP에 `interview-pack.json`이 있으면 반드시 source Pack 독립 검증을 수행한다.

검증:

```text
실제 Pack bytes SHA-256
pack_id
generator.engine_version
선택 question_id 존재
interviewer_id 존재
question_type
question_intent
cognitive_difficulty
priority
coverage_tags
recommended_answer_seconds
evidence_ids
pack_primary_text
record_evidence snapshot
```

원본 Pack이 누락되면 HANDOFF snapshot만으로 평가 가능한 범위의 평가는 가능하지만, source Pack 독립 검증이 불가능하므로 입력은 최소 `PARTIAL`로 취급하고 세션 평가 신뢰도는 `HIGH`로 둘 수 없다.

Pack 원본의 hash 또는 pack_id가 HANDOFF provenance와 충돌하면 `INVALID`다.

Pack snapshot의 일부 필드만 충돌하면 해당 질문 또는 관련 축을 N/A/신뢰도 하향 처리하고 `PARTIAL`로 기록한다. 잘못 복사된 snapshot을 지원자 감점 근거로 사용하지 않는다.

`pack_primary_text`는 HANDOFF 1.2의 필수 snapshot 필드다. 일부 질문에서 누락되면 최소 `PARTIAL`이며, 원본 Pack이 있으면 provenance/variant 검증에 Pack `primary_text`를 참고할 수 있으나 HANDOFF에 누락된 값을 사후 복원하여 정상 입력처럼 취급하지 않는다. 원본 Pack도 없으면 해당 질문의 primary/variant 대조는 검증 불가로 남긴다.

---

# 3. 신규 질문 메타데이터

HANDOFF 질문별 다음 필드를 그대로 읽는다.

```text
cognitive_difficulty
priority
coverage_tags
recommended_answer_seconds
pack_primary_text
record_evidence
```

이 값은 source Pack에서 보존된 평가 관련 메타데이터다.

`record_evidence`는 복수 근거 질문에서 모든 evidence snapshot을 보존하는 배열이다.

평가엔진이 재생성하거나 임의 수정하지 않는다.

## 3A. answer_status별 기본 평가 정책

HANDOFF의 `answer_status`는 먼저 §33~§34 lifecycle 계약과 일치하는지 검증한 뒤 평가에 사용한다.

| status | 질문별 Q1~Q5 기본 처리 | Follow-up Response Score | 핵심 원칙 |
|---|---|---|---|
| `ANSWERED` | 평가 가능한 자료로 Q1~Q5 정상 평가 | 정상 평가 | transcript/data quality에 따라 신뢰도 조정 |
| `NO_ANSWER` | Q1 질문 적합성 `0`; Q2~Q5는 평가 내용/발화가 없으므로 `N/A` | 해당 문항이 FOLLOWUP이면 `0` | 실제 무응답을 기술 실패와 혼동하지 않음 |
| `CUT_OFF` | 관찰된 답변 범위에서 Q1~Q5 평가 가능; 잘렸다는 이유만으로 자동 0점 금지 | 관찰 범위에서 평가 가능 | 종료 전에 핵심 요구를 처리했는지 실제 내용으로 판단; 비기술적 cut-off 자체는 별도 벌점 아님 |
| `STT_UNAVAILABLE` | Q1~Q4는 기본 `N/A`; Q5는 timing/VAD/audio가 평가 가능할 때만 평가 | 기본 `N/A` | audio가 있어도 raw STT 부재를 임의 transcript로 복원하지 않음 |
| `USER_SKIPPED` | Q1 `0`; Q2~Q5 `N/A` | FOLLOWUP이면 `0` | 명시적 skip 사실만 기록하고 이유·심리상태를 추정하지 않음 |
| `TECHNICAL_FAILURE` | 기술 오류 영향 축은 `N/A`; 정상 점수 0으로 전환 금지 | `N/A` | 부분 transcript가 있어도 장애 영향이 해소되지 않으면 지원자 감점 근거로 사용하지 않음 |

추가 규칙:

- `NO_ANSWER`와 `USER_SKIPPED`는 모두 응답 수행 자체는 없으므로 Q1/Follow-up 대응에서 0이 될 수 있지만, 원인은 구분하여 보고한다.
- `STT_UNAVAILABLE`에서 recording이 존재하고 실제 오디오 분석을 지원하더라도 현재 공식 content transcript를 새로 만들어 정상 `ANSWERED`처럼 취급하지 않는다. 오디오는 전달/발화 존재 확인 등 지원 가능한 보조 분석에만 사용한다.
- `CUT_OFF`가 기술 오류 때문이면 `CUT_OFF`가 아니라 `TECHNICAL_FAILURE` 계약을 적용한다.
- status와 transcript/STT 조합이 HANDOFF §33B에 어긋나면 해당 질문의 관련 축을 N/A/신뢰도 하향하고 HANDOFF integrity를 최소 `PARTIAL`로 재판정한다.
- 질문 자체 오류가 있으면 status 정책보다 질문 품질/N/A 규칙을 우선하여 지원자에게 책임을 전가하지 않는다.

---

# 4. cognitive_difficulty 사용

허용:

```text
D1
D2
D3
D4
D5
D6
```

사용처:

- response latency 해석
- 답변 구조 복잡성 기대수준
- Follow-up 깊이 해석
- 즉석 변형 요구 수준 해석
- 강한 질문 선정 참고

금지:

> D6라서 자동 보너스 점수

공식 점수는 답변 품질로 계산한다.

---

# 5. priority 사용

`priority`는 질문 생성 단계에서의 중요도다.

범위:

```text
1~5 정수
```

공식 세션 점수의 단순 가중치로 사용하지 않는다.

금지:

```text
priority 5 = priority 1보다 5배 반영
```

참고 가능:

- 가장 위험한 질문 선정
- 핵심 위험 중요도 해석
- recheck priority
- 치명적 사실충돌 노출

---

# 6. coverage_tags 사용

질문이 어떤 영역을 겨냥했는지 설명하는 메타데이터다.

사이트가 전달한 값을 그대로 사용한다.

평가엔진이 새로운 tag를 생성하여 원본처럼 취급하지 않는다.

질문 유형별 성과 분석과 Coverage 해석에 사용할 수 있다.

---

# 7. recommended_answer_seconds 사용

형식:

```json
{
  "min": 30,
  "max": 60
}
```

또는 `null`.

이 값은 답변 길이·간결성의 참고치다.

범위를 넘었다는 이유만으로 자동 감점하지 않는다.

함께 고려:

- 내용 밀도
- 반복
- 질문 적합성
- cognitive difficulty
- Root / Follow-up
- presentation mode
- preparation time

---

# 8. source_pack.sha256

있으면 보고서 세션 정보에 추적정보로 보존한다.

평가에 사용하지 않는다.

형식 오류 또는 누락:

- 입력 무결성 문제
- 지원자 성과와 무관

hash를 신뢰도·실력 점수에 반영하지 않는다.

---

# 9. followup_trigger 해석

`followup_trigger`는 사이트가 해당 Follow-up을 선택한 규칙 기반 원인이다.

예:

```text
ANSWER_TOO_SHORT
KEYWORD_ANY
RANDOM
AFTER_PARENT
```

가능한 해석:

> 사이트가 해당 규칙을 만족하여 이 Follow-up 후보를 선택했다.

금지:

```text
ANSWER_TOO_SHORT → 내용이 실제로 부실했다
KEYWORD_ANY → 해당 키워드 관련 개념 오류가 있었다
```

반드시 실제 transcript를 독립적으로 평가한다.

---

# 10. runtime_signals 해석

`runtime_signals`는 사이트의 규칙 기반 관찰 신호 배열이다.

한 답변에서 여러 signal이 동시에 존재할 수 있다.

평가 정답이 아니다.

평가엔진은:

- 질문
- transcript
- `record_evidence`
- 학생부 원문
- event
- timing

을 다시 독립적으로 해석한다.

`used_for_branching=true`는 사이트 선택 경로를 설명할 뿐, 지원자 답변의 정오를 뜻하지 않는다.

`RANDOM`, `SESSION_TIME_REMAINING` 같은 신호는 내용 품질 평가 근거로 사용하지 않는다.

---

# 11. summary.coverage 우선 확인

전체 통계를 읽기 전에 `summary.coverage`를 확인한다.

예:

```json
{
  "question_count_total": 10,
  "question_count_with_timing": 10,
  "question_count_with_vad": 9,
  "question_count_with_stt": 10,
  "question_count_with_filler_metrics": 3
}
```

이 경우 금지:

> 면접 전체에서 필러가 8회였다.

가능:

> 필러 지표가 수집된 3개 질문 범위에서는 총 8회가 감지되었다.

coverage 부족은 평가 신뢰도에 반영한다.

---

# 12. 질문별 공식 0~4 루브릭

질문별 평가축:

```text
Q1 질문 적합성
Q2 구체성 및 근거
Q3 논리 및 개념
Q4 학생부 일관성 및 역할경계
Q5 전달
```

각 축:

```text
0
1
2
3
4
N/A
```

기술적 또는 자료 부족으로 평가할 수 없으면 `0`이 아니라 `N/A`.

---

# 13. 질문 적합성 0~4

## 4
질문의 핵심 요구에 초반부터 직접 답하고 끝까지 관련성을 유지.

## 3
핵심에는 답했지만 일부 우회 또는 불필요한 배경이 있음.

## 2
관련 내용은 있으나 질문 핵심 요구의 답이 부분적이거나 늦게 등장.

## 1
대부분 질문에서 벗어나거나 핵심 요구를 거의 처리하지 못함.

## 0
질문에 사실상 답하지 못했거나 완전히 다른 내용을 답함.

## N/A
예:

- TECHNICAL_FAILURE
- STT 완전 손실
- 질문 자체가 평가 불가능

---

# 14. 구체성 및 근거 0~4

## 4
본인 행동·방법·근거·조건·결과 또는 실제 사례가 충분히 구체적이며 출처 경계도 명확.

## 3
대체로 구체적이나 한두 개 핵심 근거 또는 세부설명이 부족.

## 2
일부 구체적 요소가 있으나 추상적인 설명이 상당 부분 차지.

## 1
대부분 일반론이며 실제 행동이나 근거가 거의 없음.

## 0
검증 가능한 근거가 없거나 질문상 필요한 근거를 전혀 제시하지 못함.

fabrication 또는 직접충돌은 별도 Critical Issue에도 기록한다.

---

# 15. 논리 및 개념 0~4

## 4
핵심 개념이 정확하고 주장·이유·근거·결론 연결이 자연스러움.

## 3
대체로 정확하나 설명 연결 또는 개념 세부에 작은 공백.

## 2
핵심 방향은 맞지만 논리 연결이 약하거나 개념 이해가 부분적.

## 1
중요한 논리 비약 또는 개념 오류 존재.

## 0
핵심 개념을 잘못 이해했거나 답변 논리가 성립하지 않음.

STT 오류 가능성이 높으면 강한 감점 대신 N/A 또는 신뢰도 하향을 고려한다.

---

# 16. 학생부 일관성 및 역할경계 0~4

## 4
학생부와 일치하며 본인·팀·모델·문헌·실측 등의 경계를 명확히 설명.

## 3
대체로 일치하고 경계도 적절하나 약간의 모호함.

## 2
직접 충돌은 없지만 학생부만으로 확인하기 어렵거나 역할·출처 경계가 불분명.

## 1
POSSIBLE_CONFLICT 또는 중요한 역할·출처 혼동이 존재.

## 0
DIRECT_CONFLICT 또는 명확한 근거 출처 왜곡이 존재.

학생부 원문과 해당 질문의 `record_evidence`가 모두 부족하면 N/A 가능.

---

# 17. 전달 0~4

전달 평가는 단순 유창성 점수가 아니다.

다음 자료를 함께 본다.

```text
response latency
pause
filled pause
repetition
restart
self-correction
search expression
trailing off
hesitation cluster
speech rate
answer structure
recovery
data quality
```

## 4
흐름이 안정적이며 pause·filler·restart 등이 있더라도 자연스럽거나 통제된 수준이다. 자기수정이 발생해도 정확성 또는 명료성을 높인 뒤 즉시 회복하며 의미 전달을 방해하지 않는다.

## 3
작은 망설임·필러·반복 또는 재시작이 눈에 띄지만 이해와 답변 구조에는 거의 영향이 없다.

## 2
필러·정지·반복·재시작 또는 hesitation cluster가 여러 차례 나타나 일부 구간의 흐름을 끊는다. 다만 전체 답변의 의미와 구조는 충분히 이해할 수 있다.

## 1
여러 질문 또는 한 답변의 핵심 구간에서 비유창성 군집이 반복되고, 회복이 늦어 답변 구조·논리 전달을 자주 방해한다.

## 0
지속적인 전달 붕괴로 답변의 상당 부분을 이해하거나 평가하기 어렵다.

## N/A
기술 문제, STT/VAD 손상, 심각한 event 누락 등으로 전달 평가 자체가 불가능하다.

주의:

- filler_count가 많다는 사실만으로 점수를 정하지 않는다.
- self-correction 자체를 부정적으로 보지 않는다.
- pause 길이만으로 심리상태를 추론하지 않는다.
- 내용점수와 전달점수를 같은 현상으로 이중 감점하지 않는다.

---

# 17A. 질문별 0~4 Calibration Anchors

자연어 루브릭의 실행 편차를 줄이기 위해 다음 boundary case를 공통 calibration으로 사용한다.

점수 판정 원칙:

> 해당 답변이 만족하는 가장 높은 점수의 핵심 조건을 선택한다. 상위 점수의 핵심 조건을 하나라도 충족하지 못하면 바로 아래 anchor와 비교한다. 단순 문체 선호로 0.5점 또는 임의 중간점수를 만들지 않는다.

서로 다른 축은 독립적으로 판정한다. 한 답변이 질문 적합성 4이면서 구체성 2일 수 있다.

## Q1 질문 적합성 Calibration

질문 예: `이 방법을 선택한 이유는 무엇인가요?`

```text
4: 첫 문장부터 선택 기준을 밝히고 끝까지 선택 이유에 집중한다.
3: 선택 이유는 명확히 답하지만 배경 설명이 일부 길다.
2: 활동 설명을 오래 한 뒤 후반에 선택 이유를 한두 문장 언급한다.
1: 방법을 어떻게 사용했는지만 설명하고 왜 선택했는지는 거의 답하지 않는다.
0: 다른 활동이나 전혀 다른 주제로 답해 선택 이유를 제시하지 않는다.
```

경계: 질문의 핵심 요구가 실제로 답변되었는지가 2와 1을 가르는 기준이다.

## Q2 구체성 및 근거 Calibration

질문 예: `그 결과를 어떤 근거로 판단했나요?`

```text
4: 본인이 사용한 자료·측정·조건·수치 또는 비교 기준을 구체적으로 제시하고 출처를 구분한다.
3: 핵심 근거와 방법은 구체적이지만 수치·조건·출처 중 일부가 빠진다.
2: 실제 사례나 방법 하나는 있으나 대부분 "효과가 좋았다" 같은 추상 표현이다.
1: "열심히 했다", "자료를 찾아봤다" 수준의 일반론만 제시한다.
0: 필요한 근거를 전혀 제시하지 못하거나 근거가 없다고 답한다.
```

경계: 구체적 사실 하나가 있다는 이유만으로 3을 주지 않는다. 질문 판단을 지지하는 핵심 근거가 있어야 3 이상이다.

## Q3 논리 및 개념 Calibration

질문 예: `그 결과가 왜 그렇게 나왔다고 해석했나요?`

```text
4: 개념이 정확하고 주장→이유→근거→결론의 연결이 성립한다.
3: 핵심 개념은 정확하지만 인과 연결 또는 한 단계 설명이 생략된다.
2: 결론 방향은 타당하나 이유가 부분적으로만 연결되거나 개념 설명이 불완전하다.
1: 결론 일부는 관련 있으나 핵심 개념 오류 또는 큰 논리 비약이 있다.
0: 핵심 개념을 반대로 이해하거나 답변 논리가 성립하지 않는다.
```

경계: 작은 용어 실수와 핵심 개념 오류를 구분한다. STT 오류 가능성이 있으면 점수 확정보다 신뢰도 하향/N/A를 우선 검토한다.

## Q4 학생부 일관성 및 역할경계 Calibration

질문 예: `그 수치는 직접 측정한 값인가요?`

```text
4: 학생부와 일치하며 직접 측정/프로그램 출력/팀 수행 등 출처를 명확히 구분한다.
3: 학생부와 대체로 일치하고 본인 역할도 설명하지만 일부 경계가 약간 모호하다.
2: 직접 충돌은 없으나 "저희가 했다"처럼 본인·팀 또는 측정·모델 출력의 경계가 불분명하다.
1: 학생부와 충돌 가능성이 높거나 중요한 역할/출처를 서로 바꾸어 설명한다.
0: 명확한 DIRECT_CONFLICT 또는 실제 출처를 다른 종류로 단정하는 왜곡이 확인된다.
```

경계: 학생부에 정보가 없다는 이유만으로 1을 주지 않는다. 충돌 근거가 없고 확인도 불가능하면 2 또는 N/A를 검토한다.

## Q5 전달 Calibration

```text
4: pause/filler가 있더라도 분산되어 있고 문장 구조와 핵심 전달이 안정적이며 즉시 회복한다.
3: "음/어"나 짧은 restart가 눈에 띄지만 의미 전달과 구조에는 거의 영향이 없다.
2: 여러 차례 hesitation cluster 또는 재시작으로 일부 흐름이 끊기지만 전체 의미는 이해 가능하다.
1: 핵심 구간마다 군집성 비유창성과 늦은 recovery가 반복되어 논리 전달을 자주 방해한다.
0: 발화 붕괴가 지속되어 답변의 상당 부분을 이해하기 어렵다.
```

경계: 단순 횟수보다 impact와 recovery가 우선한다. 동일 filler 8회라도 전달 방해가 작으면 3일 수 있고, 횟수가 적어도 핵심 근거 구간이 반복적으로 붕괴하면 2 이하일 수 있다.

## Calibration 실행 규칙

- 각 질문 평가 시 최소 하나의 anchor와 실제 답변을 대조한다.
- 4와 3, 3과 2, 2와 1의 경계가 애매하면 어떤 핵심 조건이 충족/미충족인지 평가 문장에 남긴다.
- 기술적 손상 때문에 경계를 판정할 수 없으면 억지로 낮은 점수를 주지 않고 N/A 또는 평가 신뢰도 하향을 사용한다.
- 동일 답변을 재평가할 때는 먼저 같은 anchor를 적용하고, 단순 인상에 따라 점수를 이동시키지 않는다.

---

# 18. 질문별 총점

5축이 모두 평가 가능하면:

```text
earned / 20
```

일부 축 N/A면:

```text
earned / available_max
```

를 먼저 표시한다.

필요 시 20점 환산값을 병기할 수 있다.

예:

```text
원점수: 14 / 16
환산: 17.5 / 20
```

환산값임을 명시한다.

원점수와 평가 가능 최대점을 숨기지 않는다.

---

# 19. 질문별 20점의 용도

질문별 점수는 진단용이다.

금지:

- 질문별 20점 단순 평균 = 세션 100점
- 하나의 치명적 사실충돌을 평균으로 희석
- priority로 단순 자동 가중

---

# 20. 공식 세션 6축

단일 공식 세션 체계:

```text
질문 적합성                  30
구체성 및 근거               20
논리 및 개념                 15
학생부 일관성 및 역할경계     15
꼬리질문 대응력               10
전달 안정성                  10
-------------------------------
합계                        100
```

다른 종합 가중치 체계를 만들지 않는다.

---

# 21. 세션 질문 적합성 30점

평가 가능한 질문의 `질문 적합성 0~4` 산술평균:

```text
fit_mean = 합계 / 평가가능질문수
```

축 점수:

```text
fit_session = fit_mean / 4 × 30
```

priority 자동가중 금지.

---

# 22. 세션 구체성 및 근거 20점

평가 가능한 질문의 해당 0~4 산술평균.

```text
specificity_session = mean / 4 × 20
```

---

# 23. 세션 논리 및 개념 15점

평가 가능한 질문의 해당 0~4 산술평균.

```text
logic_session = mean / 4 × 15
```

---

# 24. 세션 학생부 일관성 및 역할경계 15점

평가 가능한 질문의 해당 0~4 산술평균.

```text
record_role_session = mean / 4 × 15
```

단:

- DIRECT_CONFLICT
- 중대한 ROLE_OR_EVIDENCE_CONFUSION

은 평균에 묻히지 않도록 Critical Issue로 별도 표시.

추가 임의 벌점을 중복 적용하지 않는다.

---

# 25. Follow-up Response Score 0~4

평가 가능한 각 FOLLOWUP 답변에 별도 점수를 준다.

## 4
직전 주장과 일관성을 유지하며 요구된 명료화·수정·근거·경계를 정확하게 처리.

## 3
대체로 대응했으나 일부 불완전.

## 2
부분 대응했으나 핵심 검증 요구가 남음.

## 1
질문 방향에 적응하지 못하거나 기존 주장과 중요한 불일치 발생.

## 0
꼬리질문에 사실상 대응하지 못함.

## N/A
질문 오류·기술 실패 등으로 평가 불가.

---

# 25A. Follow-up Response Calibration

질문 예: Root에서 방법 선택 이유를 설명한 뒤 Follow-up으로 `그 대안보다 이 방법이 낫다고 본 근거는 무엇인가요?`가 제시된 경우.

```text
4: 직전 주장과 모순 없이 비교 기준과 근거를 새로 제시해 Follow-up의 추가 검증 요구를 완전히 처리한다.
3: 추가 요구에는 답했지만 비교 기준이나 근거 중 하나가 다소 불완전하다.
2: 직전 답을 반복하면서 일부 추가 설명만 하여 Follow-up의 새로운 검증 요구가 상당 부분 남는다.
1: Follow-up이 요구한 방향에 적응하지 못하거나 직전 주장과 중요한 불일치가 생긴다.
0: 질문에 답하지 못하거나 관련 없는 답변으로 사실상 대응하지 못한다.
```

경계 규칙:

- 단순히 더 길게 답했다는 이유로 상향하지 않는다.
- 핵심은 부모 질문 이후 새로 요구된 검증 차원을 처리했는가이다.
- 부모 질문 자체가 잘못되었거나 Follow-up progression이 깨졌으면 지원자 점수보다 질문 품질 문제/N/A를 우선한다.

---

# 26. 세션 꼬리질문 대응력 10점

평가 가능한 FOLLOWUP이 2개 이상:

```text
followup_session = followup_mean / 4 × 10
```

평가 가능한 FOLLOWUP이 1개:

- 질적 분석 제공
- 세션 10점 축은 `N/A`

0개:

```text
N/A
```

1개만으로 전체 세션의 꼬리질문 대응 능력을 일반화하지 않는다.

---

# 27. 전달 안정성 5축

세션 전달은 다음 5개 하위축으로 평가한다.

```text
START_STABILITY
FLOW
PACING
CONCISION
SESSION_STABILITY
```

각 항목:

```text
4 안정적
3 경미한 문제
2 눈에 띄는 문제
1 반복적으로 방해
0 심각하게 방해
N/A 데이터 부족
```

---

# 28. START_STABILITY

평가자료:

- response_latency
- question difficulty
- presentation mode
- preparation time
- replay
- ROOT/FOLLOWUP

초기 반응 안정성을 본다.

---

# 29. FLOW

평가자료:

- pause
- filled pause
- restart
- repetition
- self-correction
- search expression
- trailing off
- hesitation cluster
- raw transcript
- event 위치
- recovery
- STT/VAD/data quality

의미 전달 흐름을 본다.

`DISFLUENCY_CONTROL`은 FLOW를 판단하는 핵심 진단자료이지만 독립적인 공식 세션 점수축은 아니다.

---

# 29A. Disfluency & Verbal Behavior Analysis

평가엔진은 답변의 발화 비유창성(disfluency)과 언어적 습관을 별도 진단 계층으로 분석한다.

목적:

> “음/어를 몇 번 사용했는가?”를 세는 것이 아니라, 어떤 종류의 비유창성이 어디에서 반복되고 실제 의미 전달을 얼마나 방해했으며 이후 회복했는지를 설명한다.

분석 대상:

```text
FILLED_PAUSE
SILENT_PAUSE
REPETITION
RESTART
SELF_CORRECTION
SEARCH_EXPRESSION
TRAILING_OFF
HESITATION_CLUSTER
PARALINGUISTIC_VOCAL_EVENT
```

이 분류는 평가엔진의 해석용 내부 분류다.

HANDOFF의 새 enum으로 취급하지 않는다.

---

# 29B. 비유창성 유형 정의

## FILLED_PAUSE

발화권을 유지하거나 다음 표현을 탐색하는 동안 사용하는 비어휘적 또는 저정보 표현.

대표 예:

```text
음
어
어...
음...
저...
그...
```

문자열이 같아도 실제 문맥에서 의미를 갖는 경우 filler로 자동 판정하지 않는다.

## SILENT_PAUSE

실제 발화 없이 정지한 구간.

가능하면 `PAUSE_START` / `PAUSE_END` event 또는 VAD 기반 pause를 우선한다.

## REPETITION

의미 추가 없이 단어·구·짧은 문장 일부를 바로 반복하는 현상.

예:

```text
제가, 제가 맡은 부분은...
이 결과가, 이 결과가 의미하는 것은...
```

강조를 위한 의도적 반복과 구분한다.

## RESTART

시작한 문장 구조를 중단하고 다른 구조로 다시 시작하는 현상.

예:

```text
제가 처음에는 그 방법을... 아니, 실제로는 두 번째 방법부터 적용했습니다.
```

## SELF_CORRECTION

자신의 표현·사실·수치·개념을 스스로 수정하는 현상.

self-correction은 자동 부정 신호가 아니다.

정확성을 높이고 바로 회복하면 통제된 수정으로 본다.

## SEARCH_EXPRESSION

답변 내용을 찾거나 표현을 구성하는 과정이 언어로 노출되는 경우.

예:

```text
뭐라고 해야 할지...
어떻게 표현하면...
잠시 생각해보면...
```

일회성 사용은 정상적인 사고 과정일 수 있다.

## TRAILING_OFF

문장을 끝까지 완결하지 못하고 의미 연결이 흐려지거나 중단되는 현상.

STT 손상과 구분할 수 없으면 강한 판정을 하지 않는다.

## HESITATION_CLUSTER

짧은 구간에 둘 이상의 비유창성 유형이 연속 또는 밀집하여 나타나는 패턴.

예:

```text
FILLED_PAUSE → SILENT_PAUSE → RESTART
REPETITION → FILLED_PAUSE → SELF_CORRECTION
```

단일 filler보다 전달 방해 가능성이 높으므로 별도로 본다.

## PARALINGUISTIC_VOCAL_EVENT

오디오가 실제로 분석 가능한 경우에만 다음과 같은 음성 기반 사건을 보조적으로 관찰할 수 있다.

```text
SIGH
THROAT_CLEAR
CHUCKLE_OR_LAUGH
AUDIBLE_BREATH
OTHER_NONLEXICAL_VOCALIZATION
```

이 사건 자체는 자동 감점 대상이 아니다.

반복되며 답변 흐름을 방해하는 경우에만 전달 분석의 맥락으로 사용한다.

카메라 기반 시선, 손동작, 자세, 몸 떨림, 표정은 현재 공식 입력에 시각 데이터가 없으므로 평가하지 않는다.

---

# 29C. 비유창성 분석 자료 우선순위

가능한 경우 다음 순서로 사용한다.

```text
1. 분석 가능한 실제 audio + 원시 event
2. events.json의 pause / filler 위치
3. raw answer_transcript의 repetition / restart / self-correction 위치
4. speech_metrics의 aggregate count
5. summary 파생 통계
```

`edited_transcript`는 내용 확인에 참고할 수 있으나 실제 발화 유창성의 주된 근거로 사용하지 않는다.

동일한 현상이 transcript, event, metric에 동시에 나타났다고 해서 여러 번 발생한 것으로 중복 계산하지 않는다.

---

# 29D. 한국어 filler 판정 Guard

다음 표현은 filler 후보가 될 수 있다.

```text
음
어
아
저
그
저기
뭐랄까
그러니까
약간
이제
사실
```

그러나 다음 원칙을 적용한다.

- 단순 문자열 출현만으로 filler로 확정하지 않는다.
- 문장 의미를 실제로 구성하는 `그러니까`, `약간`, `이제`, `사실`은 filler가 아닐 수 있다.
- 인용된 표현 안의 filler는 지원자의 발화 습관으로 자동 합산하지 않는다.
- STT가 `음`과 의미 있는 단어를 혼동할 가능성이 있으면 신뢰도를 낮춘다.
- 같은 표현이 여러 번 있어도 의미적 담화표지와 hesitation filler를 가능한 범위에서 구분한다.
- 불확실하면 “필러성 표현으로 추정”이라고 표현한다.

---

# 29E. Hesitation Cluster 판정

타임스탬프가 충분할 때 권장 operational rule:

> 약 5초 이내 또는 하나의 짧은 발화구간 안에 2개 이상의 비유창성 사건이 밀집하면 hesitation cluster 후보로 본다.

포함 가능:

```text
FILLED_PAUSE
SILENT_PAUSE >= 500ms
REPETITION
RESTART
SEARCH_EXPRESSION
TRAILING_OFF
```

다만 이 규칙은 자동 감점 공식이 아니다.

다음도 확인한다.

- 핵심 답변 진입을 실제로 늦췄는가
- 논리 구조가 끊겼는가
- 이후 즉시 회복했는가
- 어려운 D5/D6 또는 Follow-up 질문이었는가
- 질문 자체가 길거나 모호하지 않았는가

타임스탬프가 부족하면 transcript상 인접성을 바탕으로 정성적으로만 분석한다.

---

# 29F. 위치 패턴 분석

비유창성은 발생 위치에 따라 해석한다.

가능하면 질문별로 다음을 구분한다.

```text
ONSET
MIDDLE
ENDING
TRANSITION
```

## ONSET
답변 시작 직후의 filler, latency, restart.

반복되면 핵심 답변 진입 안정성을 볼 수 있다.

## MIDDLE
근거 설명 또는 복잡한 논리 전개 중 발생.

내용 난이도와 함께 본다.

## ENDING
결론을 찾는 과정에서 발생.

`END_SEARCH_PAUSE`, trailing off, 반복 결론과 함께 본다.

## TRANSITION
Root → Follow-up 전환 또는 논점 전환 직후 발생.

Follow-up 대응력 및 적응과 함께 본다.

타임스탬프가 없으면 transcript 내 상대적 위치로만 추정한다.

---

# 29G. Recovery 분석

비유창성 평가에서 회복을 반드시 별도로 본다.

좋은 회복 예:

```text
잠깐 멈춤
→ 표현 수정
→ 핵심 답변으로 즉시 복귀
```

또는:

```text
잘못된 수치 언급
→ 즉시 self-correction
→ 이후 논리 유지
```

나쁜 회복 예:

```text
filler
→ restart
→ 반복
→ 다시 filler
→ 핵심 답변 미도달
```

평가 원칙:

- self-correction 후 정확성이 높아지면 그 수정 자체를 감점하지 않는다.
- restart가 더 명확한 답변으로 이어지면 회복으로 본다.
- 반복적으로 회복하지 못할 때 FLOW 문제로 본다.
- 단일 실패보다 여러 질문에서 반복되는 패턴을 더 중요하게 본다.

---

# 29H. DISFLUENCY_CONTROL 0~4 진단축

`DISFLUENCY_CONTROL`은 공식 100점의 별도 7번째 축이 아니다.

FLOW와 질문별 전달 점수를 설명하기 위한 진단축이다.

## 4
필러·정지·반복·재시작이 거의 없거나 자연스러운 수준이다. 발생해도 의미 전달을 방해하지 않고, 자기수정 후 즉시 안정적으로 회복한다.

## 3
망설임이나 filler가 눈에 띄지만 대부분 짧고 분산되어 있으며 답변의 핵심 구조에는 거의 영향이 없다.

## 2
여러 질문에서 filler·pause·repetition·restart 또는 hesitation cluster가 반복된다. 일부 구간의 흐름을 끊지만 전체 의미는 충분히 전달된다.

## 1
비유창성 군집이 반복적으로 나타나 핵심 답변 진입 또는 논리 전개를 자주 방해한다. 회복에도 시간이 걸린다.

## 0
지속적이고 복합적인 비유창성 때문에 답변의 상당 부분이 단절되거나 의미 전달 자체가 심각하게 어렵다.

## N/A
STT/VAD/event/audio 품질 때문에 신뢰성 있는 분석이 어렵다.

---

# 29I. 빈도·밀도·영향 분리

다음 세 개를 혼동하지 않는다.

```text
frequency = 몇 번 발생했는가
density = 특정 시간 또는 구간에 얼마나 밀집했는가
impact = 실제 의미 전달을 얼마나 방해했는가
```

예:

> filler가 8회였다는 이유만으로 DISFLUENCY_CONTROL 2점을 부여하지 않는다.

가능한 해석:

> filler성 표현은 여러 차례 있었지만 대부분 문장 사이에 분산되어 있어 전달 방해가 작았다.

또는:

> 총 횟수는 많지 않았지만 Q06의 핵심 근거 설명 구간에서 filler-정지-restart가 연속되어 답변 구조가 크게 끊겼다.

---

# 29J. 질문 난이도와의 관계

같은 비유창성도 질문 조건에 따라 다르게 해석한다.

함께 고려:

```text
cognitive_difficulty
ROOT / FOLLOWUP
question length
presentation mode
preparation time
question replay
answer duration
```

특히:

- D5/D6 또는 예상 밖 Follow-up에서 일시적 hesitation 증가는 자동 문제로 보지 않는다.
- D1/D2의 짧고 직접적인 질문에서도 반복적으로 핵심 진입이 무너지면 패턴 중요도가 커질 수 있다.
- TTS_ONLY 등 인지 부담이 높은 환경에서는 동일 pause를 더 신중하게 해석한다.

---

# 29K. 이중 감점 금지

같은 비유창성 패턴으로 다음을 동시에 독립 벌점처럼 중복 적용하지 않는다.

예:

```text
DISFLUENCY_CONTROL 하향
+ FLOW 하향
+ 전달 0~4 추가 벌점
+ Critical Issue 추가 벌점
```

`DISFLUENCY_CONTROL`은 FLOW와 전달 점수를 설명하는 진단 근거다.

Critical Issue는 평균에 묻히는 패턴을 노출하기 위한 표식이며 별도 벌점이 아니다.

---

# 30. PACING

평가자료:

- characters_per_minute_total
- characters_per_minute_speech
- 질문별 변화
- 답변 길이
- presentation 환경

절대속도만으로 평가하지 않는다.

---

# 31. CONCISION

참고:

- recommended_answer_seconds
- 실제 answer_duration
- 반복
- 질문 적합성
- 내용 밀도

범위를 초과했다는 이유만으로 자동 감점하지 않는다.

---

# 32. SESSION_STABILITY

질문별 전달변화의 일관성을 본다.

한 문항 이상치를 전체 성향으로 일반화하지 않는다.

---

# 32A. 세션 전달 하위축 Calibration

각 하위축은 다음 anchor를 우선 사용한다.

## START_STABILITY

```text
4: 대부분 질문에서 자연스러운 범위 안에 발화를 시작하며 난이도 상승에도 큰 붕괴가 없음.
3: 일부 질문에서 시작 지연이나 filler가 있으나 핵심 진입에는 거의 영향 없음.
2: 여러 질문에서 시작 지연·filler·restart가 반복되어 핵심 진입이 눈에 띄게 늦음.
1: 다수 질문에서 시작 단계부터 반복적으로 발화가 무너짐.
0: 응답 시작 자체가 지속적으로 어려워 정상 답변 형성이 거의 불가능.
```

## FLOW

```text
4: 비유창성이 있어도 분산되고 즉시 회복되어 의미 흐름이 안정적.
3: 경미한 pause/filler/restart가 보이지만 구조 유지.
2: hesitation cluster가 반복되어 일부 논리 흐름 단절.
1: 흐름 단절과 회복 실패가 여러 질문에서 반복.
0: 세션 전반에서 의미 전달이 지속적으로 붕괴.
```

## PACING

```text
4: 질문 난이도와 답변 내용에 맞게 속도가 안정적이며 지나치게 빠르거나 느린 구간이 드묾.
3: 일부 속도 변동이 있으나 이해에 거의 영향 없음.
2: 빠름/느림의 반복으로 일부 핵심 문장의 이해가 어려워짐.
1: 속도 문제가 여러 질문에서 의미 전달을 자주 방해.
0: 속도 문제로 상당 부분의 답변 이해가 어려움.
```

## CONCISION

```text
4: 필요한 근거를 충분히 말하면서 반복과 우회가 적음.
3: 약간의 반복·배경 설명이 있으나 핵심 밀도는 유지.
2: 반복·우회가 여러 답변에서 나타나 핵심이 늦게 드러남.
1: 장황함 또는 지나친 단답이 반복되어 질문 요구 처리가 자주 약해짐.
0: 답변 길이 통제가 거의 되지 않아 핵심 전달이 지속적으로 실패.
```

## SESSION_STABILITY

```text
4: 초반부터 후반까지 전달 품질이 대체로 안정적.
3: 일부 흔들림이 있으나 즉시 회복하고 장기 하락 패턴이 없음.
2: 중후반 또는 특정 구간에서 반복적 하락이 관찰됨.
1: 여러 질문에 걸쳐 하락·회복 실패가 지속됨.
0: 세션 대부분에서 전달 안정성이 유지되지 않음.
```

공통 경계:

- 한 질문의 이상치를 세션 하위축 1점 이하로 일반화하지 않는다.
- 절대 말속도나 filler 수치 하나만으로 하위축 점수를 결정하지 않는다.
- 데이터 coverage가 부족하면 N/A를 사용한다.

---

# 33. 세션 전달 안정성 10점

평가 가능한 전달 하위축이 3개 이상:

```text
delivery_session = subaxis_mean / 4 × 10
```

평가 가능한 하위축이 2개 이하:

```text
N/A
```

---

# 34. N/A 재정규화 공식

세션에서 평가 가능한 축만 사용한다.

```text
raw_earned = 평가 가능한 축 획득점 합계
raw_max = 평가 가능한 축 최대점 합계
normalized_score = raw_earned / raw_max × 100
```

반올림:

```text
소수점 첫째 자리
```

보고서에는 반드시 함께 표시:

```text
원점수
평가 범위
환산 훈련점수
N/A 축
```

예:

```text
원점수: 82.0 / 90
평가 범위: 90 / 100
환산 훈련점수: 91.1 / 100
N/A: 꼬리질문 대응력
```

---

# 35. 최소 평가범위

```text
raw_max < 60
```

이면 환산점수를 공식 종합결과처럼 강조하지 않는다.

명시:

> 평가 가능 범위가 제한되어 종합 환산점수의 신뢰도가 낮습니다.

필요하면 영역별 결과를 우선한다.

---

# 36. Critical Issue

Critical Issue는 추가 벌점 시스템이 아니다.

목적:

> 평균점수에 묻힐 수 있는 중요한 문제를 별도로 노출.

대표:

```text
FACT_CONFLICT
ROLE_OR_EVIDENCE_CONFUSION
CONCEPT_ERROR
QUESTION_MISS
OVERCLAIM
FOLLOWUP_FAILURE
LOGIC_WEAKNESS
LACK_OF_SPECIFICITY
LENGTH
PAUSE_OR_FILLER
DISFLUENCY_PATTERN
RECOVERY_FAILURE
STYLE
```

같은 문제를 공식 루브릭 점수와 별도 임의 벌점으로 두 번 감점하지 않는다.

---

# 37. 학생부 일관성 상태

유지:

```text
MATCH
EXPANSION
AMBIGUOUS
POSSIBLE_CONFLICT
DIRECT_CONFLICT
```

EXPANSION은 거짓말이 아니다.

학생부 원문 없이 record_evidence만 있으면:

> 제공된 record_evidence 근거 범위에서만 평가

라고 명시.

---

# 38. 원문과 record_evidence 충돌

학생부 원문과 질문 당시 `record_evidence` snapshot이 충돌하면:

```text
SOURCE_RECORD_EXCERPT_MISMATCH
```

를 evidence별로 기록한다.

원문 우선.

여러 evidence가 연결된 질문은 각 `evidence_id`를 독립적으로 대조한다.

잘못된 evidence snapshot 때문에 지원자를 감점하지 않는다.

---

# 39. 역할 및 출처 경계

우선 확인:

```text
직접 수행
팀 수행
프로그램 출력
AI/모델 출력
시뮬레이션 결과
문헌
외부 자료
추정
가정
실제 측정
```

한 범주를 다른 범주로 표현하면 중요한 문제.

---

# 40. 질문 품질 문제

대표:

```text
QUESTION_INTENT_MISMATCH
INVALID_RECORD_PREMISE
MULTI_PART_OVERLOAD
UNSUPPORTED_ASSUMPTION
DUPLICATE_QUESTION
BROKEN_FOLLOWUP
QUESTION_TOO_AMBIGUOUS
OUT_OF_SCOPE_KNOWLEDGE_TEST
RECORD_ANCHOR_MISMATCH
```

중대한 질문 자체 오류가 있으면 관련 평가축을 N/A 또는 평가 제외할 수 있다.

지원자에게 책임을 전가하지 않는다.

---

# 41. MULTI_PART_OVERLOAD

질문이 여러 요구를 동시에 담았으면:

- 질문 품질 문제 표시
- 학생이 실제로 답한 범위를 분리
- 일부만 답했다고 자동 0점 금지

---

# 42. 질문 Intent 충돌

질문과 intent가 명백히 충돌하면:

```text
QUESTION_INTENT_MISMATCH
```

실제 question_text가 명확하면 question_text를 우선.

intent 오류를 지원자 감점 근거로 쓰지 않는다.

---

# 43. Root / Follow-up 트리 복원

가능하면:

```text
Q01 ROOT
  Q02 FOLLOWUP
    Q03 FOLLOWUP
Q04 ROOT
  Q05 FOLLOWUP
```

비교:

- fit 변화
- specificity 변화
- latency 변화
- restart 변화
- filler 변화
- concept accuracy 변화
- role boundary 변화
- 회복/붕괴 여부

단순 Follow-up 평균만 제시하지 않는다.

---

# 44. STT edited transcript

HANDOFF에 `stt.edited_transcript`가 있으면:

- `answer_transcript` = raw STT
- `edited_transcript` = 사용자 보정본

내용 평가:
- edited 참고 가능
- 사용자 수정본임을 인지

전달 평가:
- raw transcript
- events
- 실제 metrics

를 우선.

수정본 때문에 실제 발화가 더 매끄러웠던 것처럼 평가하지 않는다.

---

# 45. STT Confidence Guard

하나의 recognition_confidence 숫자에 의존하지 않는다.

확인:

```text
stt.available
stt.complete
recognition_confidence
stt.restart_count
stt.error_count
data_quality.stt
raw transcript 상태
edited transcript 존재
```

`recognition_confidence = null`은 자동 LOW가 아니다.

---

# 46. STT 품질이 낮을 때

특히 약하게 평가:

```text
filler
repetition
문장 구조
미세 전문용어 차이
self-correction
특정 표현 반복
```

STT 오류를 개념 오류로 단정하지 않는다.

---

# 47. Filler 표현 규칙

`filler_detection.estimated == true`이면 추정치로 표현.

나쁜 예:

> 필러를 정확히 12회 사용했습니다.

좋은 예:

> 전사 결과에서 필러성 표현이 12회 감지되었습니다.

또는:

> Q03과 Q07의 답변 시작부에서 필러성 표현과 짧은 재시작이 함께 반복되었습니다.

내용점수에 직접 반영하지 않는다.

단순 filler count보다 §29A~§29K의 위치·군집·영향·회복 분석을 우선한다.

---

# 48. Pause

원본 event 위치를 우선.

가능한 해석:

```text
NATURAL_PAUSE
THINKING_PAUSE
BREAKDOWN_PAUSE
END_SEARCH_PAUSE
```

START_PAUSE와 response_latency를 이중 계산하지 않는다.

pause 길이로 심리상태 단정 금지.

pause가 filler·restart·repetition과 짧은 구간에 함께 나타나면 hesitation cluster 가능성을 검토한다.

긴 pause 하나보다 짧은 pause가 반복적으로 핵심 답변을 끊는 패턴이 더 중요할 수 있다.

---

# 49. Response Latency

함께 고려:

```text
cognitive_difficulty
presentation mode
preparation time
question length
question replay
ROOT/FOLLOWUP
```

D5/D6에서 같은 latency를 D1과 동일하게 해석하지 않는다.

---

# 50. question presentation 맥락

다음은 전달 해석에 반영:

```text
ALWAYS_VISIBLE
BLIND_AFTER_DELAY
BLIND_AFTER_TTS
TTS_ONLY
```

질문이 계속 보이는 상황과 TTS_ONLY를 같은 조건으로 보지 않는다.

---

# 51. preparation time

별도 준비시간이 있으면 response latency 해석 시 준비시간 종료 이후의 반응을 중심으로 본다.

준비시간 자체를 지연으로 자동 감점하지 않는다.

---

# 52. question replay

재생이 있었다는 사실은 관찰 가능.

그러나 자동으로:

- 이해력 부족
- 지식 부족
- 긴장

으로 연결하지 않는다.

---

# 53. recording

audio reference가 있고 현재 실행환경이 실제 오디오 분석을 지원할 때만 보조자료로 사용한다.

지원 가능하면 다음을 보조적으로 확인할 수 있다.

```text
filled pause의 실제 음성 여부
pause 경계
audible breath
sigh
throat clear
chuckle / laugh
비어휘적 발성
```

이러한 음성 사건 자체를 긴장·불안·자신감 부족으로 해석하지 않는다.

반복되어 답변 흐름을 실제로 방해하는 경우에만 전달 분석의 맥락으로 사용한다.

카메라 영상이 공식 입력으로 제공되지 않는 한 시선·표정·손동작·자세 등의 시각 행동은 평가하지 않는다.

지원하지 않으면 분석한 것처럼 주장하지 않는다.

---

# 54. summary coverage 표현 제한

coverage가 불완전하면 반드시 범위를 표시한다.

나쁜 예:

> 면접 전체에서 필러가 8회였습니다.

좋은 예:

> 필러 지표가 수집된 6개 질문에서 총 8회가 감지되었습니다.

---

# 55. 평가 신뢰도

세션:

```text
HIGH
MEDIUM
LOW
```

질문별 필요 시 동일.

입력 `INVALID`이면 HIGH/MEDIUM/LOW 종합 신뢰도 등급을 붙여 정상 세션처럼 보이게 하지 않고 `INVALID`를 우선 표시한다.

## 판정 우선순위

```text
1. HANDOFF integrity 상태
2. source Pack 독립 검증 가능 여부
3. 질문-답변 매핑 안정성
4. 내용평가용 transcript / record evidence coverage
5. 전달평가용 timing / VAD / event coverage
6. 평가 가능 세션축(raw_max)
```

## HIGH

다음을 모두 만족해야 한다.

- 입력 `VALID`
- 원본 `interview-pack.json`의 hash / pack_id 검증 통과
- 질문/답변/Pack question mapping에 unresolved mismatch 없음
- 평가 대상 답변의 90% 이상에서 내용 평가에 필요한 transcript가 GOOD 또는 실질적으로 완전한 PARTIAL
- 학생부 원문이 있거나, 평가 대상 학생부 기반 질문의 record_evidence snapshot이 모두 검증 가능
- 전달을 평가하는 경우 timing/VAD/event 핵심자료의 80% 이상이 GOOD 또는 해석 가능한 PARTIAL
- 세션 공식 평가범위 `raw_max >= 80`
- Critical data-quality issue가 남아 있지 않음

## MEDIUM

`INVALID`는 아니며, 정상 평가의 핵심 매핑은 유지되지만 다음 중 하나 이상이 있다.

- 입력 `PARTIAL`
- 원본 `interview-pack.json` 누락으로 source Pack 독립 검증 불가
- 일부 transcript 또는 record_evidence 누락
- 일부 timing/VAD/event 누락으로 전달 분석 범위 제한
- 일부 Pack snapshot mismatch가 있으나 영향 질문을 분리 가능
- `60 <= raw_max < 80`

단, HIGH의 모든 조건을 충족하지 못했다고 자동 MEDIUM으로 두는 것이 아니라 LOW 조건을 먼저 확인한다.

## LOW

`INVALID`는 아니지만 다음 중 하나 이상으로 평가 해석의 안정성이 크게 제한된다.

- 질문/답변 매핑에 일부 unresolved ambiguity가 남아 있음
- 평가 대상 답변의 30% 이상에서 transcript가 LOW/UNAVAILABLE이어서 내용축 판정이 흔들림
- 학생부 원문도 없고 핵심 record_evidence도 여러 질문에서 누락
- timing/VAD/event 다수 누락으로 전달 패턴을 세션 수준에서 일반화하기 어려움
- 세션 truncation으로 핵심 Root/Follow-up 흐름이 대부분 손실
- `raw_max < 60`

`raw_max < 60`이면 기존 최소 평가범위 규칙에 따라 환산점수를 공식 종합결과처럼 강조하지 않는다.

## 질문별 신뢰도

질문별로는 세션 등급보다 높게 또는 낮게 둘 수 있다.

예:

- 세션 MEDIUM이어도 특정 질문의 transcript·evidence·timing이 모두 정상 → 해당 질문 HIGH 가능
- 세션 HIGH여도 특정 질문 STT가 손상 → 해당 질문 LOW/N/A 가능

## 경계 규칙

- 퍼센트 기준의 분모는 해당 종류의 데이터가 실제 필요한 평가 대상 질문 수다.
- PARTIAL이라는 이유만으로 지원자 점수를 낮추지 않는다.
- 신뢰도는 점수 가중치가 아니라 결과 해석의 확실성 표시다.
- 동일 입력에서 구현자가 임의로 HIGH/MEDIUM/LOW를 바꾸지 않도록 위 조건을 우선 적용한다.

---

# 56. 강한 질문 선정

단순 점수순만 사용하지 않는다.

고려:

- 질문별 총점
- 높은 cognitive difficulty에서 정확한 대응
- 역할/출처 경계
- Follow-up 개선
- 높은 priority 질문에서 안정적 답변
- 어려운 질문에서 hesitation 이후 빠르게 회복한 사례

비슷하면 다양한 질문 유형에서 선택.

---

# 57. 위험 질문 선정

우선순위:

```text
FACT_CONFLICT
ROLE_OR_EVIDENCE_CONFUSION
CONCEPT_ERROR
QUESTION_MISS
OVERCLAIM
FOLLOWUP_FAILURE
LOGIC_WEAKNESS
LACK_OF_SPECIFICITY
LENGTH
PAUSE_OR_FILLER
DISFLUENCY_PATTERN
RECOVERY_FAILURE
STYLE
```

질문 자체 오류로 발생한 실패는 지원자 위험으로 과도하게 선정하지 않는다.

---

# 58. recheck_targets issue_type enum

공식 출력 규격:

```text
INTERVIEW_RECHECK/1.0
```

V1 우선값:

```text
FACT_CONFLICT
ROLE_BOUNDARY
EVIDENCE_BOUNDARY
CONCEPT_ERROR
QUESTION_FIT
OVERCLAIM
FOLLOWUP_RESPONSE
LOGIC
SPECIFICITY
CONCISION
DELIVERY
```

priority:

```text
CRITICAL
HIGH
MEDIUM
LOW
```

과거 판정을 다음 세션의 사실로 확정하지 않는다.

`evidence_id`와 `question_id`는 반드시 source Pack scope 안에서만 해석한다.

---

# 59. recheck_targets 구조

정확한 연계 계약은 본 문서 부록 A의 통합 `INTERVIEW_RECHECK/1.0` 출력 규격을 따른다.

권장 예:

```json
{
  "schema": "INTERVIEW_RECHECK/1.0",
  "source_session_id": "string",
  "source_pack": {
    "schema": "INTERVIEW_PACK/1.0",
    "pack_id": "PACK_8F3A91C2",
    "sha256": "64자리 lowercase hex"
  },
  "targets": [
    {
      "target_id": "R001",
      "evidence_refs": [
        {
          "evidence_id": "E004",
          "anchor": "3학년 진로활동",
          "excerpt": "string",
          "normalized_summary": "string"
        }
      ],
      "question_ids": ["Q005", "Q007"],
      "issue_type": "EVIDENCE_BOUNDARY",
      "issue": "모델 출력과 실제 측정 결과의 경계가 불명확함",
      "priority": "CRITICAL",
      "recommended_next_intent": "같은 내용을 다른 표현으로 다시 검증"
    }
  ]
}
```

규칙:

- `target_id`는 recheck 문서 안에서 고유
- `source_pack`은 ID scope를 고정하기 위해 필수
- `evidence_refs`는 다음 질문엔진이 다른 Pack에서도 근거를 재매핑할 수 있도록 snapshot을 포함
- source Pack이 달라지면 같은 `E004` 문자열만으로 동일 근거라고 판단하지 않음
- 이전 평가의 `issue`는 질문 생성 우선순위 신호이며 학생 사실이 아님

---

# 60. 출력 숫자 반올림

점수:

```text
소수점 첫째 자리
```

시간:

- 원자료 ms 보존
- 보고서에서 필요 시 초 단위 소수점 첫째 또는 둘째

비율:

- 필요 시 퍼센트 소수점 첫째

원자료 왜곡 금지.

---

# 61. 평가 불가능한 경우

입력 INVALID 또는 평가 가능한 핵심축이 부족하면 종합점수를 강제로 만들지 않는다.

대신:

- 손상 데이터
- 평가 가능 영역
- N/A 영역
- 재측정 필요 여부

를 제공.

파일 손상을 지원자 문제로 해석하지 않는다.

---

# 62. STANDARD 최종 보고서에 평가범위 추가

반드시 표시:

```text
평가 가능 질문 수
전체 질문 수
평가 가능 세션축
N/A 세션축
summary coverage 주요 항목
평가 신뢰도
```

---

# 63. 종합점수 표현 예

```text
面逆力 훈련용 평가척도

원점수:
82.0 / 90

평가 범위:
90 / 100

환산 훈련점수:
91.1 / 100

N/A:
꼬리질문 대응력
```

명시:

> 이 숫자는 대학 공식 평가점수나 합격확률이 아닙니다.

---

# 64. 4개 상위 DOMAIN

설명용으로 유지:

```text
DOMAIN 1 답변 내용 적합성
DOMAIN 2 근거·사고·학생부 일관성
DOMAIN 3 꼬리질문 대응력
DOMAIN 4 전달 안정성
```

공식 100점 산식은 6개 축만 사용한다.

---

# 65. 질문별 출력

권장:

```text
Q004

질문:
...

질문 유형:
...

cognitive difficulty:
D4

priority:
4

제시 환경:
BLIND_AFTER_TTS

질문 의도:
...

답변 핵심:
...

질문 적합성:
3 / 4

구체성 및 근거:
2 / 4

논리 및 개념:
3 / 4

학생부 일관성 및 역할경계:
4 / 4

전달:
3 / 4

질문별 원점수:
15 / 20

내용 평가:
...

전달 평가:
...

발화 비유창성:
- DISFLUENCY_CONTROL: ... / 4 또는 N/A
- 주요 패턴: ...
- 집중 구간: ...
- 회복: ...

학생부 일관성:
...

역할 및 출처 경계:
...

꼬리질문 대응:
...

Critical Issue:
...

개선 방법:
...

평가 신뢰도:
HIGH
```

전체 transcript를 불필요하게 복제하지 않는다.

---

# 66. STANDARD 보고서 구조

1. 세션 정보
2. 입력 무결성 및 평가 신뢰도
   - source Pack 원본 검증 결과
   - HANDOFF integrity status와 제한사항
3. 평가 범위
4. 종합 평가
   - 원점수
   - 평가범위
   - 환산 훈련점수
   - 6개 축
   - 4개 Domain 요약
5. 가장 강했던 질문
6. 가장 위험했던 질문
7. 질문별 평가
8. Root → Follow-up 흐름
9. 학생부 일관성
10. 역할 및 출처 경계
11. 개념 및 논리 위험
12. 전달 패턴
13. 발화 비유창성 및 언어 습관
   - filled pause / silent pause
   - repetition / restart / self-correction
   - hesitation cluster
   - 질문별 집중 위치
   - recovery
   - DISFLUENCY_CONTROL
14. 질문 유형별 성과
15. 반복 문제
16. 최우선 교정 3개
17. 다음 세션 재검증
18. recheck_targets

---

# 67. QUICK / STANDARD / DEEP

## QUICK
- 핵심 총평
- 강점
- 가장 위험한 문제
- 반복되는 발화 습관이 있으면 1줄 요약
- 최우선 교정 3개

## STANDARD
기본값.

## DEEP
- 모든 질문 상세
- 질문 트리
- 학생부 대조
- event 기반 pause
- filled pause 위치
- repetition / restart / self-correction 패턴
- hesitation cluster timeline
- onset / middle / ending / transition 분포
- recovery 사례
- Root/Follow-up 변화
- 질문 유형별 성과
- 세션 안정성
- 상세 recheck_targets

---

# 68. 총점 표현 금지사항

금지:

- 대학 합격 확률
- 실제 대학 공식 점수
- 특정 대학 예상 점수
- 특정 점수 이상 = 합격권

가능:

```text
面逆力 훈련용 평가척도 78.0 / 100
```

---

# 69. 등급

S/A/B/C/D는 필수 아님.

사용하더라도 보조지표.

구체적 문제 분석이 우선.

이중 평가체계가 되면 제거.

---

# 70. 최종 Regression Checklist

평가 실행 전후 다음을 확인한다.

1. HANDOFF schema 확인
2. source Pack 정보 확인
3. source Pack hash 형식 확인
4. 질문/답변 매핑 확인
5. 질문 품질 문제 확인
6. N/A를 0으로 변환하지 않았는지
7. STT 품질 확인
8. summary coverage 확인
9. cognitive difficulty 확인
10. priority 확인
11. presentation mode 확인
12. preparation time 확인
13. question replay 확인
14. Root/Follow-up 트리 확인
15. followup_trigger를 내용오류로 오해하지 않았는지
16. runtime_signals를 정답으로 쓰지 않았는지
17. 질문별 루브릭 적용
18. 질문별 N/A 처리
19. 질문별 earned / available_max 계산
20. 세션 6축 산식 확인
21. Follow-up 최소 2개 규칙 확인
22. 전달 하위축 최소 3개 규칙 확인
23. raw_earned 계산
24. raw_max 계산
25. normalized score 계산
26. 소수점 반올림 확인
27. Critical Issue 이중감점 금지
28. 질문 오류를 지원자에게 전가하지 않았는지
29. MULTI_PART_OVERLOAD 처리 확인
30. 학생부 원문/record_evidence 충돌 확인
31. 역할·출처 경계 확인
32. STT edited transcript 처리 확인
33. coverage 불완전 통계를 전체값처럼 표현하지 않았는지
34. recording 분석 가능 여부 확인
35. 합격확률 표현 금지 확인
36. recheck target이 과거 판정을 사실로 확정하지 않는지
37. 평가 가능 질문 수 표시
38. N/A 세션축 표시
39. 평가 신뢰도 표시
40. raw 데이터와 해석을 혼동하지 않았는지
41. 복수 evidence 질문에서 모든 evidence를 대조했는지
42. recheck source_pack scope를 보존했는지
43. source Pack이 달라졌을 때 evidence_id만으로 동일 근거를 가정하지 않았는지
44. filler를 단순 문자열 출현만으로 확정하지 않았는지
45. 의미 있는 담화표지를 filler로 과잉 분류하지 않았는지
46. transcript/event/metric의 동일 현상을 중복 계산하지 않았는지
47. filler·pause의 횟수만으로 전달 점수를 기계적으로 결정하지 않았는지
48. hesitation cluster의 위치와 실제 전달 영향을 확인했는지
49. self-correction이 정확성을 높인 경우 자동 감점하지 않았는지
50. 비유창성 이후 recovery를 별도로 확인했는지
51. 질문 난이도와 ROOT/FOLLOWUP 맥락을 함께 봤는지
52. STT/VAD 품질이 낮을 때 비유창성 판정을 약하게 했는지
53. audio가 없는데 sigh/throat clear 등 음성 사건을 주장하지 않았는지
54. visual 데이터가 없는데 시선·표정·손동작·자세를 평가하지 않았는지
55. filler/pause를 긴장·불안·성격·자신감으로 단정하지 않았는지
56. DISFLUENCY_CONTROL을 공식 7번째 세션 점수축으로 추가하지 않았는지
57. DISFLUENCY_CONTROL과 FLOW를 별도 벌점처럼 이중 감점하지 않았는지
58. STANDARD 보고서에 반복되는 발화 습관이 있으면 근거 질문을 함께 제시했는지
59. 표준 ZIP의 원본 `interview-pack.json` hash를 source_pack.sha256과 재검증했는지
60. source Pack의 pack_id / generator.engine_version을 HANDOFF와 대조했는지
61. 선택 question_id와 Pack snapshot 메타데이터를 원본 Pack과 대조했는지
62. source Pack 원본 누락 시 HIGH 신뢰도를 부여하지 않았는지
63. Pack snapshot 오류를 지원자 감점으로 전환하지 않았는지
64. HANDOFF integrity status를 HANDOFF §71A severity mapping대로 재검증했는지
65. 질문별 0~4 판정에서 §17A calibration anchor를 적용했는지
66. 경계 점수에서 상위 anchor의 핵심 조건 충족 여부를 설명했는지
67. 신뢰도 HIGH/MEDIUM/LOW를 §55 operational rule과 일치하게 판정했는지
68. repetition/restart/self-correction의 위치가 raw transcript에서 확인 가능하면 cluster 분석에 활용했는지
69. Follow-up Response 판정에 §25A calibration을 적용했는지
70. 전달 5개 하위축 판정에 §32A calibration을 적용했는지

---

# 71. 최종 성공 기준

이 엔진의 목표는 “잘했다/못했다”를 말하는 것이 아니다.

반드시 다음을 구분할 수 있어야 한다.

- 질문 이해 문제
- 지식 부족
- 학생부 사실 기억 문제
- 본인 수행/팀/모델/문헌/실측 혼동
- 근거 부족
- 개념은 알지만 표현이 불안정
- Root에는 강하지만 Follow-up 약함
- 내용은 강하지만 장황함
- 전달은 유창하지만 내용 빈약
- STT 오류로 그렇게 보이는 경우
- 면접 환경 때문에 latency가 증가한 경우
- 질문 자체의 품질 문제
- 복수 evidence 중 어느 근거에서 문제가 발생했는지
- 이전 세션 recheck가 현재 사실 판정으로 오염되지 않았는지
- 단순 filler 빈도 문제와 실제 전달 붕괴를 구분할 수 있는지
- 자연스러운 사고 pause와 breakdown pause를 구분할 수 있는지
- 반복·재시작·자기수정이 어느 질문과 어느 위치에 집중되는지
- 비유창성 이후 스스로 회복하는지
- 어려운 Follow-up에서만 일시적으로 증가한 현상인지 세션 전반의 반복 패턴인지
- STT 오류 때문에 filler·repetition이 과대 검출된 경우인지
- 오디오가 없는 상황에서 음성·시각 행동을 추정하지 않았는지

최종적으로:

> 어떤 질문에서, 어떤 근거로, 어떤 종류의 문제가 발생했는지를 재현 가능한 규칙으로 설명한다.

이 문서는 실제 面逆力 개발과 테스트에 투입되는 v1.4 최종 기준 문서다.

---

# 부록 A. 통합 재검증 출력 규격 (`INTERVIEW_RECHECK/1.0`)

이 부록은 평가엔진이 다음 질문 생성 세션으로 전달할 수 있는 공식 재검증 계약을 정의한다. 별도 재검증 명세 파일을 요구하지 않으며 이 평가엔진 명세의 일부로 취급한다.

전체 흐름:

```text
INTERVIEW_EVAL_HANDOFF/1.2
→ 평가엔진 v1.4
→ INTERVIEW_RECHECK/1.0
→ 질문 생성 엔진 v1.2
→ INTERVIEW_PACK/1.0
```

핵심 철학:

> 재검증 대상은 과거 평가의 결론을 사실로 전달하는 문서가 아니다.

> 다음 질문 생성 엔진이 무엇을 다시 확인할 가치가 있는지 알 수 있게 하는 우선순위 메모다.

> `evidence_id`와 `question_id`는 source Pack scope 안에서만 의미가 있다.

> source Pack이 달라지면 ID 문자열만으로 동일 근거라고 판단하지 않는다.

---

## A-1. 최종 출력

주 출력:

```text
interview-recheck.json
```

최상위 schema:

```json
{
  "schema": "INTERVIEW_RECHECK/1.0"
}
```

실제 JSON에는 설명 문장·Markdown 코드펜스·주석을 넣지 않는다.

---

## A-2. 최상위 구조

```json
{
  "schema": "INTERVIEW_RECHECK/1.0",
  "source_session_id": "string",
  "source_pack": {},
  "created_at": "2026-09-28T08:00:00+09:00",
  "targets": [],
  "integrity": {}
}
```

최상위 필드는 위 목록으로 고정한다.

---

## A-3. source_session_id

평가 대상이 된 HANDOFF의:

```text
session.session_id
```

를 그대로 보존한다.

새 ID를 임의 생성하지 않는다.

---

## A-4. source_pack

정확한 구조:

```json
{
  "source_pack": {
    "schema": "INTERVIEW_PACK/1.0",
    "pack_id": "PACK_8F3A91C2",
    "sha256": "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
  }
}
```

`sha256`는 평가 대상 HANDOFF가 보존한 source Pack hash를 그대로 사용한다.

이 object는 아래 `evidence_id`와 `question_id`의 namespace를 고정한다.

---

## A-5. target 구조

각 target:

```json
{
  "target_id": "R001",
  "evidence_refs": [
    {
      "evidence_id": "E004",
      "anchor": "3학년 진로활동",
      "excerpt": "string",
      "normalized_summary": "string"
    }
  ],
  "question_ids": ["Q005", "Q007"],
  "issue_type": "EVIDENCE_BOUNDARY",
  "issue": "모델 출력과 실제 측정 결과의 경계가 불명확함",
  "priority": "CRITICAL",
  "recommended_next_intent": "같은 내용을 다른 표현으로 다시 검증"
}
```

---

## A-6. target_id

형식 권장:

```text
R001
R002
R003
...
```

규칙:

- 문서 안에서 고유
- 중복 금지
- 순차 부여 권장

---

## A-7. evidence_refs

배열.

각 항목:

```json
{
  "evidence_id": "E004",
  "anchor": "3학년 진로활동",
  "excerpt": "string",
  "normalized_summary": "string"
}
```

원칙:

- source HANDOFF의 `record_evidence`에서 가져옴
- 평가엔진이 학생부 내용을 새로 만들어 넣지 않음
- 여러 evidence가 하나의 이슈와 연결되면 모두 포함 가능
- evidence를 특정할 수 없는 이슈는 빈 배열 허용
- 직접 식별정보를 새로 추가하지 않음

`normalized_summary`가 source evidence에 없거나 보존되지 않았다면 `null`을 허용할 수 있다.

---

## A-8. question_ids

해당 이슈가 관찰된 source Pack question ID 배열.

규칙:

- 문자열 배열
- 중복 금지
- source HANDOFF에 실제 등장한 question_id만 사용
- 다음 Pack의 question_id로 재사용을 강제하지 않음

---

## A-9. issue_type enum

V1 허용값:

```text
FACT_CONFLICT
ROLE_BOUNDARY
EVIDENCE_BOUNDARY
CONCEPT_ERROR
QUESTION_FIT
OVERCLAIM
FOLLOWUP_RESPONSE
LOGIC
SPECIFICITY
CONCISION
DELIVERY
```

다른 문자열 생성 금지.

---

## A-10. priority enum

V1 허용값:

```text
CRITICAL
HIGH
MEDIUM
LOW
```

의미:

```text
CRITICAL 다음 세션에서 가능하면 반드시 다시 확인할 가치가 큼
HIGH     우선적으로 다시 확인
MEDIUM   coverage와 시간 여건이 맞으면 재확인
LOW      반복 노출을 피하면서 필요 시 참고
```

priority는 과거 판정의 확실성을 뜻하지 않는다.

---

## A-11. issue

짧은 자연어 문자열.

목적:

> 이전 세션에서 무엇이 불명확하거나 위험하게 관찰되었는지 설명.

금지:

- 학생이 거짓말했다고 확정
- 학생의 의도 추정
- 과거 판정을 현재 사실로 선언
- 합격 가능성 판단

좋은 예:

```text
모델 출력과 실제 측정 결과의 경계가 답변에서 명확히 구분되지 않음
```

피해야 할 예:

```text
학생은 실제 측정하지 않았는데 했다고 거짓말함
```

---

## A-12. recommended_next_intent

다음 질문 생성 엔진에 주는 재검증 방향.

예:

```text
같은 근거를 다른 표현으로 다시 검증
본인 수행과 팀 수행의 경계를 사례 중심으로 확인
핵심 개념을 짧은 정의 후 적용 사례로 재확인
```

질문 문장 자체를 강제하지 않는다.

---

## A-13. Pack scope 규칙

`evidence_id`와 `question_id`는 전역 ID가 아니다.

다음이 모두 같을 때만 ID direct match를 허용한다.

```text
source_pack.schema
source_pack.pack_id
source_pack.sha256
```

새 Pack을 생성하면 같은 학생부라도 evidence 순서가 달라질 수 있다.

따라서:

```text
이전 E004 == 새 E004
```

라고 자동 가정하지 않는다.

---

## A-14. 다른 Pack으로 재매핑

현재 질문 생성 엔진이 만드는 Pack이 source Pack과 다르면:

1. `evidence_refs.anchor` 확인
2. `excerpt` 확인
3. `normalized_summary` 확인
4. 현재 학생부의 실제 근거와 대조
5. 의미가 충분히 일치할 때만 현재 evidence로 매핑

매핑이 불확실하면:

- 해당 target을 학생 사실로 사용하지 않음
- 일반적인 재검증 방향만 참고 가능
- 질문엔진 `integrity.warnings`에 불확실성을 남김

---

## A-15. 동일 Pack 재사용

같은 원본 Pack으로 다시 세션을 돌리는 direct match는 A-13과 동일하게 다음 세 값이 모두 같을 때만 허용한다.

```text
source_pack.schema 동일
AND source_pack.pack_id 동일
AND source_pack.sha256 동일
```

세 값이 모두 같을 때만 source `evidence_id`와 `question_id`를 직접 추적할 수 있다.

hash가 같더라도 선언된 `schema` 또는 `pack_id`가 충돌하면 동일 Pack으로 판정하지 않고 source identity integrity 오류로 처리한다.

그러나 이전 질문을 반드시 다시 물어야 하는 것은 아니다.

가능:

- 같은 evidence에 다른 question_type 적용
- 같은 intent를 다른 문장으로 검증
- 이전에 묻지 않은 sibling Follow-up 사용

---

## A-16. 질문 생성 우선순위 사용

질문 생성 엔진은 recheck를 다음에 사용할 수 있다.

- CRITICAL/HIGH evidence의 coverage 확보
- 이전에 약했던 intent를 다른 질문 유형으로 재검증
- 이전에 너무 많이 물은 기록의 과노출 방지
- 동일 질문 문장 반복 방지
- Follow-up 취약점을 Root 질문으로 다시 구조화
- Root 취약점을 Follow-up으로 더 좁게 검증

recheck target 때문에 학생부에 없는 사실을 새로 만들 수 없다.

---

## A-17. 평가 결과와 분리

`INTERVIEW_RECHECK/1.0`은 점수표가 아니다.

기본적으로 포함하지 않는다.

- 세션 총점
- 질문별 점수
- 합격 가능성
- 등급
- 성격 평가
- 대학별 판단

필요한 것은 다음 세션 질문 생성에 필요한 재검증 신호뿐이다.

---

## A-18. 다중 세션

여러 recheck 문서를 동시에 입력받는 구현은 허용한다.

충돌 시:

- 최신 세션이라고 자동 진실로 간주하지 않음
- 동일 evidence의 반복 이슈 여부를 참고
- 서로 다른 issue_type을 병합 가능
- 서로 모순되면 현재 학생부 근거와 새 질문으로 다시 검증

과거 세션 수가 많다는 이유로 특정 판정을 사실로 승격하지 않는다.

---

## A-19. integrity

정확한 구조:

```json
{
  "integrity": {
    "status": "VALID",
    "warnings": [],
    "missing_evidence_snapshots": [],
    "invalid_question_refs": [],
    "duplicate_target_ids": []
  }
}
```

status enum:

```text
VALID
PARTIAL
INVALID
```

상태 우선순위:

```text
INVALID > PARTIAL > VALID
```

이 절이 `INTERVIEW_RECHECK/1.0` integrity severity의 canonical mapping이다.

### INVALID_IF

하나라도 존재하면 전체 `integrity.status = INVALID`:

- `schema != INTERVIEW_RECHECK/1.0`
- `source_session_id` 누락 또는 평가 대상 HANDOFF `session.session_id`와 불일치
- `source_pack.schema` 누락/비공식 값 또는 평가 대상 HANDOFF `source_pack.schema`와 불일치
- `source_pack.pack_id` 누락 또는 평가 대상 HANDOFF `source_pack.pack_id`와 불일치
- `source_pack.sha256` 누락/형식 오류 또는 평가 대상 HANDOFF `source_pack.sha256`와 불일치
- `target_id` 중복이 하나 이상 존재하여 target identity가 고유하지 않음; 해당 ID를 `duplicate_target_ids`에 기록
- targets 배열 자체가 구조적으로 손상되어 개별 target을 고유하게 복원할 수 없음

### PARTIAL_IF

`INVALID_IF`는 없지만 하나라도 존재하면 전체 `integrity.status = PARTIAL`:

- 일부 `question_ids`가 source HANDOFF questions에 존재하지 않음; 해당 ID를 `invalid_question_refs`에 기록
- 일부 `evidence_refs`가 source HANDOFF의 `record_evidence`에서 검증되지 않거나 필요한 snapshot이 누락됨; 해당 evidence/target 식별자를 `missing_evidence_snapshots`에 기록
- 일부 target의 issue_type/priority/reference 구조 오류가 있으나 나머지 target은 독립적으로 검증 가능
- source HANDOFF가 PARTIAL이라 일부 target provenance를 완전히 검증할 수 없지만 검증 가능한 target이 남아 있음

PARTIAL에서는 오류가 연결된 target을 다음 질문엔진의 직접 재검증 입력으로 사용하지 않는다. 검증을 통과한 target만 제한적으로 소비할 수 있다.

### WARNING_ONLY

단독으로 status를 낮추지 않음:

- `targets=[]`이지만 실제로 재검증 대상이 없었던 정상 출력
- evidence를 특정할 수 없는 issue라 `evidence_refs=[]`이고 source question reference가 유효한 경우
- 자연어 `issue` 또는 `recommended_next_intent`의 표현상 경미한 모호성이 있으나 사실/ID provenance는 손상되지 않은 경우

공통 규칙:

- `warnings`, `missing_evidence_snapshots`, `invalid_question_refs`, `duplicate_target_ids`는 실제 검증 결과와 일치해야 함
- producer가 status를 먼저 기록했더라도 consumer는 가능한 범위에서 위 mapping을 재검증함
- RECHECK integrity 오류를 지원자 점수에 추가 벌점으로 사용하지 않음

---

## A-20. Acceptance Test

최종 출력 전에 검사:

1. schema 정확
2. source_session_id 존재
3. source_pack.schema 정확
4. source_pack.pack_id 존재
5. source_pack.sha256 64자리 lowercase hex
6. target_id 고유
7. issue_type enum 유효
8. priority enum 유효
9. question_ids 중복 없음
10. question_ids가 source HANDOFF 질문에 존재
11. evidence_refs가 source HANDOFF evidence에서 유래
12. evidence_id를 전역 ID처럼 표현하지 않음
13. 과거 판정을 현재 사실로 확정하지 않음
14. 학생부에 없는 사실 추가 없음
15. 불필요한 개인정보 추가 없음
16. integrity가 A-19 canonical severity mapping과 일치
17. duplicate target ID가 있으면 `INVALID`
18. source_session_id/source_pack identity가 평가 대상 HANDOFF와 충돌하면 `INVALID`
19. invalid question ref만 일부 존재하고 나머지 target이 유효하면 `PARTIAL`
20. missing evidence snapshot만 일부 존재하고 나머지 target이 유효하면 `PARTIAL`
21. `VALID`이면 duplicate_target_ids / invalid_question_refs / missing_evidence_snapshots가 모두 비어 있음
22. 동일 Pack direct match는 `schema + pack_id + sha256` 3요소가 모두 같을 때만 허용
23. hash가 같아도 schema 또는 pack_id가 충돌하면 direct match 금지 및 integrity 오류

---

## A-21. 최종 성공 기준

`INTERVIEW_RECHECK/1.0`의 성공 기준:

> 이전 면접에서 다시 확인할 가치가 있는 이슈를 source Pack provenance와 함께 보존하여, 다음 질문 생성 엔진이 과거 판단을 사실로 오염시키지 않으면서도 더 효율적으로 재검증 질문을 만들 수 있게 하는 것.
