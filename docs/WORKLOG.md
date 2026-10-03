# Worklog

## 2026-09-27 — PHASE 1 완료

### 완료 내용

- 필수 프로젝트 문서가 없어 기존 파일을 덮어쓰지 않고 `AGENTS.md`, `docs/TASKS.md`, `docs/WORKLOG.md`를 생성했다.
- 전체 저장소, Harness, `core_md` 4종을 확인하고 변경 전 truth와 touch boundary를 `.agent/STATE.md`에 기록했다.
- 변경 전 전체 복구 ZIP과 주요 Route 화면을 `.agent/recovery`, `.agent/baseline-*.png`에 보존했다.
- `myeok logo.svg`를 `myeok-logo.svg`로 정리하고 삭제된 PNG 참조를 실제 SVG 참조로 교체했다.
- `INTERVIEW_PACK/1.0` TypeScript domain, strict Zod schema, semantic validator, raw-byte SHA-256를 구현했다.
- 기존 `myeonyeokryeok_v1` DB/store를 유지하는 Dexie storage service와 legacy IndexedDB/localStorage 호환 계층을 구현했다.
- Pack과 Settings의 canonical source를 Dexie로 수렴시키고 기존 Runtime은 adapter를 통해서만 접근하도록 연결했다.
- Import 검증 상세, 실제 다중 Pack Library, 활성화, 삭제, duplicate SHA, active fallback, Settings persistence를 연결했다.
- 기존 면접 Runtime, 세션 checkpoint, Result/History/Compare, HANDOFF/CSV/ZIP을 보존했다.
- Vite/TypeScript/Vitest와 React/React Router 병행 foundation을 추가했다. 회귀 위험 때문에 React shell을 기본 앱으로 전환하지 않았다.
- HTTP deep-link 새로고침 시 상대 script 경로가 깨지는 문제를 실제 브라우저 검증에서 발견해 protocol별 base path로 수정했다.
- npm/Vite 기반 Windows BAT launcher로 갱신하고 ASCII/CRLF를 확인했다. 기존 `start_server.py`는 보존했다.

### 주요 수정/추가 파일

- 런타임 연결: `index.html`, `app.js`, `runtime.js`, `styles.css`
- 로고: `assets/myeok-logo.svg`
- PHASE 1: `src/phase1/domain.ts`, `schema.ts`, `validator.ts`, `hash.ts`, `storage.ts`, `browserBridge.ts`
- React foundation: `src/react/App.tsx`, `src/react/main.tsx`, `react-foundation.html`
- 도구: `package.json`, `package-lock.json`, `tsconfig.json`, `vite.config.ts`, `vite.phase1.config.ts`, `scripts/browser-smoke.mjs`
- 테스트: `tests/validator.test.ts`, `tests/hash.test.ts`, `tests/storage.test.ts`, fixture/setup
- 문서: `README.md`, `CODEX_PHASE1_PROMPT.md`, `CODEX_START_HERE.md`, `.agent/STATE.md`, `docs/TASKS.md`, `docs/WORKLOG.md`
- 생성 bundle: `public/phase1/index.js`, `public/phase1/index.js.map`

### 실행한 확인

- `npm run typecheck` — 통과
- `npm test` — 3 files, 26 tests 통과
- `npm run build` — 통과
- `npm run smoke:browser` — 통과
- 실제 브라우저 확인: SVG, 주요 Route, valid/invalid Pack, 두 Pack 저장, active 변경/새로고침, 삭제 fallback, Settings 새로고침, fake media 장치 점검, Interview 진입, Result/History, 평가용 ZIP 다운로드
- 페이지 예외 0, console error 0
- 평가용 ZIP 내부: `handoff.json`, `handoff.md`, `answers.csv`, `events.json`, `events.csv`, `transcript.md`, `README.md`
- `core_md` 4종은 수정하지 않았다.
- release ZIP을 별도 폴더에 clean extraction한 뒤 `npm ci`, typecheck, 26 tests, production build를 다시 통과했다.

### 남은 작업

