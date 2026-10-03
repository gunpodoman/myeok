# 面逆力 Codex 본개발 — PHASE 1 완료 기록

> 2026-09-27: 사용자가 첨부한 최종 PHASE 1 지시를 우선 적용해 구현과 검증을 완료했다. 현재 Pack/Settings canonical 계층은 `src/phase1`의 TypeScript/Zod/Dexie 구현이며, 검증된 Vanilla Runtime을 기본 앱으로 유지한다. React는 병행 foundation까지만 구축했고 PHASE 2 기능은 시작하지 않았다. 실제 상태는 `.agent/STATE.md`, 검증은 `.agent/verification/browser-smoke-report.json`, 작업 내역은 `docs/WORKLOG.md`를 기준으로 한다.

# 원래 PHASE 1 실행 지시

사용 모델은 GPT-5.6 Sol, Thinking High를 전제로 한다.

이번 실행은 전체 프로젝트를 한 번에 완성하는 실행이 아니다.

전체 개발계획을 먼저 이해하고 정리한 뒤, 이번 실행에서는 반드시 `PHASE 1`만 구현한다.

PHASE 1이 완료되어 검증과 산출물 생성까지 끝나면 작업을 종료한다.

PHASE 2 이후의 코드를 미리 구현하지 않는다.

목표는 Codex 사용량을 통제하면서 각 단계가 독립적으로 실행, 검증, 복구 가능한 상태로 개발하는 것이다.

이번 실행은 최대 약 5시간의 작업 한도 안에서 끝낼 수 있는 범위를 전제로 한다.

따라서 비핵심 리팩터링, 기술 재조사, 지나친 컴포넌트 세분화, 필요 이상의 추상화 때문에 PHASE 1의 핵심 기능 완성과 검증이 밀려서는 안 된다.

이번 실행의 최우선 목표는 아름다운 아키텍처 자체가 아니라 앞으로의 모든 면접 기능을 안전하게 올릴 수 있는 실제 작동 기반을 완성하는 것이다.

# 1. 최상위 제품 목표

서비스명:

面逆力

의미:

면접으로 역전하는 능력

최종 목표:

학생의 학교생활기록부를 바탕으로 생성된 면접 질문팩을 이용하여 실제 대학 면접과 유사한 환경에서 반복 훈련하고, 브라우저에서 객관적 발화 데이터를 측정하고, 결과 데이터를 일반 ChatGPT에 전달하여 정밀 평가까지 받을 수 있는 웹서비스를 만든다.

무료 프로젝트처럼 구현하지 않는다.

무료로 공개하더라도 실제 유료 사업 서비스로 운영할 수 있을 정도의 안정성, 데이터 구조, UX, 유지보수성을 목표로 한다.

# 2. 비용에 관한 절대 조건

모든 핵심 기능은 별도의 추가 비용 없이 동작해야 한다.

개발:
무료

로컬 실행:
무료

면접 실행:
무료

데이터 저장:
사용자 브라우저 로컬

배포:
Cloudflare Pages Free

백엔드:
없음

서버 DB:
없음

생성형 AI API:
없음

금지:

유료 API

OpenAI API

Anthropic API

Gemini 유료 API

유료 STT

유료 TTS

유료 VAD

유료 Database

유료 Storage

유료 BaaS

유료 Authentication

유료 Serverless 의존

별도의 AI inference 서버

API key가 필수인 핵심 기능

신용카드 등록이 필수인 핵심 서비스

무료 체험 종료 후 핵심 기능이 중단되는 서비스

사용자가 증가함에 따라 면접 실행 횟수에 비례하여 운영비가 발생하는 구조

일반 ChatGPT를 사용하는 질문 생성과 정밀 평가는 사이트 API 연동이 아니라 사용자가 파일을 직접 첨부하는 방식으로 유지한다.

# 3. 기술 스택 고정

기술을 다시 비교 조사하지 않는다.

