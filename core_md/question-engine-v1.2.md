# 학생부 기반 공통 실전면접 질문엔진 v1.2 FINAL

## 0. 문서의 역할

이 문서는 `INTERVIEW_PACK/1.0`의 사람이 읽는 공식 생성 명세다.

질문 생성 엔진의 유일한 역할은 다음과 같다.

> 학교생활기록부와 필요 시 사용자가 제공한 지원 대학·학과·면접 정보를 분석하여, 외부 웹사이트 面逆力에서 직접 실행할 수 있는 유효한 `interview-pack.json`을 생성한다.

질문 생성 엔진은 실제 면접을 진행하지 않는다.

질문 생성 엔진은 다음만 수행한다.

- 학생부 분석
- Record Map 생성
- Activity / Record Cluster 구성
- 기록 중요도와 질문 기회 분석
- 질문 근거 구조화
- 질문 후보 확장 생성
- generation-level seed 기반 Controlled Variability 적용
- 후보 품질·정보획득가치·중복 검증
- Root / Follow-up 질문 트리 구성
- Pack 전체 다양성 검증
- 면접관 후보 생성
- 질문 난이도 및 메타데이터 생성
- 사이트가 사용할 제한적 runtime trigger 생성
- 유효한 `interview-pack.json` 생성

질문 생성 엔진은 다음을 수행하지 않는다.

- 사용자 답변 직접 수신
- 실시간 의미론적 Answer State 판정
- 실시간 평가
- 면접 후 평가
- `INTERVIEW_EVAL_HANDOFF/1.2` 생성
- 사이트 Difficulty Engine 대행
- 합격 가능성 추정

전체 시스템은 다음 구조를 유지한다.

```text
학교생활기록부
→ 질문 생성 엔진
→ INTERVIEW_PACK/1.0
→ 面逆力 웹사이트
→ INTERVIEW_EVAL_HANDOFF/1.2
→ 평가 엔진
```

질문 생성 엔진은 `INTERVIEW_PACK/1.0`을 생성한 순간 역할이 종료된다.


추가 공식 연계 입력:

```text
INTERVIEW_RECHECK/1.0 (선택)
이전 INTERVIEW_PACK/1.0 (선택, Pack-to-Pack novelty 비교용)
```

`INTERVIEW_RECHECK/1.0`은 이전 평가의 재검증 대상을 전달하기 위한 것이며, 과거 평가를 현재 학생 사실로 확정하는 용도가 아니다.

이전 `INTERVIEW_PACK/1.0`은 질문 노출·Expected Answer·evidence 조합의 반복 여부를 비교하기 위한 선택 참조 입력이다. 이전 Pack의 질문을 정답 템플릿으로 복사하거나, 이전 Pack에 없던 질문을 금지하는 용도로 사용하지 않는다.

사이트 실행 단계는 본 문서 부록 A의 통합 런타임 정책 `QUESTION_ENGINE_RUNTIME/1.0`을 따른다. 질문 생성 엔진 자체는 세션 중 질문 선택을 수행하지 않으며, 面逆力 웹사이트가 이 정책을 구현한다.
---

# 1. 최종 출력

주 출력 파일:

```text
interview-pack.json
```

인코딩:

```text
UTF-8
```

최상위 스키마 식별자:

```json
{
  "schema": "INTERVIEW_PACK/1.0"
}
```

실제 JSON 파일에는 다음을 넣지 않는다.

- Markdown 코드펜스
- 설명 문장
- 주석
- 평가 결과
- 개선점
- 실행 안내
- 자연어 부연

파일 생성 기능이 있는 환경에서는 실제 `.json` 파일을 생성한다.

파일 생성 기능이 없으면 사용자가 그대로 저장할 수 있는 유효한 JSON 본문만 제공한다.

---

# 2. V1 폐쇄형 규격 원칙

`INTERVIEW_PACK/1.0`은 폐쇄형 V1 규격이다.

다음 원칙을 적용한다.

1. 본 문서에 정의되지 않은 enum 문자열을 새로 생성하지 않는다.
2. 핵심 object에 정의되지 않은 임의 필드를 생성하지 않는다.
3. 새 enum 또는 새 핵심 필드가 필요하면 스키마 버전을 올린다.
4. “허용 예”, “권장값”을 enum 확장 허가로 해석하지 않는다.
5. 구현자가 임의 문자열로 의미를 확장하지 않는다.

즉:

> V1에 정의되지 않은 enum은 V1에서 존재하지 않는다.

---

# 3. 최상위 구조

공식 구조는 다음과 같다.

```json
{
  "schema": "INTERVIEW_PACK/1.0",
  "pack_id": "PACK_8F3A91C2",
  "generator": {},
  "target": {},
  "source_record": {},
  "record_evidence": [],
  "interviewer_pool": [],
  "session_policy": {},
  "question_bank": [],
  "integrity": {}
}
```

최상위 필드는 위 목록으로 고정한다.

---

# 4. pack_id

형식:

```text
PACK_<고유문자열>
```

예:

```text
PACK_8F3A91C2
```

규칙:

- 문자열
- 비어 있으면 안 됨
- 반드시 `PACK_` 접두사
- 같은 Pack 내부에서 하나만 존재
- 충분히 낮은 충돌 가능성을 가진 고유값 생성
- Generation Variability Controller가 `pack_id`를 entropy source로 사용할 경우 Section 9 후보 sampling 전에 먼저 생성
- 암호학적 동일성 검증 수단으로 주장하지 않음

실제 파일 동일성 검증은 面逆力 사이트가 원본 파일 byte sequence에 대해 계산하는 SHA-256을 사용한다.

---

# 5. generator

정확한 구조:

```json
{
  "generator": {
    "engine_name": "학생부기반_공통_실전면접_질문엔진",
    "engine_version": "1.2",
    "created_at": "2026-09-22T12:00:00+09:00",
    "language": "ko-KR"
  }
}
```

필드:

- `engine_name`: 고정 문자열
- `engine_version`: `"1.2"`
- `created_at`: ISO-8601
- `language`: `"ko-KR"`

---

# 6. target

정확한 구조:

```json
{
  "target": {
    "university": null,
    "department": null,
    "interview_type": "student_record_based",
    "default_session_minutes": 10
  }
}
```

규칙:

- 사용자 제공 정보만 사용
- 대학 미제공 → `null`
- 학과 미제공 → `null`
- 추측 금지
- `interview_type`은 V1에서 `"student_record_based"` 고정
- `default_session_minutes`는 1 이상의 정수

---

# 7. source_record

정확한 구조:

```json
{
  "source_record": {
    "available": true,
    "embedded_full_text": false,
    "student_name_included": false
  }
}
```

원칙:

- 학생부 전체를 JSON에 복제하지 않는다.
- 불필요한 개인정보를 출력하지 않는다.
- 이름, 주소, 연락처, 주민등록번호 등은 기본 제외.
- `embedded_full_text`는 V1 기본값 `false`.

---

# 8. Record Map

질문 생성 전 내부적으로 학생부를 다음 원자로 분해한다.

```text
TOPIC
PROBLEM
MOTIVATION
CONCEPT
METHOD
TOOL
VARIABLE
DATA_SOURCE
NUMBER
DIRECT_ACTION
DECISION
RESULT
INTERPRETATION
LIMITATION
REVISION
FAILURE
ROLE
COLLABORATION
COMMUNICATION
READING
GROWTH
CAREER
TEACHER_OBSERVATION
FOLLOWUP_EXTENSION
UNKNOWN
```

증거 성격은 가능한 경우 다음으로 구분한다.

```text
DIRECT_OBSERVATION
DIRECT_ACTION
DIRECT_CALCULATION
TEAM_ACTION
PROGRAM_OUTPUT
MODEL_OUTPUT
LITERATURE
EXTERNAL_DATA
ASSUMPTION
INTERPRETATION
TEACHER_OBSERVATION
UNKNOWN
```

학생부에 없는 내용을 Record Map에 생성하지 않는다.

---

# 9. 질문 생성 파이프라인 및 질문 가치 평가

질문 생성은 Record Map에서 곧바로 최종 질문을 만드는 방식으로 수행하지 않는다.

반드시 다음 내부 파이프라인을 거친다.

```text
학생부 원문
→ Record Map
→ Activity / Record Cluster
→ 기록 중요도 분류
→ Question Opportunity 탐색
→ Intent Family 설계
→ 후보 질문 확장 생성
→ Hard Quality Gate
→ Soft Quality Ranking
→ Expected Answer 중복 제거
→ Root / Follow-up 트리 구성
→ Pack Diversity Gate
→ 최종 question_bank 직렬화
```

이 파이프라인의 내부 분류값과 점수는 `INTERVIEW_PACK/1.0`에 새 필드로 출력하지 않는다.

## 9.1 Activity / Record Cluster

같은 활동·프로젝트·탐구가 학생부 여러 영역에 반복 기록될 수 있으므로 질문 생성 전에 관련 evidence를 내부적으로 묶어 해석한다.

같은 Cluster로 묶을 수 있는 단서:

- 동일하거나 사실상 같은 프로젝트·탐구명
- 같은 산출물·실험·프로그램·발표를 설명
- 같은 기간 또는 연속된 활동 맥락
- 동일한 방법·데이터·결과를 서로 다른 영역에서 보충 설명
- 한 기록이 다른 기록의 역할·과정·결과를 명확히 확장

금지:

- 주제가 비슷하다는 이유만으로 서로 다른 활동을 하나로 합치기
- 시간적 연속성만으로 인과관계를 생성하기
- Cluster를 만들기 위해 학생부에 없는 공통 목적을 추론하기

Cluster는 내부 생성 단위일 뿐 `record_evidence`를 합쳐 없애지 않는다. 원본 evidence_id와 anchor는 각각 유지한다.

## 9.2 기록 중요도 분류

각 Cluster 또는 독립 기록을 내부적으로 다음 중 하나로 분류한다.

```text
CORE
SUPPORTING
PERIPHERAL
```

이 값도 Pack에 직렬화하지 않는다.

판정 시 함께 본다.

- 학생의 직접 행동과 의사결정이 있는가
- 방법 선택이나 비교가 있는가
- 결과·근거·수치·해석이 있는가
- 역할·출처 경계를 검증할 여지가 있는가
- 한계·실패·수정 과정이 있는가
- 교사 관찰이 구체적인가
- 여러 기록에서 반복·발전되는가
- 지원 전공·학업 맥락과 연결될 가치가 있는가
- Cross-record 또는 Growth 질문으로 확장 가능한가

`CORE`가 반드시 전공 관련 활동을 뜻하지 않는다. 비전공 활동도 직접 행동·판단·성장·공동체 가치가 높으면 CORE가 될 수 있다.

반대로 전공 관련이라는 이유만으로 자동 CORE로 분류하지 않는다.

일반적 사용:

- CORE: 여러 Intent Family의 Root와 깊은 Follow-up 후보를 충분히 탐색
- SUPPORTING: 한두 개의 강한 Root 또는 Cross-record 연결 후보 중심
- PERIPHERAL: Surprise, Breadth, Cross-record, 가벼운 검증 후보 중심

학생부가 짧으면 이 분류를 억지로 세 단계 모두 채우지 않는다.

## 9.3 질문 가치 평가

각 기록 또는 Cluster에서 내부적으로 다음 가치를 0~3 수준으로 검토한다.

```text
0 = 질문 가치 거의 없음
1 = 보조적으로 질문 가능
2 = 유효한 질문 가치
3 = 핵심적으로 질문할 가치가 높음
```

평가 대상:

```text
VERIFY_VALUE
CONCEPT_VALUE
METHOD_VALUE
EVIDENCE_VALUE
BOUNDARY_VALUE
MAJOR_VALUE
GROWTH_VALUE
COMMUNITY_VALUE
CROSS_VALUE
SURPRISE_VALUE
```

판정 기준:

- `VERIFY_VALUE`: 실제 수행·역할·기억을 확인할 필요가 있는 정도
- `CONCEPT_VALUE`: 활동의 핵심 개념을 이해해야 학생 수행을 설명할 수 있는 정도
- `METHOD_VALUE`: 방법 선택 이유·비교·절차 판단을 물을 가치
- `EVIDENCE_VALUE`: 결과·수치·주장을 어떤 근거로 뒷받침하는지 확인할 가치
- `BOUNDARY_VALUE`: 본인/팀/모델/프로그램/문헌/외부자료/실측의 경계를 확인할 가치
- `MAJOR_VALUE`: 지원 전공·학업 맥락과 연결하여 사고를 확인할 가치
- `GROWTH_VALUE`: 실패·수정·반복·학년 간 변화·관점 변화를 확인할 가치
- `COMMUNITY_VALUE`: 협업·소통·책임·공동체 판단을 확인할 가치
- `CROSS_VALUE`: 다른 기록과 비교·연결할 때 새로운 정보가 생기는 정도
- `SURPRISE_VALUE`: 핵심 활동 밖의 기록을 통해 Breadth를 확인할 가치