- PHASE 1 필수 범위의 알려진 미완료는 없다.
- 실제 사람의 마이크/음성 품질은 사용자 장치에서 확인해야 한다. 자동 검증은 Chrome fake media device를 사용했다.
- Silero VAD, 새 metrics/follow-up/HANDOFF/ZIP, 디자인 개편, 적응형 학습 UI는 PHASE 2 이후 범위다.
- Authoritative UI/Runtime의 전면 React/TypeScript 이전과 localStorage mirror 제거는 PHASE 2에서 회귀 테스트와 함께 진행한다.

## 2026-09-28 — 실제 사용자 테스트 기반 긴급 안정화

### 완료 내용

- `START_MYEONYEOK.bat`과 같은 Vite 개발 경로에서 `runtime.js`가 classic script인데도 Vite가 ESM import를 주입해 `Cannot use import statement outside a module`로 중단되는 P0를 재현했다.
- 사용자 수정인 `/phase1/index.js` 절대 dynamic import를 유지하고, 개발 서버에서 `app.js`와 `runtime.js`를 변환 없이 제공하도록 수정했다. `.agent`/`release` ZIP은 watcher 대상에서 제외했다.
- Import를 초기화·준비·검증·저장·실패 상태로 분리하고 JSON parsing, schema, semantic, PHASE 1 초기화, storage, unexpected 오류를 한국어 안내와 접이식 기술 정보로 구분했다.
- Demo Pack을 공식 Acceptance Fixture로 유지하고, 별도 질문 엔진형 JSON fixture를 추가해 저장·Library·active·새로고침·Setup·Interview까지 검증했다.
- 질문 생성 엔진 MD에 엔진+학생부 동시 첨부를 실행 명령으로 처리하는 규칙과 행동 수준 Acceptance Test를 추가했다. `INTERVIEW_PACK/1.0` 계약·enum·버전은 변경하지 않았고 나머지 핵심 MD 3종도 수정하지 않았다.
- 질문팩 만들기 안내를 5단계로 명확히 하고, Home의 첫 행동·3단계 흐름·CTA를 단순화했다. 장식 통계 패널 제거, 로고 중앙 정렬, 클릭 요소 pointer/hover를 적용했다.
- production smoke와 별도로 실제 Vite 서버를 띄우는 `smoke:dev` Release Gate를 추가했다.

### 수정 파일

- Runtime/UI: `app.js`, `runtime.js`, `styles.css`, `vite.config.ts`
- 검증: `scripts/browser-smoke.mjs`, `package.json`, `tests/engine-sample.test.ts`, `tests/fixtures/question-engine-sample-pack.json`
- 제품 문서: `core_md/학생부기반_공통_실전면접_질문엔진_v1.0_FINAL.md`
- 상태 문서: `README.md`, `CODEX_START_HERE.md`, `.agent/STATE.md`, `docs/TASKS.md`, `docs/WORKLOG.md`

### 실행한 확인

- PASS — `npm run typecheck`
- PASS — `npm test`: 4 files, 27 tests
- PASS — `npm run build`
- PASS — `npm run smoke:browser`: production, 페이지 예외 0, console error 0
- PASS — `npm run smoke:dev`: Vite server, raw runtime/module path, 페이지 예외 0, console error 0
- PASS — Demo Pack 및 질문 엔진형 JSON: validation, SHA-256, Dexie, Library, active persistence, Setup, Interview
- PASS — Pack deletion fallback, Settings persistence, Result, History, HANDOFF/ZIP export
- PASS — release ZIP 목록 및 `core_md` 4종 포함 확인, clean extraction에서 `npm ci`, typecheck, tests, build, production/dev smoke 재실행
- USER_DEFERRED — physical microphone quality test. 자동 Device Check는 Chrome fake media device를 사용했다.

### 남은 작업

- 실제 사용자의 물리 마이크에서 3문제 이상 진행하며 TTS/STT 간섭과 녹음 음질을 수동 확인한다.
- Silero VAD, 신규 기능, React 전환, 디자인 리뉴얼은 PHASE 2 범위로 남긴다.

## 2026-10-03 — PHASE 2A UI 단순화·실제 로컬 한국어 TTS 비교