Application:

React
TypeScript
Vite

Routing:

React Router Declarative Mode

Package Manager:

npm

Schema:

Zod 4

Local Database:

IndexedDB
Dexie

Application State:

React state
Context
useReducer
순수 TypeScript service

State Machine:

외부 State Machine 라이브러리 사용 금지
TypeScript discriminated union과 reducer 사용

Audio:

getUserMedia
MediaRecorder
Web Audio API
AudioContext
AudioWorklet

STT:

Web Speech API
SpeechRecognition
webkitSpeechRecognition fallback
ko-KR

TTS:

window\.speechSynthesis
SpeechSynthesisUtterance

VAD:

@ricky0123/vad-web
Silero VAD
ONNX Runtime Web
WASM 우선

ZIP:

fflate

Hash:

Web Crypto API
SHA-256

UUID:

crypto.randomUUID()

Charts:

가능하면 CSS와 SVG

Styling:

기존 CSS와 CSS Variables 유지

새 UI Framework 도입 금지

Testing:

Vitest
React Testing Library
Playwright

Hosting:

Cloudflare Pages Free
Static SPA

사용 금지:

Cloudflare Workers
Pages Functions
KV
D1
R2

핵심 기능은 정적 파일과 사용자 브라우저만으로 동작해야 한다.

# 4. 검색 제한

이번 프로젝트에서는 기술 조사에 Codex 사용량을 낭비하지 않는다.

이미 지정된 기술을 다른 기술과 비교하지 않는다.

금지 예:

Dexie 대 다른 IndexedDB 라이브러리 비교

fflate 대 JSZip 비교

React Router 대 다른 Router 비교

Silero 대 다른 VAD 비교

Cloudflare Pages 대 다른 Hosting 비교

Zod 대 다른 Schema Library 비교

새 기술을 추천하기 위한 검색

웹 검색은 다음과 같은 실제 blocker가 발생했을 때만 최소한으로 허용한다.

현재 설치된 라이브러리 API 확인

빌드 오류 해결

브라우저 호환성 문제

보안 문제

라이선스 문제

그 외에는 검색하지 않는다.

검색이 필요할 때도 해당 blocker를 해결하는 데 필요한 공식 자료만 확인하고 광범위한 비교 조사로 확장하지 않는다.

# 5. 현재 프로젝트가 기준이다

이 지시서가 포함된 `myeok` 프로젝트 폴더가 현재 authoritative project다. Codex에 ZIP 형태로 전달된 경우 압축 해제된 해당 폴더를 기준으로 작업한다.

처음부터 새 사이트를 만들지 않는다.

반드시 먼저 기존 프로젝트를 검사한다.

이미 구현되어 정상 작동하는 기능과 디자인을 보존한다.

현재 디자인은 사용자가 초기 버전으로 승인했다.

이번 단계에서는 디자인 리뉴얼을 하지 않는다.

기능 기반을 만드는 데 집중한다.

기존 프로젝트에 임시 구현, Demo 데이터, 단일 HTML 구조가 존재하더라도 그것을 이유로 전체를 무조건 폐기하고 새로 만들지 않는다.

실제로 재사용 가능한 부분과 교체해야 하는 부분을 먼저 구분한다.

# 6. Harness

`harness_v8.txt`를 가장 먼저 전체 읽는다.

해당 문서를 개발 운영 프로토콜로 사용한다.

특히 다음을 지킨다.

실제 프로젝트를 수정한다.

유효한 기존 작업을 보호한다.

의미 있는 변경 전에 복구 가능한 기준점을 만든다.

코드 작성만으로 완료 판정하지 않는다.

실제 앱을 실행한다.

실제 사용자 경로를 확인한다.

현재 빌드의 실제 화면을 확인한다.

문제가 관찰됐을 때만 수정한다.

검증한 바로 그 상태를 최종 산출물로 제공한다.

# 7. core_md