높은 값 하나만 반복적으로 질문으로 바꾸지 않는다. 한 기록에서 METHOD_VALUE가 3이어도 같은 방법 선택 이유를 표현만 바꿔 여러 번 생성하지 않는다.

## 9.4 Intent Family

최종 `question_type`을 정하기 전에 내부적으로 질문이 요구하는 사고 작용을 Intent Family로 구분한다.

권장 내부 분류:

```text
FACT_VERIFY
EXPLAIN
MOTIVATION_REASONING
CHOICE_RATIONALE
COMPARE
EVIDENCE_TRACE
ROLE_BOUNDARY
LIMIT_JUDGMENT
ALTERNATIVE_DESIGN
COUNTERFACTUAL
TRANSFER
REVISION_REASONING
GROWTH_CHANGE
CROSS_RECORD_LINK
CAREER_REASONING
COMMUNITY_REASONING
```

Intent Family는 `INTERVIEW_PACK/1.0`의 enum이 아니며 JSON에 출력하지 않는다.

하나의 질문이 여러 의미를 가질 수 있어도 생성 단계에서는 가장 중심적인 사고 요구 하나를 primary Intent Family로 잡는다.

`question_type`은 최종 전송용 분류이고, Intent Family는 생성 품질을 통제하기 위한 내부 분류다.

따라서 다음처럼 서로 다른 차원을 구분한다.

```text
무엇을 검증하는가      → Intent Family
어느 영역의 기록인가    → coverage_tags / evidence
세션에서 어떤 역할인가  → SURPRISE / CROSS_RECORD 등 question_type
어느 정도 사고가 필요한가 → cognitive_difficulty
```

## 9.5 Question Opportunity Matrix

Record Map의 원자와 Intent Family를 기계적으로 1:1 대응하지 않는다. 다만 후보 탐색 시 다음 연결을 우선 검토한다.

```text
METHOD / DECISION
→ CHOICE_RATIONALE / COMPARE / ALTERNATIVE_DESIGN / COUNTERFACTUAL

RESULT / NUMBER / DATA_SOURCE
→ EVIDENCE_TRACE / LIMIT_JUDGMENT / ROLE_BOUNDARY

DIRECT_ACTION / ROLE / TEAM_ACTION
→ FACT_VERIFY / ROLE_BOUNDARY / COMMUNITY_REASONING

CONCEPT / INTERPRETATION
→ EXPLAIN / LIMIT_JUDGMENT / TRANSFER

LIMITATION / FAILURE / REVISION
→ REVISION_REASONING / ALTERNATIVE_DESIGN / GROWTH_CHANGE

READING
→ EXPLAIN / COMPARE / TRANSFER / CAREER_REASONING

COLLABORATION / COMMUNICATION
→ COMMUNITY_REASONING / ROLE_BOUNDARY / REVISION_REASONING

학년 간 반복 또는 유사 주제
→ GROWTH_CHANGE / CROSS_RECORD_LINK / COMPARE
```

이 표는 후보 탐색용이며 모든 조합을 강제하지 않는다.


## 9.5A Generation Variability Controller

같은 학생부로 Pack을 다시 생성했을 때 질문은행 자체가 지나치게 고정되는 것을 방지하기 위해, 후보 생성 단계에서 내부 `Generation Variability Controller`를 사용한다.

이 Controller의 목적은 무작위 지식퀴즈를 만드는 것이 아니라 다음을 동시에 만족하는 것이다.

```text
같은 사실과 근거 유지
+ 핵심 검증 Coverage 유지
+ 질문 품질 하한 유지
+ 질문 기회 선택 경로 변화
+ Intent / 사고 방식 / Scope 조합 변화
```

### generation_seed

Pack 생성마다 내부적으로 `generation_seed`를 정한다.

원칙:

- `generation_seed`는 질문은행 구성에만 사용한다.
- 기존 `session_seed`와 역할을 혼합하지 않는다.
- `session_seed`는 이미 생성된 Pack 안에서 실제 면접 경로를 선택한다.
- `generation_seed`는 어떤 질문 기회와 후보가 Pack에 들어갈지를 변화시킨다.
- `generation_seed`는 `INTERVIEW_PACK/1.0`의 새 필드가 아니며 JSON에 출력하지 않는다.
- 실행환경이 명시적 seed를 지원하면 그 값을 내부적으로 사용할 수 있다.
- 별도 seed 입력이 없으면 새로 생성한 `pack_id`와 `generator.created_at`을 내부 entropy source로 사용할 수 있다.
- 동일한 source record와 동일한 내부 seed를 사용하면 가능한 범위에서 같은 선택 경로를 재현하도록 한다.
- 새 Pack을 재생성할 때는 새로운 `pack_id`를 사용하므로 새로운 generation path를 탐색할 수 있다.

LLM 자체의 생성 비결정성 때문에 byte-level 동일 결과를 보장하지 않는다. 재현성의 목표는 후보 선택 규칙과 seed 적용 경로를 추적 가능하게 유지하는 것이다.

### 두 종류의 슬롯

질문은행은 내부적으로 다음 두 성격의 슬롯을 함께 사용한다.

```text
ANCHOR SLOT
VARIABLE SLOT
```

`ANCHOR SLOT`:

- 학생부의 핵심 수행 사실
- 역할·출처 경계
- 매우 높은 EVIDENCE / METHOD / BOUNDARY 가치
- 중요한 recheck target
- 다른 질문으로 대체하면 핵심 Coverage가 손상되는 지점

은 generation_seed가 달라도 일정 비율 유지할 수 있다.

`VARIABLE SLOT`:

- 여러 강한 질문 기회가 경쟁하는 영역
- 동일 Cluster의 서로 다른 Intent Family
- 단일 기록과 Cross-record 중 모두 근거가 충분한 경우
- 서로 다른 Reasoning Lens를 적용할 수 있는 경우
- 비슷한 품질의 여러 후보가 존재하는 경우

에서 seed 기반으로 선택 경로를 바꾼다.

학생부가 충분히 풍부한 일반 사례에서는 최종 Root의 약 40~60%가 VARIABLE SLOT 성격을 가질 수 있다. 이는 강제 quota가 아니라 높은 Pack-to-Pack 변동성을 만들기 위한 권장 범위다.

학생부가 짧거나 핵심 검증점이 적으면 ANCHOR 비중을 높인다. 다양성을 위해 핵심 검증을 버리지 않는다.

### 품질 하한 우선

무작위 선택은 Hard Quality Gate 이전에 저품질 후보를 살리기 위한 수단으로 사용하지 않는다.

항상:

```text
Question Opportunity 생성
→ Hard Quality Gate 통과
→ 최소 품질 하한 충족
→ 그 안에서 seed 기반 선택
```

순서를 지킨다.

따라서 generation_seed가 달라도 다음은 선택 후보가 될 수 없다.

- Unsupported Premise
- 높은 Answer Leakage
- Low Information Gain
- 실질 중복 Expected Answer
- Out-of-scope 지식퀴즈
- 근거 없는 D5/D6
- Broken Follow-up

## 9.5B Opportunity Weighted Sampling

Generation Variability는 단순 균등 랜덤으로 구현하지 않는다.

먼저 가능한 질문 기회를 다음 내부 tuple 수준으로 확장한다.

```text
Activity / Record Cluster
× evidence scope
× Intent Family
× Reasoning Lens
× cognitive band
```

각 질문 기회에는 내부 weight를 둘 수 있다.

weight를 높이는 요인:

```text
높은 질문 가치 점수
강한 evidence
높은 Information Gain
높은 Discrimination Value
아직 적게 사용된 Cluster / Intent / Lens
이전 Pack에서 적게 노출된 질문 기회
유효한 recheck target
```

weight를 낮추는 요인:

```text
최근 Pack 또는 현재 후보 풀에서의 과노출
Expected Answer Signature 유사도
Answer Leakage 위험
Generic Question 위험
같은 Cluster / Intent 반복
근거 약함
```

원칙:

- weight는 품질 하한을 대체하지 않는다.
- 최고 weight 후보 하나를 항상 고정 선택하지 않는다.
- 품질 차이가 작은 상위 후보군에서는 seed 기반 weighted sampling을 허용한다.
- sampling은 가능한 경우 without-replacement로 수행하여 같은 질문 기회를 반복 선택하지 않는다.
- 낮은 품질 후보에게 단지 다양성을 위해 높은 확률을 부여하지 않는다.

강한 질문 후보가 여러 개라면 특정 질문 하나가 매 생성마다 독점하지 않도록 한다.

예:

```text
같은 METHOD evidence에서
CHOICE_RATIONALE
COMPARE
ALTERNATIVE_DESIGN
COUNTERFACTUAL
```

이 모두 유효하면 항상 CHOICE_RATIONALE만 생성하지 않고, value·evidence·현재 Pack Coverage를 반영한 weight로 다른 경로도 선택한다.

## 9.5C Reasoning Lens

Intent Family가 "무엇을 확인할 것인가"를 나타낸다면, Reasoning Lens는 "어떤 사고 방식으로 그것을 확인할 것인가"를 나타내는 내부 변수다.

권장 내부 Lens:

```text
DIRECT
JUSTIFY
CONTRAST
TRADEOFF
STRESS_TEST
BOUNDARY_TEST
CONDITION_CHANGE
TRANSFER_TEST
REVISION_TEST
PRIORITIZATION
```

이 값 역시 `INTERVIEW_PACK/1.0`에 출력하지 않는다.

예를 들어 `EVIDENCE_TRACE` Intent라도 다음처럼 다른 Lens를 적용할 수 있다.

```text
DIRECT
→ 그 결과를 판단할 때 실제로 사용한 근거는 무엇이었나요?

CONTRAST
→ 두 결과가 다르게 나왔다면 어느 근거를 더 신뢰했을 것 같나요?

BOUNDARY_TEST
→ 그 결과에서 직접 확인한 부분과 자료나 프로그램 출력에 의존한 부분을 구분해보세요.

STRESS_TEST
→ 그 수치가 예상과 반대로 나왔다면 먼저 어떤 근거부터 다시 확인했을까요?
```

Lens 적용 규칙:

- 학생부가 보장하지 않는 상황을 실제 사실처럼 전제하지 않는다.
- 조건 변경·반사실 질문은 가정임을 문장에 명확히 드러낸다.
- Intent Family를 바꾸는 수준이면 별도 질문 기회로 다시 평가한다.
- 모든 Intent에 모든 Lens를 억지 적용하지 않는다.
- 질문이 부자연스럽거나 정보가치가 낮아지면 기본 Lens로 되돌린다.

Generation Variability Controller는 동일 Intent에서도 가능한 Lens가 여러 개면 generation_seed에 따라 다른 Lens를 선택할 수 있다.

## 9.5D Evidence Scope Sampling

질문이 참조하는 범위도 변수성의 한 축으로 사용할 수 있다.

내부 Scope:

```text
SINGLE_EVIDENCE
WITHIN_CLUSTER
CROSS_CLUSTER
LONGITUDINAL
```

의미:

- `SINGLE_EVIDENCE`: 하나의 record_evidence만 중심으로 질문
- `WITHIN_CLUSTER`: 같은 활동을 설명하는 여러 evidence를 함께 사용
- `CROSS_CLUSTER`: 서로 다른 활동을 비교·연결
- `LONGITUDINAL`: 학년 또는 시기 변화 중심으로 연결

원칙:

- Scope는 실제 evidence 관계가 있을 때만 확장한다.
- CROSS_CLUSTER / LONGITUDINAL은 연결점을 사실처럼 강요하지 않는다.
- 동일한 두 기록을 항상 같은 방식으로 연결하지 않는다.
- 단일 기록 자체가 충분히 강하면 억지 Cross-record보다 SINGLE_EVIDENCE를 우선할 수 있다.

따라서 동일 학생부에서도 한 Pack은 단일 핵심 활동의 판단을 더 깊게 묻고, 다른 Pack은 같은 근거를 다른 활동과 비교하는 방식으로 질문 공간이 달라질 수 있다.

## 9.6 후보 질문 확장 생성

최종 질문을 한 번에 고르지 않는다. 먼저 최종 필요량보다 넓은 후보 풀을 만든 뒤 선별한다.

원칙:

- 같은 evidence에서도 가능한 경우 서로 다른 Intent Family 후보를 만든다.
- CORE Cluster는 근거가 허용하는 범위에서 최소 3개 이상의 서로 다른 Intent Family를 탐색한다.
- SUPPORTING 기록은 강한 질문 기회가 있는 Intent를 우선한다.
- PERIPHERAL 기록은 질문 수를 채우기 위해 억지 확장하지 않는다.
- 전체 후보 Root는 최종 Root 목표보다 넓게 생성하여 경쟁 선별한다.
- 동일 문장을 어순만 바꾼 것은 별도 후보로 세지 않는다.
- generation_seed에 따라 동일 Opportunity Pool에서도 Intent Family, Reasoning Lens, evidence scope의 탐색 순서와 최종 선택 조합을 바꿀 수 있다.
- 단, ANCHOR SLOT의 핵심 검증 지점은 변수성을 이유로 모두 제거하지 않는다.
- 후보 다양성은 text variant가 아니라 Expected Answer와 사고 요구의 차이로 만든다.

학생부가 충분히 풍부한 일반 사례에서는 최종 Root 목표의 약 1.5~2배 수준까지 내부 Root 후보를 탐색할 수 있다. 이는 강제 수량이 아니라 저품질 후보를 버릴 수 있도록 선택 여지를 확보하기 위한 원칙이다.

## 9.7 Hard Quality Gate

다음 후보는 최종 question_bank에 넣기 전에 제거하거나 다시 작성한다.

```text
UNSUPPORTED_PREMISE
ANSWER_LEAKAGE
LOW_INFORMATION_GAIN
GENERIC_QUESTION
DUPLICATE_EXPECTED_ANSWER
MULTI_PART_OVERLOAD
OVERLEADING
OUT_OF_SCOPE_KNOWLEDGE
BROKEN_FOLLOWUP_PROGRESSION
UNNATURAL_INTERVIEW_LANGUAGE
```

이 문자열들은 V1 JSON enum이 아니라 내부 품질 검사 명칭이다.

### UNSUPPORTED_PREMISE

학생부가 보장하지 않는 사실·인과·성공·실패·역할을 질문이 이미 사실처럼 전제하면 제거한다.

### ANSWER_LEAKAGE

학생부 문장을 읽으면 질문의 정답이 그대로 노출되는데도 단순 회상 외에 새로운 정보를 요구하지 않으면 낮은 가치로 본다.

예:

```text
학생부: Python으로 데이터를 분석함.
저가치: 어떤 프로그램을 사용했나요?
개선: Python을 선택한 이유와 다른 도구 대비 장점은 무엇이었나요?
```

단, 실제 수행 기억 확인이나 역할 검증이 목적이면 D1 `ACTIVITY_VERIFY`로 제한적으로 허용할 수 있다.

### LOW_INFORMATION_GAIN

좋은 답변을 들어도 학생부에 이미 있는 사실 외에 학생의 이해·판단·근거·역할·경계·성장을 거의 새로 알 수 없으면 우선순위를 낮추거나 제거한다.

### GENERIC_QUESTION

어떤 학생부에도 그대로 붙일 수 있는 질문은 근거와 Intent가 구체화되지 않으면 제거한다.

나쁜 예:

```text
이 활동에서 무엇을 배웠나요?
```

개선 예:

```text
처음 사용한 기준과 최종적으로 채택한 기준이 달라졌다면, 무엇 때문에 바뀌었나요?
```

### DUPLICATE_EXPECTED_ANSWER

문장이 달라도 좋은 답변에서 요구되는 핵심 내용이 사실상 같으면 중복 후보로 본다.

예:

```text
왜 이 방법을 선택했나요?
이 방법을 고른 이유는 무엇인가요?
다른 방법 대신 이것을 쓴 이유가 있나요?
```

세 질문이 같은 근거와 같은 판단을 요구한다면 하나만 남긴다.

### MULTI_PART_OVERLOAD

한 질문에서 서로 독립적인 요구를 과도하게 묶지 않는다.

### OVERLEADING

학생이 특정 결론·실패·효과를 이미 인정했다고 전제하는 질문을 피한다.

### OUT_OF_SCOPE_KNOWLEDGE

학생부 활동 검증과 무관한 랜덤 전공지식 퀴즈로 난이도를 올리지 않는다.

### BROKEN_FOLLOWUP_PROGRESSION

부모 질문과 같은 답을 다시 요구하거나, 이전 답변이 없으면 성립하지 않는 전제를 미리 넣은 Follow-up을 제거한다.

## 9.8 Soft Quality Ranking

Hard Gate를 통과한 후보는 내부적으로 다음 관점에서 비교한다.

```text
EVIDENCE_STRENGTH
INFORMATION_GAIN
DISCRIMINATION_VALUE
NATURALNESS
COGNITIVE_VALUE
FOLLOWUP_EXPANDABILITY
DISTINCTIVENESS
```

의미:

- `EVIDENCE_STRENGTH`: 학생부 근거가 질문을 충분히 지지하는가
- `INFORMATION_GAIN`: 답변을 통해 학생부 밖의 유용한 설명을 새로 얻을 수 있는가
- `DISCRIMINATION_VALUE`: 암기 여부만이 아니라 이해·판단·역할·경계를 구분할 수 있는가
- `NATURALNESS`: 실제 면접관이 구어체로 물을 법한가
- `COGNITIVE_VALUE`: 기록 수준에 맞는 의미 있는 사고를 요구하는가
- `FOLLOWUP_EXPANDABILITY`: 필요 시 다른 검증 차원으로 자연스럽게 확장 가능한가
- `DISTINCTIVENESS`: 이미 선택한 질문과 다른 정보를 요구하는가

점수는 내부 선별용이며 Pack에 출력하지 않는다. 총점만으로 자동 선택하지 않고 Coverage와 Cluster 균형도 함께 본다.

## 9.9 Expected Answer Signature 중복 검사

최종 후보마다 내부적으로 다음을 한 문장으로 정리한다.

> 이 질문에 좋은 답변을 하려면 반드시 어떤 핵심 정보를 말해야 하는가?

이를 `Expected Answer Signature`로 사용한다.

두 후보의 문장이 달라도 Signature가 거의 같고 evidence와 Intent Family도 같다면 중복으로 본다.

중복일 때 우선 남길 질문:

1. 학생부 근거가 더 강한 질문
2. Information Gain이 더 높은 질문
3. 더 자연스럽고 짧은 질문
4. Follow-up 확장성이 더 좋은 질문
5. 답을 질문문에서 덜 노출하는 질문

단순 문자열 유사도만으로 중복 여부를 판정하지 않는다.

## 9.10 Root 질문 설계 원칙

Root는 독립적으로 제시해도 완결되어야 한다.

Root가 반드시 쉬운 회상 질문일 필요는 없다. 학생부 근거가 충분하면 D3~D6 사고 질문도 Root가 될 수 있다.

좋은 Root는 다음 중 하나 이상의 역할을 한다.

- 핵심 활동의 실제 수행 확인
- 중요한 선택·판단 이유 확인
- 결과와 근거의 출처 확인
- 역할·증거 경계 확인
- 한계 또는 대안 판단
- 서로 다른 기록의 비교·연결
- 새로운 조건에 대한 전이 가능성 확인

Root 질문은 아직 나오지 않은 학생 답변을 전제하지 않는다.

## 9.11 Follow-up Progression Rule

Follow-up은 부모 질문을 단순 반복하지 않고 검증 차원을 전진시킨다.

권장 전진 예:

```text
선택 이유
→ 대안 비교
→ 한계
→ 조건 변경

결과 주장
→ 근거 출처
→ 본인 역할
→ 주장 가능한 범위

개념 설명
→ 활동 적용
→ 예외 또는 한계
→ 다른 맥락 전이

실패/한계
→ 수정 행동
→ 수정 기준
→ 이후 다른 활동에서의 변화
```

원칙:

- 같은 Expected Answer Signature를 연속 Follow-up으로 만들지 않는다.
- `CLARIFY`는 실제로 표현 명료화가 필요할 때만 같은 축을 한 번 더 물을 수 있다.
- 자식 질문은 부모보다 반드시 더 어렵게 만들 필요는 없다.
- 깊이는 난이도 상승이 아니라 다른 검증 차원으로의 이동일 수 있다.
- 부모 답변 내용을 사이트가 의미론적으로 해석해야만 성립하는 문장은 피한다.

## 9.12 Pack Diversity Gate

최종 question_bank 직렬화 전에 Pack 전체를 질문 단위가 아니라 구성 단위로 검사한다.

검사 축:

```text
ACTIVITY_CLUSTER_DIVERSITY
INTENT_FAMILY_DIVERSITY
COGNITIVE_DIVERSITY
YEAR_CATEGORY_DIVERSITY
ROOT_FOLLOWUP_STRUCTURE_DIVERSITY
```

### Activity / Cluster 다양성

다른 강한 기록이 충분히 있는데 하나의 Cluster가 Root 질문 대부분을 독점하지 않게 한다.

일반적으로 하나의 Cluster가 전체 Root의 약 35%를 넘으면 과집중 여부를 재검토한다. 학생부 자체가 한두 활동에 극단적으로 집중되어 있다면 예외 가능하다.

### Intent Family 다양성

문구만 다른 METHOD·동기·배운점 질문으로 수를 채우지 않는다.

일반적인 풍부한 학생부에서는 하나의 Intent Family가 전체 Root의 약 30%를 넘으면 과집중 여부를 재검토한다. 이는 강제 균등분배가 아니라 경고 기준이다.

### Cognitive 다양성

D1~D6를 기계적으로 균등 배분하지 않는다.

원칙:

- D1/D2: 기본 사실·이해 확인
- D3/D4: 실제 판단·근거·경계 검증의 중심
- D5/D6: 기록 근거가 충분할 때만 변형·전이 질문으로 사용

어려운 질문 수를 채우기 위해 근거 없는 D5/D6를 만들지 않는다.

### Year / Category 다양성

학생부에 유효한 근거가 여러 학년·영역에 존재하면 한 학년 또는 전공 활동만으로 Pack을 채우지 않는다.

다만 질문 가치가 낮은 영역을 quota 때문에 억지로 포함하지 않는다.

### 구조 다양성

모든 Root에 같은 수와 같은 순서의 Follow-up을 붙이지 않는다.

어떤 Root는 독립 질문으로 끝날 수 있고, 핵심 Root는 2~3단계 검증 트리를 가질 수 있다.

## 9.12A Pack-to-Pack Novelty Gate

같은 학생부로 이전 Pack이 제공되거나 Longitudinal Ledger에서 이전 질문 노출을 확인할 수 있으면, 현재 Pack은 단순 문구 변경이 아니라 질문 내용 수준의 신규성을 검사한다.

비교 단위:

```text
evidence set
+ primary Intent Family
+ Reasoning Lens
+ Expected Answer Signature
+ question_type / coverage 맥락
```

다음은 신규 질문으로 보지 않는다.

```text
이전: 왜 이 방법을 선택했나요?
현재: 이 방법을 고른 이유가 무엇인가요?
```

다음은 같은 evidence를 사용해도 실질적으로 다른 질문 기회로 볼 수 있다.

```text
이전: 이 방법을 선택한 이유는 무엇인가요?
현재: 다른 방법을 썼다면 가장 먼저 달라졌을 조건은 무엇이라고 봅니까?
```

원칙:

- Critical recheck 또는 핵심 역할·사실 검증은 이전 Pack과 반복될 수 있다.
- 반복이 필요한 ANCHOR 질문은 억지로 바꾸지 않는다.
- 그 외 VARIABLE SLOT에서는 이전 Pack의 Expected Answer Signature와 같은 질문을 우선 피한다.
- 학생부가 충분히 풍부하면 이전 Pack 대비 non-anchor Root의 약 절반 이상이 다른 Expected Answer Signature 또는 다른 Reasoning Lens / Scope를 갖도록 시도한다.
- 이는 강제 quota가 아니라 Pack-to-Pack 고착을 탐지하기 위한 경고 기준이다.
- 학생부가 짧아 신규 질문 공간이 부족하면 재사용을 허용하고 `integrity.warnings`에 이유를 남긴다.
- text_variants만 바뀐 경우 Pack-to-Pack novelty로 계산하지 않는다.

이전 Pack이 제공되지 않으면 generation_seed와 현재 Pack 내부 Diversity Gate만 사용한다.

## 9.13 Diversity와 Quality 충돌 시 우선순위

다양성을 위해 저품질 질문을 채택하지 않는다.

우선순위:

```text
1. 사실성 / 근거 안전성
2. 질문 품질 / Information Gain
3. Expected Answer 비중복
4. 학생부 핵심 Coverage
5. 다양성
6. Pack-to-Pack 신규성 / generation variability
7. 수량
```

따라서 학생부가 짧거나 특정 활동에만 내용이 집중되어 있으면 다양성 목표를 낮출 수 있다. 그 이유는 `integrity.warnings`에 기록한다.

