# 面逆力 Codex 인계

PHASE 1은 2026-09-27에 완료됐고 2026-09-28 실제 사용자 안정화 패스를 마쳤다. 다음 작업자는 먼저 `AGENTS.md`, `docs/TASKS.md`, `docs/WORKLOG.md`, `.agent/STATE.md`를 읽는다.

2026-10-03 최신 사용자 결정: 로컬 모델의 한국어 품질·지연이 실제 프로젝트에 맞지 않아 TTS 실험을 종료했다. 기본 브라우저 SpeechSynthesis로 확정하고 면접관별 목소리·성별 선호·말투·속도·높낮이 설정, 답변 녹음 복기, 간결한 메인 화면을 추가했다. 현재 계획은 `docs/BROWSER_TTS_RECORDING_PLAN.md`다. 이전 테스트 성공은 한국어 음질 합격을 의미하지 않는다.

`/`와 `/home`은 짧은 메인, 준비 CTA는 `/app/packs`, `/app/import`도 질문팩 별칭이다. Dashboard는 내부 `/app` 보존이다. `app.js`/`runtime.js` classic script의 Vite dev raw serving/production copy, `/phase1/index.js` 절대 import와 fxEvent null guard를 유지한다. TTS Lab UI/BAT/service/scripts/models/cache/benchmark는 제거됐다. 과거 소스 ZIP은 `.agent/recovery`의 복구 자료일 뿐 현재 배포가 아니다.

목소리 설정과 녹음 lifecycle은 `src/phase1/speech.ts`, `recording.ts`에서 지원한다. 음성 선택은 실제 한국어 목록만 사용하고 없는 성별은 안내한다. 긴 질문 분할·재생 실패 watchdog·화면 대체를 유지한다. 녹음은 마지막 dataavailable/stop 이후 질문 Blob으로 저장하며 중도 종료와 자연 종료를 처리한다. Result에서 재생·개별 파일·녹음 ZIP·기존 평가 ZIP을 제공하고 객체 URL을 해제한다. 기존 Session store에 Blob을 비파괴 보존한다.

제품 규격은 `core_md`의 4개 문서다. 최신 사용자 제공본으로 질문 엔진 v1.2, 평가 엔진 v1.4, HANDOFF v1.2를 교체했다. 파일명은 `question-engine-v1.2.md`, `evaluation-engine-v1.4.md`, `evaluation-handoff-v1.2.md`이며 원문 bytes는 보존한다. 마스터가이드 v4.0은 그대로다. Pack schema는 1.0, generator는 기존 1.0/최신 1.2를 허용한다. 평가 ZIP은 HANDOFF 1.2와 원본 질문팩/복수 근거 snapshot/배열 신호를 내보내며 기존 저장 세션은 비파괴 변환한다. 실제 사이트 runtime/difficulty 버전은 기존 weighted/presets 구현을 정직하게 기록하며 문서 부록의 신규 정책 전체 구현으로 주장하지 않는다. 개발 운영 규칙은 `harness_v8.txt`다. `CODEX_PHASE1_PROMPT.md`는 PHASE 1의 범위와 완료 상태를 기록한다.

현재 기본 앱은 `index.html` + `app.js` + `runtime.js`다. Pack/Settings의 canonical 구현은 `src/phase1` TypeScript/Zod/Dexie 계층이고, 브라우저에는 `public/phase1/index.js`로 연결된다. `src/react`와 `react-foundation.html`은 안전한 병행 전환 기반으로만 존재한다.

다음 실행에서 PHASE 2가 명시되지 않았다면 범위를 임의로 확장하지 않는다. PHASE 2를 시작할 때도 기존 면접 Runtime, Route, IndexedDB 데이터를 보존하고 회귀 검증 후 점진적으로 이전한다.

```powershell
npm install
npm run typecheck
npm test
npm run build
npm run smoke:browser
npm run smoke:dev
```

최신 상태와 증거는 `.agent/STATE.md`, `.agent/verification/browser-smoke-report.json`, `.agent/verification/dev-browser-smoke-report.json`에 있다. 실제 물리 마이크 음질은 USER_DEFERRED다. 이 PC에서는 Heami가 열거되지만 headed Chrome의 native TTS가 start-timeout, IAB 미리 듣기도 실패하여 실제 출력은 BLOCKED다. 목소리 목록/설정 persistence나 녹음 오디오 재생을 질문 TTS 출력 PASS로 바꾸지 않는다. 사용자 일반 브라우저에서 미리 듣기를 확인하고, 요청 없이 OS 설정 변경/다른 모델 재설치로 우회하지 않는다.