프로젝트에 다음 폴더를 유지한다.

core_md/

그 안에 현재 핵심 MD 4개를 반드시 포함한다.

학생부기반_공통_실전면접_질문엔진_v1.0_FINAL.md

면접_평가_핸드오프_규격_v1.1_FINAL.md

학생부기반_실전면접_평가엔진_v1.2_FINAL.md

생활기록부_전수분석_적응형탐구학습_마스터가이드_v4.0.md

네 문서를 모두 읽어라.

현재는 개발 기준 문서로 고정한다.

실제 치명적 오류가 발견되지 않는 한 수정하지 않는다.

향후 수정이 필요할 경우 모든 핵심 MD의 문서 형식과 용어 체계를 함께 통일한다.

모든 최종 프로젝트 ZIP에는 `core_md`를 포함한다.

# 8. 전체 개발 로드맵

프로젝트 분석 후 다음 로드맵이 현재 프로젝트 상태와 모순되지 않는지 확인하고, 필요하면 세부 작업만 조정하라.

단 기술 스택과 제품 원칙은 바꾸지 않는다.

## PHASE 1

Foundation and Pack Pipeline

이번 실행에서 구현한다.

목표:

안정적인 React + TypeScript 기반과 실제 질문팩 관리 시스템 완성.

## PHASE 2

Interview Runtime and Browser Audio

구현 대상:

실제 Setup

Device Check

Interview State Machine

Microphone

MediaRecorder

TTS

STT

질문별 Session Checkpoint

이번 실행에서는 구현하지 않는다.

## PHASE 3

VAD, Metrics and Adaptive Interview Flow

구현 대상:

Silero VAD

RMS fallback

Pause 분석

Metrics Engine

deterministic PRNG

Root Selection

Follow-up Engine

Runtime Trigger

이번 실행에서는 구현하지 않는다.

## PHASE 4

Result and Data Export

구현 대상:

실제 Result

History

Compare

Interrupted Session Recovery

INTERVIEW_EVAL_HANDOFF/1.1

CSV

ZIP

Audio Export

이번 실행에서는 구현하지 않는다.

## PHASE 5

Production Hardening

구현 대상:

전체 통합 테스트

Playwright 주요 사용자 경로

Chrome 검증

Edge 검증

접근성 점검

성능 점검

오류 복구

Cloudflare Pages Production Build

Release Package

이번 실행에서는 구현하지 않는다.

## PHASE 6

Adaptive Study System

생활기록부 전수분석 적응형탐구학습 마스터가이드를 기반으로 면접 코어 완성 이후 별도 개발한다.

이번 실행에서는 구현하지 않는다.

# 9. 이번 실행의 절대 범위

이번 실행에서는 `PHASE 1`만 수행한다.

PHASE 2 이후에 해당하는 기능을 구현하지 않는다.

특히 이번 실행에서는 다음을 구현하지 않는다.

실제 마이크 캡처

MediaRecorder 면접 녹음

SpeechRecognition 면접 실행

SpeechSynthesis 면접 실행

Silero VAD

AudioWorklet 분석

실제 면접 진행 State Machine

실제 Follow-up 실행

Metrics Engine

HANDOFF 생성

ZIP Export

History 실제 세션 분석

Compare 실제 세션 분석

적응형 학습 시스템

해당 기능을 위한 인터페이스 경계를 미리 고려하는 것은 허용하지만 실제 구현까지 진행하지 않는다.

중요:

현재 기준 프로젝트에는 PHASE 2 이후에 해당하는 기능의 프로토타입 또는 기능 테스트 구현이 일부 이미 존재할 수 있다.

이 범위 제한을 이유로 기존 기능을 삭제하거나 의도적으로 회귀시키지 않는다.

React 이전과 PHASE 1 작업 과정에서 기존 동작을 가능한 한 보존하되, 이번 실행에서는 해당 기능을 새로 완성하거나 대규모 개선하는 데 시간을 사용하지 않는다.