질문 생성 기본 원칙:

- 최고 가치 하나만 반복 생성하지 않는다.
- 핵심 검증 질문을 충분히 확보한다.
- 학생부 전체 Coverage를 확보하되 저가치 quota를 강제하지 않는다.
- 비전공·오래된 기록도 질문 가치가 있으면 포함한다.
- 중복 Expected Answer 질문으로 수를 채우지 않는다.
- 실제 학생부 근거가 없는 질문을 학생부 기반 질문처럼 만들지 않는다.
- text variant를 질문은행 다양성의 대체재로 사용하지 않는다.
- generation_seed가 달라지면 품질 하한을 유지한 채 질문 기회 선택 조합이 실질적으로 달라질 수 있어야 한다.
- 질문은행 자체의 변수성과 세션 실행 변수성을 별개로 검증한다.

---

# 10. record_evidence 구조

각 항목:

```json
{
  "evidence_id": "E001",
  "anchor": "3학년 진로활동",
  "year": 3,
  "category": "career_activity",
  "topic": "분자 도킹을 활용한 후보 비교",
  "excerpt": "실제 질문 생성에 사용한 학생부 근거",
  "normalized_summary": "원문의 의미를 확장하지 않은 짧은 정리",
  "tags": ["method", "result", "ownership"]
}
```

---

# 11. evidence_id

형식:

```text
E001
E002
E003
...
```

규칙:

- 문자열
- 한 Pack에서 고유
- 순차 부여
- 중복 금지

---

# 12. record_evidence.category enum

V1 허용값은 다음뿐이다.

```text
subject_detail
career_activity
autonomous_activity
club_activity
volunteer_activity
reading
behavior
award
attendance
grade
coursework
other
```

다른 문자열 생성 금지.

---

# 13. record_evidence.tags enum

V1 허용값:

```text
topic
motivation
concept
method
tool
data
number
direct_action
decision
result
interpretation
limitation
revision
failure
role
collaboration
communication
reading
growth
career
teacher_observation
ownership
evidence_boundary
```

규칙:

- 문자열 배열
- 중복 금지
- 정의되지 않은 tag 생성 금지

---

# 14. record_evidence 원칙

- `excerpt`는 실제 학생부 근거에 기반한다.
- 학생부에 없는 사실을 excerpt에 만들지 않는다.
- `normalized_summary`는 원문의 의미를 확장하지 않는다.
- 동일 근거는 중복 저장하지 않고 evidence_id로 참조한다.
- 학생 이름 등 불필요한 개인정보를 excerpt에 남기지 않도록 최소화한다.

---

# 15. interviewer_pool

기본:

- 최소 2명
- 기본 4명 이상

ID:

```text
I01
I02
I03
...
```

한 Pack에서 고유.

---

# 16. interviewer object

정확한 구조:

```json
{
  "interviewer_id": "I01",
  "presentation_gender": "male",
  "personality_traits": ["CALM", "ANALYTICAL"],
  "values": ["EVIDENCE", "SPECIFICITY", "OWNERSHIP"],
  "response_style": "RESP_MINIMAL",
  "interest_bias": "BIAS_EVIDENCE",
  "pressure_tendency": 3,
  "voice_preference": "male"
}
```

---

# 17. presentation_gender enum

V1 허용값:

```text
male
female
```

표현용 메타데이터다.

성별을 다음과 연결하지 않는다.

- 난이도
- 압박성
- 친절함
- 지적 수준
- 질문 수준

---

# 18. personality_traits enum

V1 허용값:

```text
CALM
RESERVED
CURIOUS
ANALYTICAL
SKEPTICAL
FAST_PACED
PATIENT
MINIMAL_RESPONSE
```

규칙:

- 배열
- 최소 1개
- 최대 4개
- 중복 금지
- 정의되지 않은 값 금지

---

# 19. values enum

V1 허용값:

```text
SPECIFICITY
EVIDENCE
OWNERSHIP
CONCEPT
LIMITATION
GROWTH
CAREER
COMMUNITY
BREADTH
DEPTH
```

규칙:

- 배열
- 최소 1개
- 최대 4개
- 중복 금지
- 정의되지 않은 값 금지

---

# 20. response_style enum

V1 허용값:

```text
RESP_MINIMAL
RESP_CURIOUS
RESP_FAST
RESP_CONFIRMING
RESP_MIXED
```

---

# 21. interest_bias enum

V1 허용값:

```text
BIAS_BALANCED
BIAS_PROCESS
BIAS_CONCEPT
BIAS_EVIDENCE
BIAS_LIMIT
BIAS_CAREER
BIAS_BREADTH
BIAS_DEPTH
```

---

# 22. pressure_tendency

규칙:

- 정수
- 1 이상 5 이하
- 소수 금지

의미:
무례함이 아니라 검증·반례·명료화 요구 성향.

---

# 23. voice_preference enum

V1 허용값:

```text
male
female
system_default
```

음성 선택 힌트일 뿐 실제 지원 여부는 사이트가 판단한다.

---

# 24. session_policy

정확한 구조:

```json
{
  "session_policy": {
    "supported_interviewer_count": [1, 2],
    "default_interviewer_count": 2,
    "start_modes": [
      "START_DIRECT",
      "START_SELF",
      "START_MOTIVE",
      "START_ICE",
      "START_SURPRISE"
    ],
    "ending_modes": [
      "END_DIRECT",
      "END_LAST_WORD",
      "END_FINAL_QUESTION",
      "END_TIME_CUT",
      "END_LIGHT"
    ],
    "default_max_followup_depth": 3,
    "absolute_max_followup_depth": 4,
    "surprise_per_session_min": 0,
    "surprise_per_session_max": 1,
    "allow_cross_record": true,
    "allow_weakness_question": true,
    "allow_rare_human_events": true
  }
}
```

`allow_weakness_question`의 V1 의미:

- `true`: 질문 생성 엔진이 실제 학생부 근거가 있는 약점·불균형 검증 질문을 Pack에 포함할 수 있음
- `false`: 질문 생성 엔진은 해당 성격의 질문을 생성하지 않음
- V1에는 약점 질문을 런타임에서 다시 식별하는 전용 tag가 없으므로, 사이트가 이 값을 이용해 질문 문장을 의미론적으로 재분류하지 않음
- 따라서 이 필드는 생성 허용 정책이며 런타임 필터가 아님


---

# 25. Start Mode enum

V1 허용값:

```text
START_DIRECT
START_SELF
START_MOTIVE
START_ICE
START_SURPRISE
```

---

# 26. Ending Mode enum

V1 허용값:

```text
END_DIRECT
END_LAST_WORD
END_FINAL_QUESTION
END_TIME_CUT
END_LIGHT
```

---

# 27. session_policy 정수 규칙

- `supported_interviewer_count`: 정확히 `[1, 2]`
- `default_interviewer_count`: `1` 또는 `2`
- `default_max_followup_depth`: 0 이상 정수
- `absolute_max_followup_depth`: 0 이상 정수
- `default_max_followup_depth <= absolute_max_followup_depth`
- `surprise_per_session_min`: 0 이상 정수
- `surprise_per_session_max`: 0 이상 정수
- `surprise_per_session_min <= surprise_per_session_max`

---

# 28. 사이트 Difficulty Engine과 통합 Session Runtime Policy의 분리

Pack이 결정하지 않는 UI·표현 난이도 항목:

- 질문 화면 표시 시간
- 질문 블라인드 여부
- TTS only
- 타이머 표시
- 준비시간
- 질문 재생
- 면접관 사진 표시

이 항목은 面逆力 사이트의 Difficulty Engine이 담당한다.

Pack이 직접 실행하지 않는 세션 구성 항목:

- 현재 시점의 Root 후보 필터링
- interviewer 배정
- Root 선택
- Follow-up trigger 평가
- Follow-up 선택
- coverage 균형
- 같은 질문·같은 Intent의 과도한 반복 방지
- seed 기반 변동
- Pivot과 종료 시점

이 항목은 본 문서 부록 A의 `QUESTION_ENGINE_RUNTIME/1.0`이 담당한다.

질문 생성 엔진은 실행 가능한 재료와 제약을 제공하지만, 세션 중 실시간 선택을 직접 수행하지 않는다.

---

# 29. Controlled Human Variability

변동 가능:

- 시작 유형
- Root 순서
- 질문 표현
- 면접관 조합
- Follow-up 수
- Surprise 유무
- Cross-record 유무
- 종료 방식
- Pivot 시점

변동 금지:

- 학생부 사실
- 질문 근거
- 질문 Intent
- 학생이 하지 않은 활동
- 개념적 사실관계

핵심:

> 랜덤해야 하는 것은 학생부 사실이 아니라 탐색 경로다.

---

# 30. question_bank 공통 구조

각 질문은 다음 구조를 사용한다.

```json
{
  "question_id": "Q001",
  "relation": "ROOT",
  "root_question_id": "Q001",
  "parent_question_id": null,
  "question_type": "METHOD",
  "question_intent": "방법 선택 이유와 대안 인식 확인",
  "primary_text": "왜 이 방법을 사용했나요?",
  "text_variants": [
    "굳이 이 방법이어야 했나요?",
    "다른 방법도 가능했을 것 같은데요."
  ],
  "evidence_ids": ["E003"],
  "cognitive_difficulty": "D3",
  "priority": 4,
  "coverage_tags": ["method", "ownership"],
  "recommended_answer_seconds": {
    "min": 30,
    "max": 60
  },
  "eligible_interviewer_values": ["EVIDENCE", "DEPTH"],
  "runtime_trigger": {
    "type": "ALWAYS_ELIGIBLE"
  },
  "followup_ids": []
}
```

---

# 31. question_id

형식:

```text
Q001
Q002
Q003
...
```

규칙:

- 한 Pack에서 고유
- 순차 부여
- 중복 금지

---

# 32. relation enum

V1 허용값:

```text
ROOT
FOLLOWUP
```

---

# 33. ROOT 규칙

ROOT는 반드시:

```text
relation = ROOT
root_question_id = 자기 question_id
parent_question_id = null
```

---

# 34. FOLLOWUP 규칙

FOLLOWUP은 반드시:

```text
relation = FOLLOWUP
root_question_id = 최상위 ROOT question_id
parent_question_id = 직접 부모 question_id
```

모든 참조 대상은 question_bank에 실제 존재해야 한다.

---

# 35. question_type enum

V1에서 허용하는 값은 다음뿐이다.

```text
ACTIVITY_VERIFY
CONCEPT
METHOD
RESULT_EVIDENCE
LIMITATION
CAREER
ACADEMIC
READING
COMMUNITY
GROWTH
CROSS_RECORD
SURPRISE
SELF_INTRO
MOTIVATION
DAILY
VERIFY
CLARIFY
CONCEPT_CHECK
METHOD_CHECK
EVIDENCE_CHECK
BOUNDARY
COUNTERFACTUAL
ALTERNATIVE
TRANSFER
SELF_CORRECTION
RECOVERY
```

다른 문자열 생성 금지.

`question_type`은 질문 생성 과정의 전체 의미를 혼자 표현하는 필드가 아니다. 생성 단계에서는 Section 9의 내부 Intent Family를 먼저 정하고, 최종 전송 시 기존 question_type과 coverage_tags로 매핑한다.

`BOUNDARY`, `COUNTERFACTUAL`, `ALTERNATIVE`, `TRANSFER`는 질문 자체가 독립적으로 성립하면 ROOT와 FOLLOWUP 양쪽에서 사용할 수 있는 dual-use type이다. relation별 세부 규칙은 Section 60~61을 따른다.

---

# 36. question_intent

규칙:

- UTF-8 문자열
- 질문의 검증 목적을 짧게 설명
- 사후 평가 문장 금지
- 한 질문에 과도한 복수 Intent 금지
- primary_text와 논리적으로 일치

---

# 37. 문자열 기본 규칙

모든 사용자 표시 문자열은 UTF-8 JSON 문자열.

질문 문자열에 의도적으로 다음을 삽입하지 않는다.

- HTML 실행 코드
- JavaScript
- Markdown 실행용 문법
- 사이트 제어 문자열

사이트는 질문을 plain text로 처리한다.

---

# 38. primary_text

실제 사람이 말할 법한 짧은 구어체.

한 질문에 한 핵심.

추가 원칙:

- 학생부 문장을 그대로 빈칸 채우기처럼 묻지 않는다.
- 질문의 핵심 답을 질문문 안에서 노출하지 않는다.
- 학생이 특정 결론을 이미 인정했다고 전제하지 않는다.
- 학생부에 적힌 활동명을 anchor로 사용할 수는 있으나, 답변 내용까지 대신 말해주지 않는다.
- 질문을 어렵게 보이게 하려고 불필요한 전문용어를 추가하지 않는다.
- 질문 자체가 1회 청취로 이해 가능한 길이인지 확인한다.