### 완료 내용

- 작업 전 AGENTS/TASKS/WORKLOG, 현재 source/Harness/core_md/adapter/저장 구조를 조사하고 실제 주요 Route 스크린샷을 `.agent/phase2a-baseline`에 남겼다. 제품/CSS 수정 전 `docs/UI_PHASE2A_PLAN.md`와 복구 ZIP을 작성했다.
- `/`와 기존 `/app/import`를 `/app/packs`로 통합했다. active Pack이 있어도 질문팩에서 시작하며 Home `/home`·Dashboard `/app`는 보존하고 일반 앱 navigation에서 숨긴다. 앱 Header는 브랜드 중심, Sidebar는 질문팩·면접 설정·기록·도움말·작은 TTS Lab이다.
- 질문팩 화면에 선택 Pack 우선/다른 Pack 선택/파일 추가를 합쳤다. normal ready 배너·기술 metadata·중복 안내는 제거하거나 details로 이동했다. JSON/schema/semantic/init/storage/unexpected 오류 구분, 작은 Demo 동작, PHASE 1 canonical Dexie를 보존했다.
- Setup/Device/Result/History/Help의 다음 행동을 단순화했다. Interview는 면접관 번호·질문 번호/전체 수·본문·상태·필요 타이머/허용 replay/답변 종료만 표시하며 내부 persona/type/전략은 유지하되 숨겼다.
- 실제 IN_PROGRESS checkpoint에만 이어하기/새 준비를 제공하고 자동 Interview 진입을 막았다. 새 준비는 질문팩 화면에 남고 해당 실행의 복구 안내만 접는다. 원래 checkpoint는 삭제하지 않으며 reload 후 이어할 수 있다. 이어하기는 세션의 원래 질문팩을 활성화한다.
- `/app/tts-lab`과 별도 `START_TTS_LAB.bat`, loopback 8767 stdlib API를 추가했다. 네 엔진은 각각 격리 환경, 한 번에 하나의 lazy subprocess만 로딩한다. 엔진 변경/해제/서비스 종료 시 worker를 종료하며 취소된 요청의 stale 메시지도 폐기한다. 기존 Interview TTS/STT/VAD/녹음/질문 엔진은 교체하지 않았다.
- 공식 CosyVoice3 0.5B-2512, GPT-SoVITS v2Pro, MeloTTS KR, Chatterbox Multilingual V3의 코드·dependencies·실제 가중치를 이 PC에 설치했다. 각 모델은 공통 한국어/영문 용어/숫자 문장 7개 + warm 10회 서버/브라우저 생성에 성공했다. 실제 첫 playing 이벤트, 모델별 전체 WAV 3회 ended, 평가 persistence, JSON/CSV export를 확인했다. 자동 평가 fixture는 최종 export에서 제거했다.
- Windows 이슈는 실제 오류 확인 후 해결했다: Cosy build constraint와 불필요한 zh/en wetext 초기화 제외, GPT의 MSVC 실패 후 공식 Windows embedded runtime/ffmpeg, Melo의 UniDic/BERT/NLTK 및 실제 MeCab-Ko Windows binding, Chatter의 명시적 V3/Perth 유지. Whisper는 Cosy upstream mel-feature dependency만 사용하며 ASR 가중치/STT 서비스는 도입하지 않았다.
- 모델·환경·캐시·생성 음성은 `local_runtime/tts`로 격리하고 .gitignore/source ZIP에서 제외했다. 라이선스·참조권한·설치 provenance·실측/재현을 TTS 문서와 `docs/tts-benchmarks` JSON/CSV에 기록했다. 초기 upstream NLTK 사용자 cache/uv bin 링크 생성은 숨기지 않고 환경 문서에 남겼으며 이후 bootstrap/cache 경로를 수정했다.

### 수정/추가 파일