즉 `새로 구현하지 않는다`는 의미이지 `기존 구현을 제거한다`는 의미가 아니다.

# 10. PHASE 1 작업

다음 순서로 진행한다.

## 10.1 기존 프로젝트 분석

현재 구조를 확인한다.

현재 실행방법을 확인한다.

현재 페이지를 확인한다.

현재 정상적으로 작동하는 기능을 확인한다.

현재 Demo와 실제 기능을 구분한다.

기존 UI를 보호해야 할 부분을 파악한다.

현재 프로젝트가 어느 정도까지 React 이전이 필요한지도 실제 파일을 기준으로 판단한다.

## 10.2 복구 기준점

현재 프로젝트 원본을 복구 가능한 checkpoint로 보존한다.

`.agent/STATE.md`를 사용할 수 있는 환경이면 생성한다.

기록:

현재 목표

authoritative working path

현재 기준 파일

주요 제약

이번 PHASE

다음 PHASE

## 10.3 전체 계획 확정

PHASE 1부터 PHASE 6까지의 계획을 짧게 정리한다.

각 Phase마다:

목표

주요 구현 대상

완료 조건

을 기록한다.

이 계획 작성 후 PHASE 1 구현을 즉시 시작한다.

사용자 확인을 기다리지 않는다.

## 10.4 React + TypeScript + Vite 기반

현재 프로젝트가 이미 해당 구조면 보존한다.

아니라면 기존 UI와 기능을 잃지 않는 방식으로 이전한다.

조건:

TypeScript strict

React Router Declarative Mode

기존 페이지 Route 유지

기존 스타일 최대한 유지

디자인 리뉴얼 금지

기능 손실 금지

중요:

기존 프로젝트의 모든 화면을 완벽하게 React 컴포넌트 구조로 재설계하거나 세밀하게 리팩터링하는 작업 때문에 PHASE 1의 핵심 데이터 기능과 검증이 지연될 위험이 있다면, 먼저 기존 UI를 손실 없이 동작시키는 최소한의 React 구조를 확보하라.

불필요한 컴포넌트 세분화, CSS 재작성, 폴더 구조 미학, 추상화 정리, 중복 제거는 PHASE 1 핵심 완료 이후에도 시간이 충분할 때만 수행한다.

이번 PHASE에서는 아키텍처 미학보다 `Pack Pipeline의 실제 완성`을 우선한다.

## 10.5 프로젝트 책임 분리

최소한 다음 책임을 분리한다.

app

components

pages

packs

storage

schemas

types

lib

styles

tests

향후 다음 기능을 추가할 수 있도록 구조적 경계만 확보한다.

interview

audio

stt

vad

metrics

sessions

handoff

export

아직 구현하지 않는 기능에 불필요한 코드를 미리 만들지 않는다.

# 11. 작업 시간과 범위 보호 규칙

이번 실행은 제한된 Codex 작업시간 안에 PHASE 1을 끝까지 완료하는 것이 중요하다.

따라서 작업이 예상보다 커질 경우 다음 우선순위를 따른다.

최우선:

프로젝트 정상 실행

Pack Schema

Semantic Validation

SHA-256

IndexedDB

Pack Import

Pack Library

Settings Persistence

테스트

production build

실제 브라우저 검증

최종 ZIP

그 다음:

코드 구조 정돈

세부 컴포넌트 분리

내부 중복 제거

비핵심 UI 개선

추가 개발자 편의 기능

절대 우선하지 말 것:

디자인 리뉴얼

CSS 전면 재작성

필요 이상의 범용 abstraction

PHASE 2 준비 코드 대량 작성

새 기술 조사

지원 대상이 아닌 브라우저까지 완벽하게 맞추기

현재 구조가 충분히 유지보수 가능하고 핵심 기능이 안정적으로 동작한다면 추가적인 리팩터링을 만들지 않는다.