예:

```text
왜 이 방법을 썼어요?
```

피해야 할 예:

```text
이 방법의 이론적 배경과 기존 방법과의 차이, 한계, 향후 가능성을 종합적으로 설명해주세요.
```

또한 학생부에 이미 답이 직접 적혀 있다면 단순 재생 질문보다 판단 이유를 우선한다.

```text
저가치: 어떤 도구를 사용했나요?
개선: 그 도구를 선택한 기준은 무엇이었나요?
```

---

# 39. text_variants

규칙:

- 문자열 배열
- 0개 이상
- 중복 금지
- primary_text와 같은 Intent 유지
- 같은 Expected Answer Signature 유지
- 같은 수준의 cognitive demand 유지
- 압박 정도를 과도하게 바꾸지 않음
- 새로운 사실 전제 또는 평가요소를 추가하지 않음
- variant를 별도의 질문 다양성으로 계산하지 않음

`text_variants`는 표현 다양성 장치이지 question_bank의 내용 다양성을 만드는 장치가 아니다.

---

# 40. evidence_ids

규칙:

- 문자열 배열
- 중복 금지
- 모든 ID는 record_evidence에 실제 존재

학생부 직접 근거가 필요 없는 질문:

- DAILY
- SELF_INTRO
- MOTIVATION

은 빈 배열 허용.

학생부 기반 질문인데 `evidence_ids`가 비어 있으면 해당 후보는 최종 Pack에 직렬화할 수 없다.

처리 순서:

```text
1. 근거 재매핑 시도
2. 실제 record_evidence가 존재하면 evidence_ids 복구
3. 복구 불가하면 질문 재작성 또는 제거
4. 최종 question_bank에는 포함 금지
```

`integrity.questions_without_record_evidence`는 생성 중 진단용 목록이다.

유효한 최종 `INTERVIEW_PACK/1.0`에서는 반드시 빈 배열이어야 한다.

```json
"questions_without_record_evidence": []
```

DAILY / SELF_INTRO / MOTIVATION만 예외적으로 빈 `evidence_ids`를 정상 허용한다.

---

# 41. cognitive_difficulty enum

V1 허용값:

```text
D1
D2
D3
D4
D5
D6
```

정의:

```text
D1 기억
D2 이해
D3 판단
D4 경계
D5 변형
D6 전이
```

판정 기준:

- `D1 기억`: 학생부에 기록된 활동·역할·용어·결과를 정확히 회상하면 답할 수 있음
- `D2 이해`: 기록된 개념·방법·결과의 의미를 자기 말로 설명해야 함
- `D3 판단`: 여러 선택지·방법·근거 중 왜 그렇게 판단했는지 이유를 제시해야 함
- `D4 경계`: 본인/팀/모델/문헌/실측, 주장/근거, 결과/해석의 경계를 구분해야 함
- `D5 변형`: 같은 기록을 조건 변경·반례·대안 상황에 맞게 수정하여 답해야 함
- `D6 전이`: 기록에서 얻은 원리나 판단을 새로운 맥락·다른 활동·새 문제에 적용해야 함

대표 질문 패턴:

```text
D1 무엇을 했나요?
D2 이 개념을 본인 말로 설명해보세요.
D3 왜 이 방법을 선택했나요?
D4 그 결과는 직접 측정한 값인가요, 모델 출력인가요?
D5 조건이 반대였다면 방법을 어떻게 바꾸겠습니까?
D6 이 경험을 전혀 다른 문제에 적용한다면 무엇을 가져가겠습니까?
```

주의:

- 난이도는 전문지식의 희귀함이 아니라 요구되는 사고 조작의 수준으로 판정한다.
- 어려운 용어를 썼다는 이유만으로 D5/D6로 올리지 않는다.
- 단순 기억 질문에 전공 지식량을 많이 요구한다고 높은 난이도로 분류하지 않는다.
- 난이도를 대학원 수준 지식 요구로 높이지 않는다.

---

# 42. priority

정수 1~5만 허용.

```text
1 낮음
2 보조
3 일반
4 중요
5 핵심 검증
```

소수 금지.

---

# 43. coverage_tags enum

V1 허용값:

```text
activity
concept
method
evidence
boundary
ownership
career
academic
reading
community
growth
surprise
cross_record
year_1
year_2
year_3
direct_action
teamwork
result
limitation
```

규칙:

- 문자열 배열
- 중복 금지
- 정의되지 않은 tag 생성 금지

---

# 44. eligible_interviewer_values

허용값은 interviewer.values와 동일하다.

```text
SPECIFICITY
EVIDENCE
OWNERSHIP
CONCEPT
LIMITATION
GROWTH
CAREER
COMMUNITY
BREADTH
DEPTH
```

규칙:

- 문자열 배열
- 중복 금지
- 빈 배열은 모든 면접관에게 사용 가능을 의미

런타임 eligibility 규칙:

- 빈 배열이면 어떤 interviewer도 배정 가능
- 비어 있지 않으면 `question.eligible_interviewer_values`와 `interviewer.values`의 교집합이 1개 이상인 interviewer만 우선 eligibility를 가짐
- eligible interviewer가 하나도 없으면 질문 자체를 폐기하지 않고 fallback 대상으로 둘 수 있으나, 사이트는 그 사실을 디버그 로그에서 추적 가능해야 함
- `interest_bias`, `pressure_tendency`, `response_style`은 eligibility 자체를 바꾸는 필드가 아니라 `QUESTION_ENGINE_RUNTIME/1.0`의 선택 가중치에 사용한다

---

# 45. recommended_answer_seconds

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

규칙:

- object 전체가 null일 수 있음
- min/max를 개별적으로 null로 두지 않음
- min: 0 이상 정수
- max: 0 이상 정수
- min <= max
- 단위는 초

DAILY 또는 짧은 아이스브레이킹 성격 질문은 null 허용.

---

# 46. runtime_trigger 공통 원칙

`runtime_trigger`는 반드시 object.

V1 허용 type은 다음뿐이다.

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

다른 type 금지.

공식 keyword trigger 명칭은 `KEYWORD_ANY` 하나뿐이다.

`KEYWORD_TRIGGER`라는 별도 이름을 사용하지 않는다.

## relation별 trigger 허용

ROOT에서 허용:

```text
ALWAYS_ELIGIBLE
RANDOM
SESSION_TIME_REMAINING
```

FOLLOWUP에서 허용:

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

## FOLLOWUP parent gate

모든 FOLLOWUP은 runtime_trigger 평가 전에 반드시 다음 구조 조건을 만족해야 한다.

```text
parent_question_id 질문이 실제 세션에서 제시됨
AND
해당 parent의 답변 처리 lifecycle이 종료됨
```

따라서 FOLLOWUP의 answer-derived trigger는 항상 직접 부모 답변을 대상으로 평가한다.

```text
KEYWORD_ANY
ANSWER_TOO_SHORT
ANSWER_TOO_LONG
NO_ANSWER
DONT_KNOW_PATTERN
```

별도의 source_question_id를 Pack에 만들지 않는다. source는 `parent_question_id`로 고정한다.

`RANDOM`과 `SESSION_TIME_REMAINING`도 FOLLOWUP에서는 parent gate를 통과한 뒤 평가한다.

ROOT에는 부모 답변이 없으므로 answer-derived trigger를 사용하지 않는다.

---

# 47. runtime_trigger — ALWAYS_ELIGIBLE

정확한 형식:

```json
{
  "type": "ALWAYS_ELIGIBLE"
}
```

추가 필드 금지.

---

# 48. runtime_trigger — RANDOM

정확한 형식:

```json
{
  "type": "RANDOM",
  "probability": 0.25
}
```

규칙:

- `probability`: 숫자
- 0 이상 1 이하
- 추가 필드 금지

---

# 49. runtime_trigger — KEYWORD_ANY

정확한 형식:

```json
{
  "type": "KEYWORD_ANY",
  "keywords": ["정확도", "효율", "향상"]
}
```

규칙:

- keywords는 문자열 배열
- 최소 1개
- 빈 문자열 금지
- 중복 금지
- 추가 필드 금지

사이트는 STT transcript에서 문자열 기반으로 확인한다.

이는 의미론적 AI 판정이 아니다.

대소문자·공백 정규화 등 매칭 세부사항은 사이트 구현 규칙을 따른다.

---

# 50. runtime_trigger — ANSWER_TOO_SHORT

정확한 형식:

```json
{
  "type": "ANSWER_TOO_SHORT",
  "threshold_ms": 15000
}
```

공식 측정값:

```text
measured_value = parent 질문의 timing.answer_duration_ms
```

판정:

```text
answer_duration_ms < threshold_ms
```

규칙:

- `threshold_ms`는 0보다 큰 정수
- 단위 ms
- `response_latency_ms`, `speech_duration_ms`, `silence_duration_ms`를 대신 사용하지 않음
- `answer_duration_ms == threshold_ms`이면 trigger 불성립
- `answer_duration_ms = null`이면 판정 불가이며 trigger는 불성립
- 측정 불가 값을 0 또는 임의의 큰 값으로 치환하지 않음
- 추가 필드 금지

---

# 51. runtime_trigger — ANSWER_TOO_LONG

정확한 형식:

```json
{
  "type": "ANSWER_TOO_LONG",
  "threshold_ms": 90000
}
```

공식 측정값:

```text
measured_value = parent 질문의 timing.answer_duration_ms
```

판정:

```text
answer_duration_ms > threshold_ms
```

규칙:

- `threshold_ms`는 0보다 큰 정수
- 단위 ms
- `response_latency_ms`, `speech_duration_ms`, `silence_duration_ms`를 대신 사용하지 않음
- `answer_duration_ms == threshold_ms`이면 trigger 불성립
- `answer_duration_ms = null`이면 판정 불가이며 trigger는 불성립
- 측정 불가 값을 0 또는 임의의 큰 값으로 치환하지 않음
- 추가 필드 금지

---

# 52. runtime_trigger — NO_ANSWER

정확한 형식:

```json
{
  "type": "NO_ANSWER"
}
```

추가 필드 금지.

---

# 53. runtime_trigger — DONT_KNOW_PATTERN

정확한 형식:

```json
{
  "type": "DONT_KNOW_PATTERN",
  "phrases": ["모르겠습니다", "잘 모르겠습니다"]
}
```

규칙:

- phrases는 문자열 배열
- 최소 1개
- 빈 문자열 금지
- 중복 금지
- 정규식 아님
- 일반 문자열 패턴
- 추가 필드 금지

---

# 54. runtime_trigger — AFTER_PARENT

정확한 형식:

```json
{
  "type": "AFTER_PARENT"
}
```

의미:

> 직접 부모 질문의 답변 처리가 종료된 뒤, 추가 answer 조건 없이 해당 FOLLOWUP을 후보로 허용한다.

규칙:

- FOLLOWUP에서만 사용
- source는 해당 질문의 `parent_question_id`
- parent gate 자체는 모든 FOLLOWUP에 공통으로 적용되며, `AFTER_PARENT`는 그 이후 별도 조건이 없는 기본 Follow-up을 뜻한다
- 추가 필드 금지

---

# 55. runtime_trigger — SESSION_TIME_REMAINING

정확한 형식:

```json
{
  "type": "SESSION_TIME_REMAINING",
  "operator": "LTE",
  "threshold_ms": 90000
}
```

operator enum:

```text
LT
LTE
GT
GTE
```

규칙:

- threshold_ms: 0 이상 정수
- 단위 ms
- 추가 필드 금지

---

# 56. runtime_trigger에서 금지되는 의미판정

다음 문자열은 runtime trigger로 절대 사용하지 않는다.

```text
RECORD_CONFLICT
ROLE_CONFUSION
EVIDENCE_CONFUSION
CONCEPT_ERROR
NUMBER_UNCLEAR
METHOD_VAGUE
OVERCLAIM
STRONG_AND_INTERESTING
```

이런 위험은 사전에 만들어 둔 검증 질문으로 다룬다.

---

# 57. followup_ids

`followup_ids`는 직접 자식 질문만 가리킨다.

질문 A의 followup_ids에 Q020이 있으면 Q020은 반드시:

```text
relation = FOLLOWUP
parent_question_id = A.question_id
```

손자 질문을 직접 넣지 않는다.

---

# 58. root_question_id 참조 규칙

ROOT:

```text
root_question_id = self
parent_question_id = null
```

FOLLOWUP:

```text
root_question_id = 최상위 ROOT
parent_question_id = 직접 부모
```

모든 참조 대상은 question_bank에 실제 존재.

---

# 59. 그래프 무결성

질문 그래프는 방향성 비순환 그래프여야 한다.

금지:

```text
A → A
A → B → A
A → B → C → A
```

자기 자신을 followup_ids에 넣는 것도 금지.

---

# 60. Root 질문 유형 매핑

다음 question_type을 Root에서 사용할 수 있다.

```text
ACTIVITY_VERIFY
CONCEPT
METHOD
RESULT_EVIDENCE
LIMITATION
CAREER
ACADEMIC
READING
COMMUNITY
GROWTH
CROSS_RECORD
SURPRISE
SELF_INTRO
MOTIVATION
DAILY
BOUNDARY
COUNTERFACTUAL
ALTERNATIVE
TRANSFER
```

특히 다음 네 type은 dual-use다.

```text
BOUNDARY
COUNTERFACTUAL
ALTERNATIVE
TRANSFER
```

ROOT로 사용할 때는 직전 답변이 없어도 독립적으로 완결되어야 한다.

예:

```text
BOUNDARY: 이 결과에서 직접 측정한 부분과 프로그램이 계산한 부분을 구분해보세요.
ALTERNATIVE: 다른 방법을 썼다면 어떤 방법을 먼저 검토했을까요?
COUNTERFACTUAL: 결과가 반대로 나왔다면 해석을 어떻게 바꿨을까요?
TRANSFER: 이 판단 기준을 다른 프로젝트에도 적용할 수 있을까요?
```

`VERIFY`, `CLARIFY`, `CONCEPT_CHECK`, `METHOD_CHECK`, `EVIDENCE_CHECK`, `SELF_CORRECTION`, `RECOVERY`는 FOLLOWUP 전용으로 유지한다.

---

# 61. Follow-up 질문 유형 매핑

다음 question_type을 FOLLOWUP에서 사용할 수 있다.

```text
VERIFY
CLARIFY
CONCEPT_CHECK
METHOD_CHECK
EVIDENCE_CHECK
BOUNDARY
COUNTERFACTUAL
ALTERNATIVE
TRANSFER
SELF_CORRECTION
RECOVERY
```

`BOUNDARY`, `COUNTERFACTUAL`, `ALTERNATIVE`, `TRANSFER`는 ROOT에도 사용할 수 있지만 FOLLOWUP에서는 직접 parent의 답변을 더 깊게 검증하는 역할로 사용한다.

FOLLOWUP 전용 type을 ROOT에 사용하지 않는다. ROOT 전용 type을 FOLLOWUP에 사용하지 않는다.

---

# 62. Surprise Controller

SURPRISE는 낮은 비율 유지.

가능한 근거:

- 오래된 기록
- 비전공 교과
- 예체능
- 독서
- 공동체
- 한 번만 등장한 주제

반드시 학생부 근거가 있어야 한다.

---

# 63. Cross-record Jump

실제 근거가 있을 때만 CROSS_RECORD 생성.

근거가 부족하면 인과를 전제하지 않는다.

금지:

```text
1학년 한계를 해결하려고 2학년 활동을 했죠?
```

허용:

```text
두 활동 사이에 본인이 느끼는 연결점이 있나요?
```

---

# 64. Weakness Question

실제 학생부 근거가 있을 때만 생성.

가능:

- 성적 변화
- 진로 변화
- 관련 교과 불균형
- 활동 깊이와 성취 불균형

근거 없는 약점 전제 금지.

---

# 65. DAILY 질문

DAILY는 소수 생성 가능.

원칙:

- 개인정보 과다 요구 금지
- 민감한 정치·종교 성향 요구 금지
- 아이스브레이킹 수준
- 함정 질문 금지
- evidence_ids = []

---

# 66. Rare Human Events

V1에서 Pack의 핵심 질문 object에 임의 event 필드를 추가하지 않는다.

사이트는 `session_policy.allow_rare_human_events`를 보고 자체 구현 가능한 UI/대사 이벤트를 사용할 수 있다.

질문 Pack은 실제 이벤트 시점을 미리 확정하지 않는다.

---

# 67. Session Seed

Pack은 질문 순서를 고정하지 않는다.

사이트가 세션별 seed를 생성하여 선택 경로를 결정한다.

같은 Pack으로 반복 면접 가능해야 한다.

---

# 68. Longitudinal Ledger / INTERVIEW_RECHECK 원칙

이전 평가 데이터가 제공되면 질문 생성 우선순위에 참고 가능하다.

공식 연계 형식:

```text
INTERVIEW_RECHECK/1.0
```

가능:

- 최근 과노출 기록의 우선순위 하향
- 아직 묻지 않은 중요 기록의 우선순위 상향
- 재검증 대상 반영
- 같은 이슈를 다른 표현·다른 질문 유형으로 재검증
- 이전 세션에서 충분히 확인되지 않은 evidence를 다시 포함

금지:

- 과거 평가를 현재 학생 사실로 확정
- 과거 오류 판정을 정답처럼 질문에 전제
- 이전 Pack의 `evidence_id`가 새 Pack에서도 같은 대상을 뜻한다고 가정
- 이전 question_id를 새 Pack question_id로 재사용해야 한다고 가정

ID scope 규칙:

- `evidence_id`와 `question_id`는 source Pack 내부 식별자다.
- ID direct match는 다음 세 값이 모두 동일할 때만 허용한다.

```text
source_pack.schema
source_pack.pack_id
source_pack.sha256
```

- hash가 같더라도 선언된 `schema` 또는 `pack_id`가 충돌하면 동일 Pack으로 판정하지 않는다. 이는 source identity 오류로 취급한다.
- Pack이 다르면 `evidence_refs`의 anchor/excerpt/normalized_summary와 현재 학생부 근거를 다시 대조하여 재매핑한다.
- 재매핑이 불확실하면 해당 target을 사실 전제로 사용하지 않고 `integrity.warnings`에 남긴다.

`INTERVIEW_RECHECK/1.0.integrity.status` 소비 규칙:

```text
VALID   → 정상 입력으로 사용 가능
PARTIAL → 검증을 통과한 target만 제한적으로 사용
INVALID → 직접 재검증 입력으로 사용 금지
```

세부 원칙:

- `INVALID` RECHECK의 target, issue, question/evidence ID를 현재 질문은행의 우선순위 신호로 사용하지 않는다.
- `PARTIAL`에서는 duplicate target ID, invalid question ref, missing evidence snapshot 등 unresolved integrity issue가 연결된 target을 직접 재검증 입력에서 제외한다.
- `PARTIAL`의 나머지 target도 과거 평가 결론을 현재 학생 사실로 승격하지 않는다.
- producer가 기록한 status를 무조건 신뢰하지 않고, 제공된 RECHECK와 source provenance를 검증할 수 있으면 평가엔진 부록 A-19 severity mapping에 따라 재확인한다.

재검증 질문은 과거 판정을 반복 진술하는 문장이 아니라 현재 학생에게 다시 확인하는 독립 질문이어야 한다.

---

# 69. Anti-Pattern Guard

금지:

```text
모든 활동에 동기-배운점-한계 반복
Endless Why
학생부 문장 빈칸채우기 질문 남발
답이 질문문에 노출된 질문 남발
문장만 다른 동일 Expected Answer 질문
같은 Intent Family 반복
모든 활동에서 직접수행 질문
잘 답하면 무조건 난이도 상승
랜덤 지식퀴즈
D5/D6 수량을 맞추기 위한 억지 변형 질문
모든 Root에 같은 Follow-up 수와 같은 진행 순서
Follow-up에서 부모 질문을 표현만 바꿔 반복
하나의 CORE 활동이 불필요하게 질문은행 독점
전공활동 과몰입
다양성 quota를 맞추기 위한 저가치 질문 삽입
text_variants를 내용 다양성으로 계산
고정 질문 순서
```

---

# 70. 질문 수와 Bank Capacity 원칙

질문 수는 먼저 정해 놓고 채우지 않는다.

목표는 다음이다.

> 한 Pack이 같은 학생부로 여러 번 면접할 때, 핵심 검증은 유지하면서도 서로 다른 Root 조합과 Follow-up 경로를 제공할 수 있을 정도의 질문은행을 확보한다.

일반 학생부의 경험적 목표:

```text
Root 약 20~30개
중요 Root당 Follow-up 약 1~3개
```

이는 강제 숫자가 아니라 다음 조건에서 흔히 나오는 결과 범위다.

질문 수 결정 시 함께 본다.

- `default_session_minutes`
- 각 질문의 `recommended_answer_seconds`
- 예상 Follow-up 비율
- CORE / SUPPORTING / PERIPHERAL 기록 수
- 서로 다른 Intent Family의 실제 질문 기회
- 반복 세션에서 필요한 Root 조합 다양성

학생부가 충분히 풍부하면 같은 Pack으로 최소 3회의 실전 세션을 구성해도 Root 조합이 실질적으로 달라질 수 있는 bank capacity를 목표로 한다.

`실질적으로 다름`은 문장 variant만 다른 경우가 아니라 실제 선택되는 question_id·evidence·Intent가 달라지는 것을 뜻한다.

학생부가 짧으면 Root 수가 감소해도 정상이다. 그 경우 `integrity.warnings`에 이유를 기록할 수 있다.

절대 금지:

- 목표 숫자를 맞추기 위해 중복 질문 추가
- 낮은 Information Gain 질문 추가
- 근거 없는 D5/D6 질문 추가
- 동일 Expected Answer 질문을 표현만 바꿔 추가

질문의 수보다 선택 가능한 좋은 질문의 밀도가 우선이다.

---

# 71. integrity 구조

정확한 구조:

```json
{
  "integrity": {
    "warnings": [],
    "insufficient_record_areas": [],
    "questions_without_record_evidence": [],
    "duplicate_intent_check_passed": true,
    "graph_validation_passed": true,
    "enum_validation_passed": true,
    "reference_validation_passed": true,
    "runtime_trigger_validation_passed": true
  }
}
```

모든 `*_passed`는 실제 검증 결과와 일치해야 한다.

`questions_without_record_evidence`는 생성 과정의 진단 흔적을 담을 수 있으나, 사용자에게 제공하는 최종 유효 Pack에서는 반드시 `[]`이어야 한다. DAILY / SELF_INTRO / MOTIVATION 이외의 질문이 이 목록에 남아 있으면 Acceptance Test 실패다.

`duplicate_intent_check_passed`는 단순 문장 중복만 뜻하지 않는다. Section 9.9의 Expected Answer Signature와 Intent Family를 함께 검토하여, 표현만 다른 실질 중복 질문이 과도하게 남아 있지 않을 때만 `true`로 둔다.

질문 품질·다양성 문제는 별도 핵심 필드를 추가하지 않고 생성 단계에서 우선 수정한다. 학생부 자체의 제한 때문에 해결할 수 없는 Coverage·Diversity 부족만 `integrity.warnings` 또는 `insufficient_record_areas`에 남긴다.

실패를 숨기지 않는다.

---

# 72. 알 수 없는 필드 금지

`INTERVIEW_PACK/1.0` 핵심 object에서 본 문서에 정의되지 않은 임의 필드를 생성하지 않는다.

향후 필드 확장이 필요하면 스키마 버전을 올린다.

---

# 73. null 규칙

정보가 없으면 추측하지 않는다.

구조상 값이 없으면:

```json
null
```

빈 배열과 null을 구분한다.

예:

```json
{
  "department": null,
  "evidence_ids": []
}
```

의미가 다르다.

---

# 74. 개인정보 최소화

Pack에 불필요한 직접 식별정보를 포함하지 않는다.

특히 기본 제외:

- 이름
- 주소
- 연락처
- 주민등록번호
- 기타 직접 식별정보

질문 생성에 필요한 학생부 근거만 최소 보존.

---

# 75. 최종 Acceptance Test

최종 `interview-pack.json` 생성 전에 다음을 전부 검사한다.