- Runtime/UI: `app.js`, `runtime.js`, `styles.css`, `index.html`, `tts-lab.js`, `vite.config.ts`
- 실행/패키징: `.gitignore`, `START_TTS_LAB.bat`, `scripts/package-source.ps1`, `scripts/browser-smoke.mjs`
- TTS: `scripts/tts/bootstrap.ps1`, `install-engine.ps1`, `install-windows-gpt.py`, `download-models.py`, `verify-installation.py`, `prepare-melo.py`, `melo_windows.py`, `worker.py`, `server.py`, `benchmark.py`, `summarize-benchmarks.py`, test sentences/build constraint/API tests
- 문서: README, CODEX_START_HERE, STATE, TASKS, WORKLOG, UI_PHASE2A_PLAN, TTS_ENVIRONMENT/CANDIDATES/BENCHMARK, `docs/tts-benchmarks` 실제 JSON/CSV
- 기존 `START_MYEONYEOK.bat`, package dependency 계약, core_md 4종은 변경하지 않았다. 생성된 `public/phase1` bundle은 기존 소스로 재빌드했다.

### 실행한 확인

- PASS — 보호 복구 ZIP SHA-256 `CF2CCBEFB03C007EC8E613348CDDFC8358E772D8C580AC04A193FCB20ADFD6AC`; 기존 PHASE 1 release ZIP hash도 변경 없음.
- PASS — `core_md` 4종을 baseline ZIP 내용과 SHA-256 대조하여 동일함을 확인했다.
- PASS — `npm run typecheck`, `npm test` 4 files/27 tests, `npm run build`, JS syntax/Python compile, stdlib API tests 10.
- PASS — production/dev 실제 Chrome: 기본 질문팩/active 시작, deep link/reload, Home/SVG 보존, 두 Pack/오류/삭제 fallback/Settings, Device/Interview 숨김 정보, checkpoint 새 준비·보존·이어하기, Result/History/평가용 ZIP. 페이지 JS 예외·console error 0.
- PASS — 실제 START_MYEONYEOK.bat 8765 경로에서 같은 전체 흐름. report `.agent/verification/bat-browser-smoke-report.json`.
- PASS — 네 neural 모델 최종 브라우저 report 각각 17/17, warm 10/10, 전체 WAV 3회, ratings/notes persistence, JSON/CSV 다운로드. 실제 지연은 `docs/TTS_BENCHMARK.md` 및 원값에 있다. 음질 점수/순위를 만들지 않았다.
- PASS — 엔진 해제 후 실제 worker 프로세스 0, VRAM이 desktop 수준으로 반환됨(관측 예: 311 MiB 사용/7646 MiB free). venv redirector와 base Python pair는 같은 worker임을 구분했다.
- PASS — source ZIP의 myeok root/core_md 4종/weight·venv·cache·audio 제외, 별도 clean extraction `npm ci`/타입/27 tests/build/production/dev. clean Python bootstrap과 실제 별도 TTS BAT에서 네 후보 NOT_INSTALLED, active_engine=null을 확인했다.
- PASS — TTS 서비스를 실제 종료한 상태의 production/dev 전체 면접 smoke 및 Lab 연결 불가/Browser 경로 유지. 미설치/연결 불가는 구분한다.
- BLOCKED — Browser baseline: local Heami ko-KR 목록/Windows 출력 장치는 존재하지만 headed Chrome 실제 클릭·직접 native Speech API 모두 start/end 이벤트가 없다. 120초 Lab timeout 및 20초 native probe events=[]를 기록했다. Edge fallback은 CDP 초기 종료여서 대체 PASS로 쓰지 않았다. 지연을 추정하지 않았으며 전체 PHASE 2A 완료를 주장하지 않는다.
- USER_DEFERRED — 물리 마이크 품질, 실제 청취 발음/자연스러움/선호도, 최종 TTS 선택. 자동 마이크 회귀는 fake device, neural playback은 실제 WAV/browser 이벤트이다.

### 남은 작업

