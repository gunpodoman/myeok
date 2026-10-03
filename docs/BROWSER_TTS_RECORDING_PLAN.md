# 기본 TTS·녹음 복기·메인 화면

## 현재 결정 — 2026-10-03

최신 사용자 청취 결과가 이전 bake-off 지표보다 우선한다. neural TTS 실험은 종료하고 브라우저 SpeechSynthesis만 사용한다. PHASE 2A의 UI 단순화, canonical Dexie, 질문팩 계약과 기존 면접/STT/평가 ZIP은 보존한다.

## 이번 변경

- TTS Lab UI, 서비스, 설치/모델/벤치마크 파일 및 전용 런타임을 제거한다. 과거 WORKLOG와 복구 ZIP은 변경 이력으로 보존한다. 검증용 복사본은 일반 소스를 지우지 않고 TTS 전용 부분만 제거한다.
- 면접관별 한국어 목소리, 성별 선호, 말투, 속도, 높낮이를 설정하고 미리 듣는다. 브라우저에 실제 열거된 목소리만 사용한다. 설치되지 않은 성별과 감정 합성을 약속하지 않는다. 로컬 목소리를 우선하고 원격 목소리는 구분한다.
- 답변 시작부터 완료까지 실제 마이크 오디오를 녹음한다. 마지막 dataavailable 후 Blob을 저장하고, 중도 종료/중복 종료/자연 종료/질문 다시 듣기를 안전하게 처리한다. MIME에 맞는 확장자를 사용한다.
- 결과 첫 화면에서 질문별 재생·개별 파일 저장·녹음 ZIP을 제공한다. 평가 ZIP의 오디오도 유지한다. 새로고침 후 재생, 미녹음 상태, 저장 실패를 명확히 안내한다. 로컬 저장 안내와 녹음 끄기를 제공한다.
- `/`에 짧은 메인 화면을 만든다. 기본 CTA는 항상 `/app/packs`; 활성 질문팩 유무로 면접을 자동 시작하지 않는다. `/home`은 같은 메인, `/app/import`는 질문팩 별칭이다. 기존 컴팩트 메뉴를 유지한다.
- 기존 SVG 브랜드와 코드/CSS를 사용한다. 짧은 히어로와 3단계 안내, 절제된 청색 강조, 읽기 좋은 간격을 사용한다. 모바일/키보드/줄바꿈도 확인한다.

## 검증·복구

- 변경 전 소스: `.agent/recovery/browser-tts-recording-baseline-20261003.zip`, SHA-256 `A07FD7E21400E6E12683334A85B932D1B65169DE1045FFC7B0E382082066A71F`.
- 실제 변경 전 화면: `.agent/browser-tts-baseline`; 기본 앱 실제 BAT URL의 Chrome smoke PASS.
- 타입·단위·빌드, production/dev/BAT 브라우저 경로, 실제 MediaRecorder Blob·재생·새로고침·오디오/평가 ZIP을 확인한다. 자동 녹음 검증은 fake microphone을 사용하며 실제 사용자 목소리/스피커 품질과 구별한다.
- 녹음은 IndexedDB에 보존하지만 답변 도중 새로고침/탭 강제 종료는 마지막 녹음을 확정할 수 없다. 완료한 답변은 checkpoint로 보존한다. 녹음 다운로드를 권장한다.
- 참조: [SpeechSynthesisVoice](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisVoice), [MediaRecorder stop event](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/stop_event), [Windows 한국어 목소리](https://support.microsoft.com/ko-kr/accessibility/windows/narrator/appendix-a-supported-languages-and-voices). API의 성별 속성은 없으며, 확인된 공급자 이름만 성별 매칭에 사용한다.