1. 유효한 JSON
2. schema가 정확히 `INTERVIEW_PACK/1.0`
3. 핵심 object에 정의되지 않은 필드 없음
4. 모든 enum이 공식 허용값
5. question_id 고유
6. evidence_id 고유
7. interviewer_id 고유
8. 모든 evidence 참조 존재
9. 모든 question 참조 존재
10. ROOT/FOLLOWUP 관계 정상
11. followup_ids와 parent_question_id 일치
12. root_question_id 규칙 정상
13. 그래프 cycle 없음
14. 자기참조 없음
15. cognitive_difficulty D1~D6
16. priority 정수 1~5
17. pressure_tendency 정수 1~5
18. runtime_trigger type 유효
19. trigger별 필수 필드 정확
20. trigger별 금지 필드 없음
21. threshold 단위 ms
22. probability 0~1
23. keywords/phrases 비어 있지 않음
24. recommended_answer_seconds 유효
25. coverage_tags 유효
26. eligible_interviewer_values 유효
27. 학생부에 없는 사실 생성 없음
28. 학생이 하지 않은 활동 전제 없음
29. Cross-record 관계 날조 없음
30. text_variants가 Intent를 바꾸지 않음
31. 동일 Expected Answer Signature 질문 과도한 중복 없음
32. Answer Leakage가 높은 저가치 질문이 핵심 Root를 차지하지 않음
33. Low Information Gain 질문을 불필요하게 포함하지 않음
34. Generic Question을 학생부 맞춤 질문처럼 사용하지 않음
35. Unsupported Premise 없음
36. Overleading 질문 없음
37. Multi-part Overload 과도하지 않음
38. Out-of-scope 랜덤 지식퀴즈 없음
39. Follow-up이 부모와 같은 답을 표현만 바꿔 반복하지 않음
40. Follow-up progression이 최소 한 검증 차원 이상 전진함
41. Root가 아직 나오지 않은 학생 답변을 전제하지 않음
42. dual-use type의 ROOT 사용이 독립적으로 완결됨
43. Activity / Record Cluster 과잉 병합 없음
44. 하나의 Cluster가 불필요하게 Root를 독점하지 않음
45. 하나의 Intent Family가 불필요하게 Root를 독점하지 않음
46. D1/D2 회상 질문만으로 질문은행을 채우지 않음
47. 근거 없는 D5/D6 변형·전이 질문 없음
48. 학년·영역 다양성을 확보할 근거가 있는데 한 영역에만 과몰입하지 않음
49. text_variants를 별도 내용 질문으로 계산하지 않음
50. 질문 수를 맞추기 위해 저가치 후보를 다시 넣지 않음
51. 불필요한 개인정보 없음
52. Surprise 과도하지 않음
53. 실제 구어체 질문
54. integrity 필드가 실제 검증결과와 일치
55. ROOT/FOLLOWUP별 runtime_trigger 허용 조합 정상
56. FOLLOWUP의 answer-derived trigger source가 직접 parent로 해석 가능
57. `allow_weakness_question=false`인데 의도적으로 약점 질문을 생성하지 않음
58. INTERVIEW_RECHECK 사용 시 source Pack scope를 보존
59. 다른 Pack의 evidence_id를 동일 ID만으로 재매핑하지 않음
60. 가능한 경우 여러 session seed 시뮬레이션에서 Root 조합이 실질적으로 변화함
61. 후보 생성 전에 내부 generation_seed 또는 동등한 entropy source가 정해짐
62. generation_seed와 session_seed의 역할이 혼합되지 않음
63. 풍부한 학생부에서는 서로 다른 generation_seed가 질문은행의 실질 질문 조합을 변화시킬 수 있음
64. generation variability가 Hard Quality Gate를 우회하지 않음
65. VARIABLE SLOT 선택이 가능한 경우 상위 품질 후보군에서 weighted sampling으로 이루어짐
66. 동일 Opportunity의 실질 중복 후보를 without-replacement 원칙에 어긋나게 반복 채택하지 않음
67. Reasoning Lens 변화가 학생부에 없는 사실을 새로 전제하지 않음
68. Evidence Scope 확장이 실제 evidence 관계를 벗어나지 않음
69. 이전 Pack이 제공된 경우 text variant 변경만을 신규성으로 계산하지 않음
70. 이전 Pack이 제공되고 질문 공간이 충분한 경우 non-anchor Root가 실질적으로 고착되지 않음
71. DAILY / SELF_INTRO / MOTIVATION 이외의 모든 최종 질문은 `evidence_ids`가 1개 이상임
72. 최종 `integrity.questions_without_record_evidence`가 빈 배열임

치명적 오류가 하나라도 있으면 사용자에게 파일을 제공하기 전에 내부 수정 후 다시 검증한다. 특히 71~72 실패는 warning으로 제공하지 않고 질문 재작성·제거 후 재검증한다.

---

# 76. 최종 출력 규칙

최종 산출물은 반드시 유효한:

```text
interview-pack.json
```

실제 JSON 내부에는 설명·Markdown·주석을 넣지 않는다.

파일 생성 기능이 있으면 실제 파일로 제공한다.

질문 엔진은 파일 생성 이후 면접을 시작하지 않는다.

---

# 77. 최종 성공 기준

성공 기준은 ChatGPT 안에서 면접을 진행하는 것이 아니다.

성공 기준:

> 학생부 하나를 분석한 뒤, 단순히 형식상 유효한 질문을 많이 만드는 것이 아니라, 학생부에서 실제 검증 가치가 높은 지점을 찾아 서로 다른 사고를 요구하는 후보를 충분히 생성·선별하고, 저가치·정답노출·중복 질문을 제거한 Root / Follow-up 질문은행을 만든다. 같은 학생부로 Pack을 다시 생성할 때도 generation_seed 기반 Controlled Variability를 통해 사실·핵심 Coverage·품질 하한은 유지하면서 질문 기회·Intent·Reasoning Lens·evidence scope의 조합이 실질적으로 달라질 수 있어야 한다. 또한 面逆力 사이트는 `QUESTION_ENGINE_RUNTIME/1.0`에 따라 같은 Pack 안에서도 session_seed를 이용해 여러 번 서로 다른 실전 면접을 구성할 수 있어야 한다.

본 문서는 이후 작성될 `INTERVIEW_PACK/1.0` JSON Schema의 사람이 읽는 공식 명세 역할을 한다.

---

## 생성 변수성과 세션 변수성의 분리

본 문서는 두 종류의 변수성을 명확히 구분한다.

```text
generation_seed
→ 같은 학생부에서 어떤 질문은행을 구성할지 변화

session_seed
→ 같은 질문은행에서 실제 어떤 면접 경로를 사용할지 변화
```

두 seed는 서로 대체하지 않는다. 높은 변수성은 두 층이 모두 작동할 때 확보된다.

---

# 부록 A. 통합 세션 런타임 정책 (`QUESTION_ENGINE_RUNTIME/1.0`)

이 부록은 `INTERVIEW_PACK/1.0`을 실제 면접 세션으로 실행할 때 面逆力 웹사이트가 따라야 하는 질문 선택·분기 정책이다. 별도 정책 파일을 요구하지 않으며 이 질문엔진 명세의 일부로 취급한다.

전체 흐름:

```text
INTERVIEW_PACK/1.0
→ QUESTION_ENGINE_RUNTIME/1.0
→ 실제 질문 순서·면접관·표현 선택
→ INTERVIEW_EVAL_HANDOFF/1.2
```

핵심 철학:

> Pack은 가능한 질문 공간을 제공한다.

> 통합 Runtime Policy는 그중 실제 탐색 경로를 결정한다.

> 사이트는 의미론적 평가를 하지 않는다.

> 다양성은 사실 변경이 아니라 선택 경로 변경으로 만든다.

> 같은 Pack + 같은 runtime policy version + 같은 session seed는 가능한 범위에서 재현 가능해야 한다.

---

## A-1. 공식 입력

필수:

```text
INTERVIEW_PACK/1.0
session_seed
사용자 선택 environment
```

선택:

```text
세션 시간 설정
interviewer_count
difficulty preset
```

질문 답변 중 의미론적 AI 판정은 입력으로 사용하지 않는다.

---

## A-2. 책임

Runtime Policy가 담당:

- interviewer 조합
- start mode 실행
- Root eligibility
- Root 선택
- Follow-up parent gate
- runtime trigger 평가
- Follow-up 선택
- question variant 선택
- Pivot
- ending mode 실행
- Surprise / Cross-record 제한
- 질문 중복 방지
- 세션 coverage 균형

담당하지 않음:

- 학생부 사실 생성
- 질문 Intent 수정
- 질문 내용 평가
- 개념 오류 판정
- 학생 진정성 판정
- 최종 면접 평가

---

## A-3. 재현성

사이트는 세션 시작 시 `session_seed`를 생성한다.

같은:

```text
source Pack 원본 byte hash
runtime_policy_version
session_seed
사용자 environment
```

가 주어지면 랜덤 선택은 가능한 범위에서 동일 결과를 재현해야 한다.

브라우저·TTS·STT의 외부 비결정성까지 완전 재현을 보장하지 않는다.

---

## A-4. 질문 중복 금지

같은 세션에서 동일 `question_id`를 두 번 제시하지 않는다.

text variant가 달라도 같은 question_id면 재사용 금지.

예외 없음.

---

## A-5. interviewer 선택

Pack의 `interviewer_pool`에서 `session_policy.default_interviewer_count`를 기본 사용한다.

사용자가 허용 범위 내에서 1명 또는 2명을 선택할 수 있다.

선택 시 권장:

- 완전히 동일한 values 조합만 반복하지 않음
- 2명일 경우 interest_bias가 서로 다른 조합 우선
- presentation_gender는 난이도·압박·지적 수준에 영향을 주지 않음
- voice 지원 여부는 별도 사이트 기능

seed를 이용해 가능한 조합 중 하나를 결정한다.

---

## A-6. interviewer 질문 eligibility

질문 `eligible_interviewer_values = []`이면 모든 interviewer에게 배정 가능.

비어 있지 않으면:

```text
intersection(
  question.eligible_interviewer_values,
  interviewer.values
) >= 1
```

인 interviewer를 우선 eligible로 본다.

eligible interviewer가 0명이면:

- 질문을 자동 폐기하지 않음
- fallback으로 선택 가능
- fallback 배정은 낮은 우선순위
- 사이트 디버그 trace에서 확인 가능해야 함

---

## A-7. interviewer affinity

hard eligibility를 통과한 후보 사이의 순위 조정에 사용한다.

values match:

```text
일치 value 1개당 +4
최대 +12
```

interest_bias 권장 매핑:

```text
BIAS_PROCESS  → method, direct_action, activity
BIAS_CONCEPT  → concept
BIAS_EVIDENCE → evidence, ownership, result
BIAS_LIMIT    → boundary, limitation
BIAS_CAREER   → career
BIAS_BREADTH  → cross_record, reading, community, growth
BIAS_DEPTH    → concept, method, evidence, boundary
BIAS_BALANCED → 별도 가중 없음
```

매핑 tag가 없으면 추가 가중 없음.

---

## A-8. pressure_tendency

`pressure_tendency`는 무례함이 아니라 검증 강도 성향이다.

Follow-up 후보에서 다음 유형에 보조 가중치를 줄 수 있다.

```text
VERIFY
EVIDENCE_CHECK
BOUNDARY
COUNTERFACTUAL
SELF_CORRECTION
```

권장 추가점:

```text
1 → +0
2 → +1
3 → +3
4 → +5
5 → +7
```

질문의 사실관계나 표현을 새로 생성하지 않는다.

---

## A-9. response_style의 V1 제한

V1 Pack의 `text_variants`에는 tone label이 없다.

따라서 통합 Runtime Policy v1.0은:

- `response_style`을 이용해 question variant의 의미를 추론하여 분류하지 않음
- response_style은 사이트의 짧은 연결 대사, 반응 길이, turn tempo에만 사용할 수 있음
- 질문 문장은 Pack의 `primary_text` 또는 `text_variants` 중 하나만 사용

향후 variant style metadata가 추가되면 Pack schema version을 올린다.

---

## A-10. Start Mode

`START_DIRECT`

- 일반 ROOT 후보에서 시작

`START_SELF`

- `SELF_INTRO` ROOT가 있으면 우선
- 없으면 START_DIRECT fallback

`START_MOTIVE`

- `MOTIVATION` ROOT가 있으면 우선
- 없으면 START_DIRECT fallback

`START_ICE`

- `DAILY` ROOT가 있으면 우선
- 없으면 START_DIRECT fallback

`START_SURPRISE`

- `SURPRISE` ROOT가 있고 session surprise limit이 허용하면 우선
- 없으면 START_DIRECT fallback

start mode는 seed로 허용 목록에서 선택할 수 있다.

---

## A-11. Root trigger 허용

ROOT에서 정상 허용:

```text
ALWAYS_ELIGIBLE
RANDOM
SESSION_TIME_REMAINING
```

다음 answer-derived trigger가 ROOT에 있으면 Pack validation 오류로 취급:

```text
KEYWORD_ANY
ANSWER_TOO_SHORT
ANSWER_TOO_LONG
NO_ANSWER
DONT_KNOW_PATTERN
AFTER_PARENT
```

---

## A-12. Root hard eligibility

Root 후보는 모두 만족해야 한다.

1. `relation = ROOT`
2. 아직 제시되지 않음
3. runtime trigger 만족
4. Surprise 제한 만족
5. Cross-record 허용 정책 만족
6. 현재 남은 시간으로 질문 제시가 현실적으로 가능
7. 특정 start mode 강제 단계라면 해당 type 조건 만족

hard filter 이후 후보 순위를 계산한다.

---

## A-13. Root baseline score