- 일반 사용자 Chrome에서 Browser baseline의 실제 재생/이벤트를 확인하고 필요한 OS/브라우저 음성 문제를 해결한다. ASR/STT 교체나 다른 유료 TTS로 우회하지 않는다.
- 사용자가 같은 TEST 음성을 듣고 평가/메모를 저장한다. 특히 영문 약어/소수점/백분율 발음은 합성 성공만으로 정확하다고 판정하지 않는다.
- 다음 지시에서만 사용자 선택 TTS를 실제 면접 Runtime에 통합하고 UI를 재조정한다. Passive Filler, Silero, 대규모 React migration은 여전히 이번 범위 밖이다.
- 배포 source ZIP은 `release/myeok-phase2a.zip`, 최종 digest는 ZIP 밖의 `release/myeok-phase2a.sha256.txt`와 전달 메시지로 관리한다. 모델과 생성 WAV는 현재 PC local_runtime에 남아 있으며 ZIP은 깨끗한 source 배포본이다.

## 2026-10-03 — 사용자 청취 결과 반영: 기본 TTS 확정·답변 녹음·메인 화면

### 완료 내용

- 최신 사용자 판단(한국어 품질/중국어 혼입/지연 부적합)이 이전 합성 성공 지표보다 우선한다. neural 모델 비교를 종료하고 기본 브라우저 SpeechSynthesis로 확정했다. 위 PHASE 2A 기록은 과거 이력이며 현재 모델/환경이 남아 있다는 뜻이 아니다.
- 작업 전 AGENTS/TASKS/WORKLOG와 실제 파일·운영 지침을 확인하고 실제 BAT 앱 baseline 화면/소스 ZIP을 보존했다. `docs/BROWSER_TTS_RECORDING_PLAN.md`를 제품/CSS 수정 전에 작성했다.
- TTS Lab UI/route/classic script/BAT/API/worker/install/benchmark와 모델·격리 Python/venv·캐시·WAV·로그·실험 문서를 제거했다. 실제 서비스/worker를 먼저 종료했다. 이전 배포 ZIP은 `.agent/recovery/obsolete-phase2a`로 이동해 복구 가능하며 변경 전 소스 ZIP도 보존했다. 삭제한 모델 가중치/환경은 소스 ZIP에 없고 복원이 필요하면 별도 재다운로드가 필요하다.
- 광범위한 package-check 전체 삭제는 일반 소스까지 포함해 auto-review가 거부했다. 대상을 좁혀 TTS 전용 부분만 정리했고 일반 검증 복사본/사용자 데이터/공유 사용자 캐시는 보존했다. 활성 소스·현재 배포에는 실험실 설치/실행 경로가 없다.
- 면접관별 실제 한국어 목소리, 성별 선호, 자동/차분/따뜻/단호/기본 말투, 속도/높낮이, 미리 듣기를 추가했다. canonical Settings에 저장하고 프리셋 변경에도 보존한다. 목소리의 실제 성별 제공 한계를 안내하며 높낮이를 성별 변환으로 설명하지 않는다. 로컬 우선/온라인 표시, 긴 문장 분할, 시작/종료 watchdog과 화면 질문 대체를 구현했다.
- 답변 시작부터 실제 MediaRecorder로 녹음하고 질문 재생 중 일시 정지한다. 마지막 dataavailable/stop을 기다려 기존 Session store에 Blob을 저장한다. 자연 종료/부분 오류/늦은 callback/중복 종료를 처리하고 면접 중단도 현재 답변을 보존한다. 화면 이탈에는 확인을 받고 저장 후 마이크/AudioContext를 해제한다. 답변 도중 강제 탭 종료의 미확정 데이터 한계는 문서화했다.
- Result 첫 요약에 질문별 오디오 재생, 개별 파일 저장, 녹음 전체 ZIP을 추가하고 History/새로고침에서도 복기한다. 기존 평가 ZIP에도 동일 원본 audio를 포함한다. 객체 URL/플레이어를 정리하고 WebM 길이/seek를 준비한다. 미녹음/미지원/부분 오류/저장 실패는 안내한다. 새로운 결과는 요약부터 열고 시작 버튼은 handler가 준비된 뒤 활성화한다.
- `/`·`/home`에 짧은 히어로/기존 SVG/3단계 안내/면접 준비 CTA를 추가했다. CTA는 항상 질문팩이며 자동 면접 시작을 하지 않는다. 절제된 청색과 여백/카드/경계선으로 스타일을 통일하고 기존 컴팩트 UX·모바일 메뉴·키보드 focus를 유지/보강했다. 실제 데스크톱/390px 모바일 및 IAB 메인 화면을 직접 검토했다.