# 12. Domain Type

PHASE 1에서 최소 다음 타입을 정의한다.

InterviewPack

Generator

Target

SourceRecord

RecordEvidence

Interviewer

SessionPolicy

Question

RuntimeTrigger

CognitiveDifficulty

QuestionRelation

QuestionType

PackIntegrity

타입은 core_md 명세에서 직접 유도한다.

`any` 남발 금지.

공식 enum은 임의 문자열로 느슨하게 처리하지 않는다.

# 13. INTERVIEW_PACK Zod Schema

INTERVIEW_PACK/1.0 전체 구조를 구현한다.

폐쇄형 규격을 유지한다.

unknown 핵심 field를 허용하지 않는다.

최소 검증:

schema

pack_id

generator

target

source_record

record_evidence

interviewer_pool

session_policy

question_bank

integrity

모든 공식 enum

runtime_trigger discriminated union

recommended_answer_seconds

coverage_tags

eligible_interviewer_values

명세에 nullable이라고 적힌 값과 optional인 값을 혼동하지 않는다.

0과 null을 임의로 동일하게 처리하지 않는다.

# 14. Semantic Pack Validation

Zod 구조 검증 이후 별도 semantic validator를 구현한다.

검사:

question_id uniqueness

evidence_id uniqueness

interviewer_id uniqueness

evidence reference 존재

question reference 존재

ROOT 규칙

FOLLOWUP 규칙

root_question_id

parent_question_id

followup_ids와 parent 관계

자기참조

DAG cycle

question type과 ROOT 또는 FOLLOWUP 관계

student-record 기반 질문의 evidence

integrity flag와 실제 검사 결과의 심각한 모순

검증 결과는 개발자 오류 문자열만 반환하지 않는다.

다음처럼 구조화한다.

severity

code

path

message

developerDetail

사용자 UI에서는 사람이 이해할 수 있는 한국어 메시지를 보여준다.

개발자 상세정보는 별도로 펼쳐 확인할 수 있게 한다.

# 15. SHA-256

사용자가 업로드한 `interview-pack.json` 원본 byte sequence에 대해 Web Crypto API SHA-256을 계산한다.

parse 후 다시 serialize한 문자열을 hash하지 않는다.

64자리 lowercase hexadecimal로 저장한다.

동일 파일 판정에 이 hash를 사용할 수 있게 한다.

# 16. Dexie IndexedDB

PHASE 1에서는 최소 다음 table을 구현한다.

packs

settings

향후 schema migration을 고려하여 DB version을 명시한다.

Pack에 최소 저장:

pack_id

display_name

schema

sha256

original_json

parsed_pack

imported_at

last_used_at

university

department

question_count

interviewer_count

validation_status

활성 Pack 정보도 저장한다.

localStorage를 Pack 저장소로 사용하지 않는다.

기존 임시 localStorage 데이터가 있다면 새로운 IndexedDB 구조와 충돌하지 않도록 처리한다.

필요하지 않다면 복잡한 migration을 이번 PHASE에서 만들지 않는다.

# 17. 질문팩 Import

기존 Import UI를 실제 데이터 계층과 연결한다.

지원:

File Picker

Drag and Drop

JSON parsing

Zod validation

Semantic validation

SHA-256

IndexedDB save

사람용 오류 메시지

성공 상태

고급 validation detail

동일 SHA-256 Pack 재가져오기 처리

실패한 Pack을 정상 Pack처럼 저장하지 않는다.

검증을 통과하지 않은 데이터가 이후 Setup이나 면접 흐름의 활성 Pack이 되어서는 안 된다.

# 18. Pack Library

실제 IndexedDB 데이터를 사용한다.

지원:

여러 Pack 표시

활성 Pack 표시

Pack 선택

최근 사용일

대학과 학과

질문 수

면접관 수

Pack 삭제

Import 추가

Demo Pack을 사용하는 경우 명확히 Demo라고 표시한다.

