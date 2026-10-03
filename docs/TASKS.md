# Tasks

## PHASE 1 — 완료

- [x] 저장소 truth, baseline, 복구 ZIP 기록
- [x] SVG 파일명과 실제 참조 수정
- [x] `INTERVIEW_PACK/1.0` TypeScript domain과 strict Zod schema
- [x] 구조/의미 validator 분리와 structured issue
- [x] 원본 bytes SHA-256
- [x] 기존 DB를 유지하는 Dexie Pack/Session/Settings abstraction
- [x] active Pack과 Settings의 Dexie canonical 전환 및 legacy mirror
- [x] 실제 Pack Import/Library/삭제/활성화 UI 연결
- [x] React/Vite 병행 기반 구축, 기존 authoritative Runtime 보존
- [x] 단위·타입·빌드·실제 브라우저·ZIP 검증
- [x] 문서와 전체 프로젝트 release ZIP

## PHASE 1 실제 사용자 안정화 — 완료

- [x] Vite 개발 서버에서 classic `runtime.js` 변환으로 PHASE 1 부트스트랩이 중단되는 P0 재현·수정
- [x] Import 초기화/검증/저장 상태와 오류 유형 분리
- [x] Demo Pack 및 질문 엔진형 JSON의 dev/production E2E
- [x] Vite dev-server smoke Release Gate 추가
- [x] 질문 생성 엔진의 첨부 즉시 실행 규칙과 행동 Acceptance Test 보강
- [x] 질문팩 생성 안내와 Home 첫 화면 최소 정리
- [x] clean extraction 및 release ZIP 재검증

## PHASE 2A — UI 정리 (이전 단계)

- [x] 현재 UI 브라우저 baseline·복구 ZIP·사전 UI 설계 문서
- [x] 질문팩 중심 앱 흐름, Home/Dashboard route 보존 및 일반 navigation 정리 (최신 변경에서 `/` 메인 복원)
- [x] inline Import/선택 Pack/오류 상세/최소 Setup·Device·Result·History
- [x] checkpoint 선택 복구/비파괴 새 준비, persona·type·전략 노출 제거

로컬 TTS 비교는 최신 사용자 청취 결과로 종료·폐기했다. 과거 실행 이력은 WORKLOG에만 보존하고 재설치/재비교하지 않는다.

## 2026-10-03 — 기본 TTS 확정·답변 녹음·메인 화면

- [x] 변경 전 실제 화면·소스 복구 ZIP 및 사전 설계 기록
- [x] TTS Lab UI/route/BAT/service/scripts/모델·환경·캐시·실험 결과 제거
- [x] 기본 브라우저 TTS만 사용; 한국어 실제 목소리·성별 선호·말투·속도·높낮이·미리 듣기
- [x] 면접관별 설정 persistence, 프리셋 변경 시 음성/녹음 설정 보존
- [x] 긴 질문 분할, 음성 실패 대기 제한과 화면 질문 대체
- [x] 실제 답변 녹음, 최종 dataavailable 저장, 중도 종료·중복 종료·자연 종료 안전 처리
- [x] 화면 이탈 확인·마지막 녹음 보존·마이크 해제
- [x] 결과 첫 화면의 질문별 재생·개별 파일·녹음 ZIP 및 기존 평가 ZIP
- [x] IndexedDB Blob 새로고침/기록 복기, 다운로드 byte 무결성 확인
- [x] `/`·`/home` 간결한 메인, 기존 질문팩 UX·모바일 메뉴·현대식 CSS
- [x] 타입/45 단위 테스트/빌드 및 실제 브라우저·모바일·녹음 전체 재생 회귀
- [ ] BLOCKED: 이 PC의 기본 TTS 실제 출력. Heami는 열거되지만 headed Chrome에서 start-timeout, IAB 미리 듣기도 실패. 목록/설정 테스트를 실제 출력 PASS로 취급하지 않는다.
- [ ] USER_DEFERRED: 사용자 일반 브라우저의 미리 듣기, 실제 마이크 3문제 녹음·청취 품질

## 다음 실행 — 명시적 후속 지시에서만

### 최신 엔진 교체·재배포 — 2026-10-03

- [x] 사용자 제공 질문 v1.2/평가 v1.4/HANDOFF v1.2 원문 보존·이름 정리·구버전 제거
- [x] 다운로드 경로 및 generator 1.0/1.2 호환
- [x] HANDOFF 1.2 원본 Pack bytes/근거 snapshot/신호 배열/빈 전사·집계 호환
- [x] 타입/57 단위 테스트/로컬 및 Pages base 빌드
- [x] 실제 브라우저 81 checks, 면접·평가 ZIP·질문 엔진 1.2 원본 회귀
- [x] 로컬 Git push·v0.1.1 백업·원격 배포/공개 파일 원문 hash·구버전 404 확인

### GitHub 기반·공유 — 2026-10-03

- [x] 공개 `gunpodoman/myeok` 저장소 생성, 로컬 Git/인증 연결
- [x] Pages `/myeok/` 경로·hash routing 및 자동 빌드/배포 구성
- [x] 후속 검증/commit/버전 tag/push 규칙 및 사용자 데이터 제외
- [x] 최초 소스 push·v0.1.0 tag·실제 공개 사이트 확인 (실행 결과는 WORKLOG)

- Authoritative UI와 면접 Runtime의 단계적 TypeScript/React 이전
- 기존 Runtime의 상태 머신·미디어 흐름을 회귀 테스트와 함께 모듈화
- compatibility localStorage mirror 제거 시점 결정
- Silero VAD 및 신규 제품 기능은 해당 Phase의 명시적 범위에서만 진행
- 폐기한 neural TTS와 실험실을 복원하지 않는다. 기본 TTS 실제 음질·제공 성별은 사용자 장치에서 확인한다.