### 수정/추가/삭제 파일

- Runtime/UI: `app.js`, `runtime.js`, `styles.css`, `index.html`, `vite.config.ts`
- TS/검증: `src/phase1/speech.ts`, `recording.ts`, `browserBridge.ts`, `tests/speech.test.ts`, `recording.test.ts`, `scripts/browser-smoke.mjs`, 재빌드한 `public/phase1/index.js`/map
- 실행/문서: `.gitignore`, `scripts/package-source.ps1`, README, CODEX_START_HERE, STATE, TASKS, WORKLOG, UI_PHASE2A_PLAN, BROWSER_TTS_RECORDING_PLAN
- 삭제: `tts-lab.js`, `START_TTS_LAB.bat`, `scripts/tts`, `docs/TTS_ENVIRONMENT.md`, `TTS_CANDIDATES.md`, `TTS_BENCHMARK.md`, `docs/tts-benchmarks`, `local_runtime/tts`, TTS 전용 검증 artifacts
- 기존 일반 BAT, dependency 계약, Pack/HANDOFF schema, core_md 4종, STT/Silero/React 기본 구현은 변경하지 않았다.

### 실행한 확인

- PASS — 변경 전 소스 ZIP `.agent/recovery/browser-tts-recording-baseline-20261003.zip`, SHA-256 `A07FD7E21400E6E12683334A85B932D1B65169DE1045FFC7B0E382082066A71F`; 실제 변경 전 화면 `.agent/browser-tts-baseline`.
- PASS — `core_md` 4종 SHA-256이 baseline과 동일, active source/build의 실험실/서비스/모델 코드 제거 확인.
- PASS — JS syntax, `npm run typecheck`, `npm test` 6 files/45 tests, `npm run build`. classic script의 Vite 경고는 기존 raw serving/production copy로 처리하며 절대 TS bundle import/fxEvent null guard를 유지한다.
- PASS — production 74 / 실제 Vite dev 78 / 실제 BAT 앱 76 checks, 페이지 예외·console error 0. 초기 dev 시작 버튼의 handler 준비 타이밍 실패는 재현 후 비활성→준비 후 활성화로 수정했고 재실행 PASS. ZIP 검사에서는 기존 `handoff_schema` 필드를 그대로 검증했다. 마지막으로 목소리 없음의 화면 대체/실제 표시 모드/tts_used=false 회귀 3항목을 추가했고 최종 결과는 release sidecar에 기록한다(실제 출력 성공 검사와 구별).
- PASS — 메인/모바일/Pack validation·활성화·삭제 fallback/Settings·음성 설정 persistence/프리셋 보존/Device/Interview/checkpoint·비파괴 새 준비/중도 종료·중복 종료/화면 이탈 취소·종료/새 결과 요약/녹음 off·미지원.
- PASS — 실제 MediaRecorder Blob 2개 저장, 새로고침 후 SHA-256 동일, 유한한 실제 길이/0초 시작, 끝까지 재생(ended, readyState=4), History 복기. 개별 오디오·녹음 ZIP·평가 ZIP에서 모든 audio bytes가 저장 원본과 동일하고 HANDOFF 1.1 참조/질문 대응 안내가 유지됨.
- BLOCKED — 기본 TTS 실제 출력: Heami local ko-KR가 열거되지만 headed Chrome 실제 클릭에서 events=[], start-timeout. IAB 실제 미리 듣기도 실패. Audio 서비스 Running은 확인했으나 원인을 확정하지 않았고 OS 설정/보안/드라이버는 바꾸지 않았다. 목록/파라미터/설정 저장/녹음 오디오 재생 성공을 질문 TTS 출력 PASS로 취급하지 않는다.
- USER_DEFERRED — 실제 사람의 마이크 음질, 일반 사용자 브라우저에서 TTS 청취. 자동 녹음 회귀는 Chrome fake media device의 실제 MediaRecorder 파일이며 물리 마이크를 임의로 녹음하지 않았다.

