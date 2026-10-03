# 面逆力

[공유 사이트](https://gunpodoman.github.io/myeok/) · [GitHub 저장소](https://github.com/gunpodoman/myeok)

`main` 업데이트는 테스트 후 GitHub Pages에 자동 배포된다. 버전별 백업과 로컬 실행/Pages 주소 차이는 [GitHub 안내](docs/GITHUB_PAGES.md)를 따른다.

학생부 기반 `INTERVIEW_PACK/1.0`으로 면접을 연습하고, 내 답변을 녹음해 다시 듣는 로컬 우선 웹 앱이다. 사용자의 실제 한국어 청취 결과에 따라 실험 모델은 폐기하고 기본 브라우저 TTS로 확정했다. 간결한 메인 화면에서 질문팩 → 설정 → 환경 점검 → 면접 → 녹음 복기로 이어진다.

## 현재 authoritative 앱

- 기본 앱: `index.html` + `app.js` + `runtime.js`
- Pack 계약/검증/저장: `src/phase1`의 TypeScript + Zod + Dexie 구현
- PHASE 1 브라우저 어댑터: 빌드된 `public/phase1/index.js`
- React 기반: `react-foundation.html`, `src/react`에 병행 구축했으나 기존 면접 기능의 회귀를 피하기 위해 아직 기본 앱으로 전환하지 않았다.

## 기술 스택

- TypeScript, Zod, Dexie
- Vite, Vitest
- React, React Router(병행 전환 기반)
- 기존 Vanilla JS 면접 Runtime
- Web Crypto, IndexedDB, MediaRecorder, Web Audio, Web Speech API

모든 핵심 dependency는 API key나 유료 서버가 필요 없다. 정적 빌드이므로 Cloudflare Pages 같은 무료 정적 호스팅과 호환된다.

## 설치와 실행

Node.js가 설치된 Windows에서 `START_MYEONYEOK.bat`을 실행하거나 다음 명령을 사용한다.

```powershell
npm install
npm run dev
```

기본 주소는 `http://127.0.0.1:8765`다. `/`와 `/home`은 메인 화면이며 면접 준비 버튼은 항상 `/app/packs`로 연결한다. 활성 질문팩이 있어도 면접을 자동 시작하지 않는다. `/app/import`는 질문팩 별칭, `/app` Dashboard는 내부 호환 경로로 보존한다. 별도 TTS 서버·Python·모델 설치는 필요 없다. `start_server.py`는 기존 호환 파일로만 보존한다.

## 질문 음성과 답변 녹음

- 설정의 **면접관 음성 → 목소리·말투 조절**에서 면접관별 성별 선호, 실제 한국어 목소리, 말투, 속도(0.7–1.3배), 높낮이(0.7–1.3)를 조절하고 미리 듣는다. 프리셋 변경은 음성·녹음 설정을 덮어쓰지 않는다.
- 브라우저에 열거된 한국어 목소리만 사용하며 로컬 음성을 우선한다. 직접 선택한 목소리가 성별 선호보다 우선한다. 원하는 성별이 없으면 현재 목소리로 읽고 안내한다. 말투는 속도·높낮이 조합이며 감정 합성이나 성별 변환이 아니다.
- 자동 말투는 질문팩의 면접관 성격/압박 경향을 반영한다. 긴 질문은 문구를 바꾸지 않고 짧게 나누어 읽는다. 음성 시작/종료 실패는 대기 제한 후 화면 질문으로 대체한다.
- 답변 녹음은 기본 켜짐이다. 마이크 입력을 답변 시작부터 완료까지 기록하며 질문 낭독·준비 시간은 녹음하지 않는다. 질문 다시 듣기 중에는 녹음을 일시 정지한다. 설정에서 끌 수 있다.
- 결과 요약에서 **내 답변 다시 듣기**, **음성 파일 저장**, **녹음 모두 저장 ZIP**을 사용한다. 평가용 ZIP에도 같은 원본 오디오가 포함된다. 녹음은 IndexedDB에 질문별 Blob으로 보존되어 새로고침 및 면접 기록에서도 재생할 수 있다.
- 실제 지원 포맷에 따라 WebM/Opus, MP4(M4A), Ogg를 사용한다. 확장자를 임의로 MP3/WAV로 바꾸거나 재인코딩하지 않는다.

목소리 목록과 실제 출력은 브라우저/OS에 따라 다르다. [Web Speech API에는 성별 속성이 없다](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisVoice). 성별 매칭은 확인된 Microsoft 목소리 이름에 한정한다. [Windows 기본 한국어 목소리는 Heami(여성)](https://support.microsoft.com/ko-kr/accessibility/windows/narrator/appendix-a-supported-languages-and-voices)이며 남성 음성 제공 여부는 기기 환경에 달려 있다. 온라인으로 표시된 목소리와 STT는 외부 음성 서비스를 사용할 수 있다.

면접을 종료하면 현재 답변까지 확정하여 저장한다. 앱 내 다른 화면 이동/뒤로 가기에는 종료를 확인하고 현재 답변까지 저장한 뒤 마이크를 해제한다. 답변 도중 새로고침·탭 강제 종료는 진행 중인 녹음을 복구할 수 없으며 완료한 답변만 checkpoint에 남는다. 정상 새로고침에는 경고를 제공한다. 브라우저 데이터 삭제·시크릿 모드·저장 공간 부족에 대비해 중요한 녹음은 다운로드한다. 저장 실패는 결과 화면에서 경고하고 내려받을 수 있게 한다.

## 검증 명령

```powershell
npm run typecheck
npm test
npm run build
npm run smoke:browser
npm run smoke:dev
```

`smoke:browser`는 production `dist`, `smoke:dev`는 실제 Vite 개발 서버를 사용한다. 격리된 Chrome 프로필에서 메인/모바일/주요 Route, Pack/Settings/음성 설정 영속성, 삭제 fallback, 장치 점검, Interview, checkpoint, 중도 종료 시 마지막 녹음, Blob SHA-256 보존, 실제 녹음 전체 재생, 개별/녹음 ZIP/평가 ZIP 다운로드, 미녹음/미지원 상태를 확인한다. `--capture-ui`는 화면, `--app-url=http://127.0.0.1:8765`는 실제 실행 중인 앱을 검증한다. `--headed --native-voice-check`는 실제 기본 TTS 미리 듣기 결과를 별도로 보고한다. 자동 마이크와 실제 사람의 음질을 혼동하지 않는다.

## 수동 사용자 확인

1. `START_MYEONYEOK.bat`을 실행하고 메인의 면접 준비하기를 누른다.
2. 질문팩 화면의 파일 선택으로 실제 `interview-pack.json`을 추가한다. Demo는 작은 테스트용 보조 동작이다.
3. 새로고침 뒤 active Pack이 유지되는지 확인하고, Pack 활성화·삭제를 한 번씩 시험한다.
4. Setup에서 목소리를 미리 듣고 녹음 켜짐을 확인한다. Device Check에서 실제 마이크 권한을 허용한다.
5. 면접을 3문제 이상 진행하며 TTS 재생과 STT 인식이 서로 방해하지 않는지 듣고 확인한다.
6. Result에서 녹음을 재생하고 개별 파일/녹음 ZIP을 내려받는다. 새로고침 및 History에서도 들어보고 평가용 ZIP을 보관한다.

자동 검증은 fake media device를 사용한다. 실제 물리 마이크 음질 확인은 `USER_DEFERRED: physical microphone quality test`다.

현재 PC의 기본 TTS는 Heami 한국어 목소리를 열거하지만 headed Chrome의 실제 클릭 검사에서 시작 이벤트 없이 `start-timeout`, IAB 미리 듣기도 실패했다. **실제 TTS 출력 검증은 BLOCKED**이며 음성 설정/녹음 재생 검사를 출력 성공으로 취급하지 않는다. 사용자 일반 브라우저에서 환경 점검의 미리 듣기를 확인해야 한다. 음성 실패 시 질문은 화면으로 표시된다.

## PHASE 1 구현 범위

- 공식 enum과 strict object를 사용하는 `INTERVIEW_PACK/1.0` TypeScript/Zod 계약
- 구조 검증과 분리된 의미 검증 및 한국어 오류/개발자 상세
- 질문·근거·면접관 ID 중복, 참조, ROOT/FOLLOWUP, 직접 부모, self reference, cycle, trigger, 범위, integrity 검사
- 원본 byte sequence 기준 Web Crypto SHA-256(64자리 lowercase hex)
- 기존 `myeonyeokryeok_v1` DB와 `packs`, `sessions`, `settings` store를 유지하는 Dexie abstraction
- 원본 JSON/bytes, parsed Pack, hash, 메타데이터, 검증 상태를 보존하는 Pack service
- 다중 Pack, SHA 중복 처리, 활성화, 삭제, active fallback
- 실제 repository 기반 Import/Library/Settings UI
- 기존 raw IndexedDB 및 legacy localStorage 데이터의 비파괴 호환 처리
- 누락된 SVG 참조 수정과 HTTP deep-link 새로고침 경로 수정
- 기존 면접, 결과, History, HANDOFF/CSV/ZIP 기능 보존

## 데이터와 호환 정책

- canonical DB: 브라우저 IndexedDB `myeonyeokryeok_v1`
- canonical Pack/Session/Settings API: `Phase1StorageService`
- active Pack과 면접 설정의 기준: Dexie `settings`
- legacy localStorage: 이전 Runtime 호환에 필요한 값만 service 내부에서 mirror한다. 충돌 시 Dexie 값이 우선한다.
- 기존 raw IndexedDB 레코드는 같은 DB/store에서 명시적으로 normalize하며 삭제하지 않는다.

브라우저 프로필을 삭제하면 로컬 데이터도 삭제된다. 중요한 결과와 녹음을 ZIP으로 내보내 보관한다. 학생부 원문과 녹음을 이 앱의 서버로 전송하지 않는다. 단, STT 및 온라인 표시 목소리의 외부 처리는 별개다.

## 현재 보존된 면접 기능

마이크 점검, TTS, MediaRecorder, Web Speech STT, RMS 기반 간이 발화/침묵 측정, 응답 시간과 pause/CPM/filler 추정, seed 기반 질문 선택, 기존 follow-up, 중간 체크포인트, 결과/비교, `INTERVIEW_EVAL_HANDOFF/1.1` 및 평가용 ZIP을 보존했다.

Silero VAD는 아직 연결하지 않았다. 현재 발화 구간은 RMS 기반이며 결과에 `vad_mode: DISABLED`와 부분 품질로 기록된다. Web Speech API는 브라우저/OS 구현에 따라 온라인 처리를 사용할 수 있다.

## 다음 Phase

기본 TTS 확정은 현재 결정이다. 폐기한 neural 모델을 다시 설치하거나 연결하지 않는다. React 전체 이전, STT 교체, Silero 신규 작업, Passive Filler Observation은 이번 작업 범위가 아니다. 현재 React foundation은 준비 자산일 뿐 기본 앱이 아니다.

제품 명세는 `core_md`의 4개 문서다. 안정화 패스에서는 데이터 계약을 유지한 채 질문 생성 엔진 문서 하나에 첨부 즉시 실행 규칙과 행동 수준 Acceptance Test만 보강했다. 작업 상태와 검증 증거는 `.agent/STATE.md`, `docs/WORKLOG.md`, `.agent/verification`에 있다.