가짜 저장 데이터 금지.

삭제 후 현재 활성 Pack 상태가 깨지지 않도록 처리한다.

# 19. Dashboard 연결

Pack이 없을 때:

질문팩 준비 CTA

Pack이 있을 때:

활성 Pack 표시

최근 Pack 표시

면접 준비 CTA

PHASE 1에서는 실제 면접 Runtime이 아직 없으므로 면접 시작 버튼이 다음 Phase 기능임을 자연스럽게 처리한다.

기존에 동작하던 Demo 면접 화면을 완전히 삭제할 필요는 없지만 실제 구현 완료처럼 표시하지 않는다.

# 20. Setup 저장 기반

실제 면접 Runtime은 PHASE 2에서 구현한다.

이번 단계에서는 설정 데이터 모델과 저장까지만 구현한다.

지원 preset:

COMFORT

NORMAL

REALISTIC

HARD

CUSTOM

현재 core_md와 기존 UX에서 정의된 세부 설정을 저장 가능한 구조로 만든다.

설정 변경 시 Dexie settings에 보존한다.

페이지를 새로고침하거나 브라우저를 다시 열어도 유지되어야 한다.

실제 면접 상태 머신과 연결하는 작업은 PHASE 2다.

# 21. 테스트

PHASE 1에서 반드시 테스트한다.

Zod valid Pack

invalid schema

unknown field

잘못된 enum

duplicate question id

missing evidence reference

missing parent

잘못된 root reference

followup relationship mismatch

self reference

DAG cycle

invalid runtime trigger

invalid recommended answer range

SHA-256

IndexedDB Pack persistence

동일 Pack 처리

Pack delete

Settings persistence

가능한 경우 실제 core_md 규격에 맞는 작은 valid fixture와 여러 invalid fixture를 사용한다.

테스트 때문에 PHASE 2 기능까지 구현하지 않는다.

# 22. 실제 실행 검증

PHASE 1 완료 후 실제 앱을 실행한다.

최소 사용자 경로:

Home

→ Pack Import

→ valid Pack

→ validation success

→ Pack save

→ Pack Library

→ 새로고침

→ Pack persistence 확인

→ active Pack 변경

→ Setup

→ preset 변경

→ 새로고침

→ 설정 persistence 확인

invalid Pack:

Import

→ validation error

→ 저장되지 않음

도 확인한다.

현재 빌드의 실제 화면을 직접 확인한다.

기존 디자인이 기능 추가로 깨지지 않았는지 검토한다.

가능하다면 Playwright smoke test를 사용한다.

브라우저 자동화 자체가 환경 제약으로 불가능하다면 이유를 기록하고 가능한 실제 실행 대체 경로를 시도한다.

단 테스트 도구 자체를 고치는 데 대부분의 작업시간을 소비하지 않는다.

# 23. 무료 구조 확인

PHASE 1에서 도입된 모든 dependency가 다음을 만족해야 한다.

오픈소스 또는 무료 사용 가능

API key 불필요

외부 서버 불필요

유료 서비스 불필요

Cloudflare Pages 정적 배포 가능

새로운 dependency가 필요하지 않다면 추가하지 않는다.

# 24. Windows Launcher

필요한 경우 기존 launcher를 보존 또는 수정한다.

BAT은 최소 진입점만 담당한다.

ASCII only 권장.

CRLF.

복잡한 로직은 넣지 않는다.

BAT 내부에서 한글 출력에 의존하지 않는다.

복잡한 로직이 필요하면 PowerShell 또는 Python으로 분리한다.

최종 배포물에서 경로에 공백이 있어도 정상 실행되도록 한다.

# 25. PHASE 1 완료 조건

다음이 모두 만족되어야 PHASE 1 완료다.

현재 프로젝트가 실행된다.

React + TypeScript + Vite 기반이 정상이다.

기존 주요 페이지가 유지된다.