### 남은 작업·전달

- 사용자 일반 브라우저 환경 점검의 목소리 미리 듣기와 실제 3문제 답변 녹음/다운로드를 확인한다. 원하는 성별 목소리의 실제 제공 여부도 사용자 기기에서 확인한다.
- 기본 TTS 실제 출력은 BLOCKED로 남기고 완전한 음성 품질 검증 완료를 주장하지 않는다. 다른 모델/유료 서비스/OS 변경으로 임의 우회하지 않는다.
- 현재 소스 배포본은 `release/myeok-browser-tts-recording.zip`. 최종 SHA-256/clean extraction 검증은 ZIP 밖의 `release/myeok-browser-tts-recording.sha256.txt`, `.verification.json`에 기록해 자기 해시 순환을 피한다.
- Silero/STT 교체, Passive Filler, 전면 React 이전은 이번 요청에 포함하지 않았다. 과거 WORKLOG/복구 소스 ZIP은 현재 실행 환경이 아니다.

## 2026-10-03 — GitHub 기반 및 Pages 공유

### 완료 내용·수정 파일

- Git Credential Manager의 기존 로그인 계정 `gunpodoman`을 확인하고 사용자 승인으로 공개 `myeok` 저장소를 생성했다. Codex GitHub 플러그인 없이 로컬 Git으로 commit/tag/push한다. 인증 토큰은 메모리에서만 사용하고 출력·소스 저장하지 않는다.
- `index.html`, `app.js`, `runtime.js`, `vite.config.ts`: Pages의 `/myeok/` base와 hash routing을 추가하고 로컬 Vite의 기존 경로를 유지한다. TS bridge와 엔진 다운로드 경로도 동일 base를 사용한다.
- `.github/workflows/pages.yml`: main push마다 npm ci/타입/단위 테스트/빌드 후 dist만 Pages에 게시한다.
- `.gitignore`: 녹음·로컬 환경·비밀 설정·.agent/배포 ZIP 제외. `docs/GITHUB_PAGES.md`, README, AGENTS, TASKS에 버전 백업 절차를 기록했다.
- Git 폴더 소유권/실행 계정 차이는 이 신뢰된 프로젝트 경로에 한정한 `git -c safe.directory=C:/project/myeok`로 처리한다. 전역 Git/Windows 보안 설정은 변경하지 않았다.

### 실행한 확인·남은 확인

- PASS — Git 2.54/GCM 계정, 공개 저장소 생성, 타입 검사, 45 단위 테스트, Pages base 빌드.
- 최초 push/태그와 원격 Actions/공개 URL의 실제 결과는 이어지는 인계 기록에 남긴다. 기존 기본 TTS 실제 출력/물리 마이크 사용자 확인은 그대로 남아 있다.
- localhost의 IndexedDB 데이터는 Pages origin으로 자동 이전되지 않는다. 공유하는 것은 앱이며 사용자의 질문팩/녹음은 공개하지 않는다.

### 최종 결과

- PASS — 로컬 Git push로 `gunpodoman/myeok` main과 `v0.1.0` 업로드. 최초 커밋 `1a2fe27`.
- PASS — 원격 Actions 37113980638, attempt 2 success. 첫 실행은 Pages 활성화 전 configure-pages에서 실패했고 활성화 후 같은 실행을 재시도하여 성공했다.
- PASS — https://gunpodoman.github.io/myeok/ HTTP 200, 실제 공개 브라우저에서 메인→질문팩 `#/app/packs` 이동 및 새로고침 정상, canonical 모듈 초기화 오류 없음.
- PASS — 로컬 기존 경로 production smoke 77 checks, 페이지 예외/console error 0. 타입/45 단위 테스트와 원격 Linux 빌드도 통과.
- 전달: 공개 사이트 https://gunpodoman.github.io/myeok/ · 소스/버전 https://github.com/gunpodoman/myeok · 운영 규칙 docs/GITHUB_PAGES.md. 신규 기능 변경 없이 Git/Pages 기반만 구성했다.