권장 기준점:

```text
priority 1 → 10
priority 2 → 20
priority 3 → 30
priority 4 → 40
priority 5 → 50
```

이 점수는 평가 점수가 아니라 런타임 선택 우선순위다.

---

## A-14. Coverage 보정

현재 세션에서 아직 등장하지 않은 `coverage_tags`를 가진 Root에:

```text
미등장 핵심 tag 1개당 +5
최대 +15
```

핵심 tag:

```text
activity
concept
method
evidence
boundary
ownership
career
academic
reading
community
growth
```

`year_1`, `year_2`, `year_3`도 세션에서 아직 한 번도 다루지 않았다면 각 +4.

세션 시간이 짧아 모든 영역을 다룰 수 없으면 priority가 더 높은 후보를 우선한다.

---

## A-15. 반복 패널티

직전 2개 Root와 같은 `question_type`이면:

```text
-8
```

직전 Root와 evidence_id가 겹치면:

```text
-12
```

이번 세션 앞선 Root와 evidence_id가 이미 등장했으나 직전은 아니면:

```text
-5
```

단, Follow-up은 같은 evidence를 깊게 파는 것이 목적일 수 있으므로 이 Root 반복 패널티를 적용하지 않는다.

---

## A-16. interviewer 보정

Root baseline score에 다음을 더한다.

- Section 7 interviewer affinity
- 현재 interviewer의 interest_bias 보정

2인 면접에서는 질문별 interviewer를 번갈아 배정하는 것을 기본으로 하되, eligibility와 affinity가 명백히 다른 경우 같은 interviewer가 연속 질문할 수 있다.

---

## A-17. Seed jitter

동점 고착과 반복 세션 다양성을 위해 후보별 deterministic jitter를 추가한다.

권장:

```text
0.0 이상 6.0 이하
```

같은 seed에서는 같은 값이어야 한다.

jitter 하나만으로 낮은 가치 질문이 핵심 질문을 밀어내게 하지 않는다.

---

## A-18. Root 선택

hard eligibility를 통과한 후보에 대해:

```text
root_score
= priority baseline
+ coverage 보정
+ interviewer affinity
- 반복 패널티
+ seed jitter
```

단순히 항상 단일 최고점 질문을 선택하지 않는다. 그러면 seed가 달라도 반복 세션의 첫 질문과 핵심 Root가 고착될 수 있다.

권장 선택 절차:

1. 최고점과 지나치게 차이나지 않는 상위 후보군을 만든다.
2. 상위 후보군 안에서는 score를 가중치로 사용하되 seed에 따라 deterministic하게 선택한다.
3. priority 5가 존재한다는 이유만으로 모든 세션의 초반을 priority 5만으로 고정하지 않는다.
4. 현재 세션의 Coverage와 evidence 반복 상태를 계속 반영한다.

상위 후보군 권장 예:

```text
최고점 - 10점 이내
또는 상위 3~5개 후보
```

둘 중 구현이 단순한 방식을 사용할 수 있다. 단, 낮은 priority 질문이 무작위로 핵심 질문을 지속적으로 밀어내지 않도록 한다.

완전 무작위 선택 금지.

항상 argmax만 선택하는 것도 금지.

---

## A-19. Follow-up parent gate

모든 FOLLOWUP은 먼저:

```text
parent_question_id가 실제 제시됨
AND
parent 답변 lifecycle 종료
```

를 만족해야 한다.

직접 parent가 제시되지 않은 FOLLOWUP은 절대 후보가 아니다.

손자 질문은 부모 Follow-up이 실제 제시된 뒤에만 후보가 된다.

---

## A-20. Follow-up trigger 평가

answer-derived trigger의 source는 항상 직접 parent 답변이다.

```text
KEYWORD_ANY
ANSWER_TOO_SHORT
ANSWER_TOO_LONG
NO_ANSWER
DONT_KNOW_PATTERN
```

`ANSWER_TOO_SHORT` / `ANSWER_TOO_LONG`의 공식 비교값은 오직 parent의 `timing.answer_duration_ms`다.

```text
ANSWER_TOO_SHORT: answer_duration_ms < threshold_ms
ANSWER_TOO_LONG : answer_duration_ms > threshold_ms
```

- 경계값 동일 시 두 trigger 모두 불성립
- `answer_duration_ms = null`이면 두 trigger 모두 판정 불가이므로 불성립
- `response_latency_ms`, `speech_duration_ms`, `silence_duration_ms`로 대체하지 않음
- HANDOFF `runtime_signals`와 실제 선택된 `followup_trigger.measured_value`에도 같은 `answer_duration_ms`를 기록

`RANDOM`과 `SESSION_TIME_REMAINING`도 parent gate 이후 평가한다.

`AFTER_PARENT`는 추가 조건 없는 Follow-up eligibility다.

사이트는 의미론적 조건을 새로 만들지 않는다.

---

## A-21. Follow-up 후보

현재 parent의 `followup_ids`에 직접 포함된 질문만 1차 후보.

후보는 추가로:

- relation = FOLLOWUP
- parent_question_id 일치
- root_question_id 일치
- 아직 미제시
- trigger 만족
- depth 제한 만족

을 모두 충족해야 한다.

---

## A-22. Follow-up score

권장:

```text
priority baseline
+ interviewer affinity
+ pressure_tendency 보정
+ 아직 미등장 coverage tag 보정
- 동일 question_type 연속 반복 패널티
+ seed jitter
```

Follow-up의 목적은 coverage 확대보다 현재 Root의 검증 깊이에 있으므로 Root보다 evidence 반복 패널티를 적용하지 않는다.

동일 parent에서 여러 Follow-up이 동시에 eligible이면 항상 최고 priority 하나로 고정하지 말고, Section 9.11의 progression을 해치지 않는 상위 후보군 안에서 seed 기반 선택을 허용한다. 단, runtime은 Intent Family를 새로 추론하지 않으므로 사전에 구성된 `followup_ids`, question_type, coverage_tags, priority 범위 안에서만 선택한다.

---

## A-23. Follow-up depth

기본 hard limit:

```text
absolute_max_followup_depth
```

일반 세션 목표:

```text
default_max_followup_depth
```

사이트는 특별한 trigger, 충분한 시간, interviewer pressure 성향이 있을 때 default를 넘을 수 있으나 absolute를 넘을 수 없다.

깊이 정의:

```text
ROOT depth = 0
직접 자식 = 1
손자 = 2
...
```

---

## A-24. Pivot

다음 상황에서는 새 Root로 Pivot할 수 있다.

- 현재 Root에 trigger 만족 Follow-up이 없음
- default depth에 도달
- 같은 intent가 반복될 위험
- 세션 coverage가 지나치게 한 영역에 편중
- 남은 시간상 새 Root 하나가 더 적절
- ending 준비 필요

Pivot은 답변이 좋다/나쁘다는 의미판정으로 결정하지 않는다.

---

## A-25. Surprise

`question_type = SURPRISE`만 Surprise로 계산.

반드시:

```text
surprise_per_session_min
<= 실제 Surprise 수
<= surprise_per_session_max
```

단, 후보가 없거나 시간 부족이면 min 충족 실패를 허용하고 기술 로그에 남긴다.

Surprise라고 해서 무관한 랜덤 지식질문을 만들지 않는다.

---

## A-26. Cross-record

`question_type = CROSS_RECORD`만 Cross-record로 계산.

`allow_cross_record = false`이면 후보 제외.

true여도 다른 Root보다 무조건 우선하지 않는다.

---

## A-27. Weakness 질문

`allow_weakness_question`은 Pack 생성 허용 정책이다.

V1에는 weakness 전용 question marker가 없으므로 사이트가 질문 문장을 분석해 약점 질문 여부를 재분류하지 않는다.

Runtime Policy는 Pack에 존재하는 질문을 기존 metadata만으로 선택한다.

---

## A-28. question text 선택

실제 제시 문구는:

```text
primary_text
또는
text_variants 중 하나
```

seed 기반으로 선택.

규칙:

- question_id 유지
- question_intent 변경 금지
- 사이트가 새 질문 문장 생성 금지
- 문자열을 합성해 새로운 복합 질문 생성 금지

---

## A-29. 시간 예산

사이트는 남은 시간을 고려한다.

참고:

- `recommended_answer_seconds`
- 질문 TTS 시간
- preparation time
- 최근 실제 answer duration

단, 지원자의 답변 내용을 평가하여 시간을 가감하지 않는다.

남은 시간보다 명백히 긴 흐름이 예상되면 깊은 Follow-up보다 새 짧은 Root 또는 ending을 선택할 수 있다.

---

## A-30. Ending Mode

`END_DIRECT`

- 자연스럽게 종료 안내

`END_LAST_WORD`

- 마지막으로 덧붙일 말이 있는지 질문 가능
- 학생부 사실 검증 질문으로 취급하지 않음

`END_FINAL_QUESTION`

- 시간 내 적합한 마지막 Root 1개를 제시 후 종료

`END_TIME_CUT`

- 시간 제한에 의해 종료

`END_LIGHT`

- 짧은 완충 대사 후 종료

ending UI/대사는 사이트 구현이며 Pack question_id를 임의 생성하지 않는다.

---

## A-31. runtime signal 기록

사이트는 HANDOFF 1.2의 `runtime_signals`에 실제 평가한 규칙 신호를 기록한다.

한 질문에서 여러 신호 동시 기록 가능.

실제 Follow-up 선택에 사용된 signal은:

```text
used_for_branching = true
```

로 기록.

`AFTER_PARENT` 같은 구조 조건은 signal 배열에 넣지 않아도 된다.

---

## A-32. followup_trigger 기록

실제로 선택된 FOLLOWUP에는 해당 선택에 사용된 Pack runtime rule을 `followup_trigger`에 기록한다.

`source_question_id`는 항상 직접 `parent_question_id`.

추측하여 사후 작성하지 않는다.

원인을 보존하지 못했으면 `null`.

---

## A-33. 세션 종료 후 보존

HANDOFF에는 최소:

- 실제 question sequence
- interviewer_id
- 실제 question_text
- followup_trigger
- runtime_signals
- source Pack hash
- runtime_policy_version
- difficulty_engine_version

을 보존한다.

---

## A-34. Anti-Pattern

금지:

```text
priority 5 질문만 반복
전공 질문만 반복
같은 evidence Root 연속 반복
완전 랜덤 Root 선택
답변이 유창하면 자동 난이도 상승
답변이 짧으면 의미상 부족하다고 판정
keyword가 있으면 개념 오류라고 판정
interviewer 성별로 압박 강도 변경
text variant를 합성해 새 Intent 생성
부모가 나오지 않은 Follow-up 제시
absolute depth 초과
```

---

## A-35. Validation Checklist

세션 실행 전·중 검사:

1. Pack schema 정확
2. question_id 고유
3. interviewer 참조 유효
4. ROOT trigger relation 호환
5. FOLLOWUP parent 참조 유효
6. parent gate 적용
7. followup_ids 직접 자식 일치
8. depth 제한
9. Surprise 제한
10. Cross-record 정책
11. 동일 question_id 재사용 없음
12. 실제 question_text가 Pack 원문/variant 중 하나
13. interviewer eligibility 처리
14. seed 존재
15. runtime_policy_version 기록 가능
16. trigger를 의미론적 평가로 확장하지 않음
17. HANDOFF followup_trigger 기록 가능
18. HANDOFF runtime_signals 복수 기록 가능
19. ANSWER_TOO_SHORT/LONG이 오직 `answer_duration_ms`로 판정됨
20. `answer_duration_ms == threshold_ms` 경계값에서 short/long trigger가 불성립
21. RECHECK `integrity.status`에 따라 VALID/PARTIAL/INVALID consumer gate가 적용됨
22. 동일 Pack direct match가 `schema + pack_id + sha256` 3요소 모두 일치할 때만 허용됨

반복 세션 다양성 추가 검증:

- 동일 Pack에 서로 다른 seed를 최소 5개 적용해 Root 조합을 시뮬레이션할 수 있음
- 모든 seed에서 첫 Root와 핵심 Root 조합이 완전히 동일하게 고착되지 않음
- 차이는 text variant가 아니라 실제 question_id / evidence 경로에서도 나타남
- 다양성을 만들기 위해 priority·근거·trigger hard rule을 무시하지 않음

---

## A-36. 최종 성공 기준

`QUESTION_ENGINE_RUNTIME/1.0`의 목표:

> 같은 학생부 사실과 같은 질문 Pack을 유지하면서도 priority·coverage·면접관 성향·질문 그래프·runtime trigger·seed를 이용해 반복 세션마다 탐색 경로가 달라지고, 그 선택 과정은 의미론적 AI 판정 없이 재현·추적 가능한 상태를 만드는 것.