INTERVIEW_PACK/1.0 전체 구조 검증이 작동한다.

참조 및 그래프 검증이 작동한다.

원본 Pack SHA-256을 계산한다.

IndexedDB에 여러 Pack을 저장할 수 있다.

브라우저를 새로 열어도 Pack이 남는다.

Pack을 선택할 수 있다.

Pack을 삭제할 수 있다.

Setup 설정이 실제로 저장된다.

관련 테스트가 통과한다.

production build가 성공한다.

실제 브라우저에서 핵심 PHASE 1 사용자 흐름을 확인한다.

PHASE 2 기능을 미완성 상태로 억지 구현하지 않았다.

# 26. 예상보다 시간이 부족할 경우

작업시간이나 Context가 예상보다 부족해지는 상황에서도 PHASE 2를 시작하지 않는다.

먼저 비핵심 리팩터링과 구조 개선을 중단한다.

그 다음 현재까지 구현한 PHASE 1 기능의 일관성을 확보한다.

가능한 한 다음을 우선하여 끝낸다.

실행 가능한 프로젝트

검증된 Pack Pipeline

IndexedDB persistence

테스트

production build

README

복구 가능한 최신 소스

최종 ZIP

완료하지 못한 PHASE 1 항목이 존재한다면 완료한 것처럼 표시하지 않는다.

무엇이 완료됐고 무엇이 남았는지 정확히 보고한다.

시간이 부족하다는 이유로 임시 Demo 값을 실제 기능인 것처럼 연결하지 않는다.

# 27. PHASE 1 완료 후 중지

PHASE 1 완료 후 PHASE 2를 시작하지 않는다.

남은 Context나 시간 여유가 있어도 PHASE 2 구현으로 넘어가지 않는다.

대신 다음을 수행한다.

PHASE 1 최종 자체 검토

발견된 PHASE 1 결함 수정

재검증

README 갱신

다음 Phase 계획 갱신

프로젝트 ZIP 생성

# 28. 최종 ZIP

PHASE 1이 완료되면 최신 프로젝트 전체 ZIP을 제공한다.

ZIP 최상위에는 반드시:

core_md/

가 존재해야 한다.

핵심 MD 4개가 모두 들어 있어야 한다.

불필요한 node_modules는 ZIP에 포함하지 않는다.

필요한 package.json과 lockfile은 포함한다.

README를 포함한다.

README에는:

현재 Phase

완료된 기능

아직 구현하지 않은 기능

실행방법

npm install

npm run dev

npm run build

npm test

지원환경

무료 운영 구조

데이터 저장방식

다음 Phase

를 기록한다.

최종 ZIP은 마지막으로 검증한 현재 소스와 동일한 상태여야 한다.

# 29. 최종 보고

최종 답변은 길게 개발일지를 쓰지 않는다.

다음만 보고한다.

PHASE 1에서 실제 구현한 내용

실제로 실행하고 검증한 사용자 흐름

통과한 테스트

발견했지만 다음 Phase에 속해 의도적으로 구현하지 않은 내용

현재 알려진 Blocker

다음 PHASE 2의 목표

최종 프로젝트 ZIP

# 30. 최종 원칙

이번 실행의 성공 기준은 전체 面逆力 완성이 아니다.

이번 실행의 성공 기준은:

앞으로 음성 면접 엔진을 안전하게 올릴 수 있는 제품 기반과 질문팩 데이터 계층을 실제로 완성하는 것이다.

전체 계획은 알고 있어야 한다.

그러나 이번에는 PHASE 1만 완성한다.

범위를 넘기지 않는다.

기술을 다시 연구하지 않는다.

디자인을 다시 만들지 않는다.

React 이전 자체를 프로젝트 목표로 착각하지 않는다.

비핵심 리팩터링 때문에 Pack Pipeline의 실제 완성을 희생하지 않는다.

실제로 구현하고 검증하는 데 사고력을 사용한다.
