# PHASE 2A UI 계획

이 문서는 이전 UI 변경의 기록이다. 최신 `/` 메인·기본 TTS·녹음 복기 결정은 `BROWSER_TTS_RECORDING_PLAN.md`를 따른다. TTS 실험 부분은 사용자 결정으로 제거됐다.

작성일: 2026-10-03. 현재 Vite 앱의 실제 브라우저 화면을 `.agent/phase2a-baseline`에 캡처하고 검토한 뒤 작성했다.

## 공통 흐름

이전 단계에서 `/`와 `/app/import`는 `/app/packs`로 연결했다. 저장된 active Pack이 있어도 첫 화면은 질문팩이었다. 현재 `/`·`/home`은 새 메인이며 이전 Dashboard는 내부 `/app` 경로로 보존한다. Sidebar의 질문팩·면접 설정·면접 기록·도움말 구조는 유지한다.

한 화면에 하나의 Primary Action을 둔다. 정상 초기화 배너, 영문 장식 문구, 불필요한 badges와 기술 metadata를 제거한다. 오류는 짧게 안내하고 세부 코드는 펼쳐보기로 유지한다. button/link에는 hover와 focus-visible을 제공한다.

## 화면별 변경

| 화면 | 핵심 목적 | Primary Action | Secondary Action | 삭제/숨김 | 유지 | 현재 문제와 이번 범위 |
|---|---|---|---|---|---|---|
| 질문팩 | 현재 사용할 Pack 확인·변경·추가 | 현재 Pack으로 면접 설정 | 다른 Pack 선택, 새 JSON 추가, 질문팩 생성 안내, 작은 Demo 링크 | ready 배너, 기본 schema/hash/id/generator, Dashboard 링크 | validation 오류 종류, Dexie active/persistence/delete fallback | Import와 Library가 분리되어 있고 기술 상태가 과다 노출됨. 현재 선택을 상단에 두고 같은 화면에 업로드를 통합 |
| 면접 설정 | 면접 환경 결정 | 환경 점검 | 질문팩 변경, 세부 설정 펼치기 | 반복 설명, 큰 장식 summary | 프리셋, 모든 기존 설정과 persistence | 프리셋과 긴 세부 설정이 동시에 경쟁함. 프리셋은 button, 세부 설정은 details로 이동 |
| Device Check | 마이크와 면접 가능 여부 확인 | 점검 전: 점검 시작 / 점검 후: 면접 시작 | 설정으로 돌아가기 | 영어 장식, 정상 저장소 ready 카드, 기본 RMS/IndexedDB 기술 설명 | mic meter, mic/STT/Browser TTS 점검, 실패와 품질 한계 안내 | 상태 카드가 기술명을 설명함. 사용자에게 필요한 상태만 남기고 기술 한계는 details |
| Interview | 질문을 듣고 답변 | 답변 완료 | 허용된 다시 듣기, 면접 종료 | persona values/traits/id, 질문 type/relation/difficulty/trigger, live 기술상태 | 면접관 번호, 질문 번호·전체 수, 본문·답변 상태·타이머·녹음/STT 내부 동작 | I01/EVIDENCE 등이 보임. 표시만 변경하고 상태 머신·질문 전략은 유지 |
| Result | 답변 복기·평가 자료 저장 | 평가용 ZIP | 탭 전환, 다시 준비, 평가 엔진 받기, 기술 내보내기 | 중복 ZIP CTA, 영어 장식, 기본 handoff/raw metadata | 실제 지표·질문별·타임라인·전사·Export | 기본 화면에 기술 품질 카드와 중복 CTA가 있음. 품질/원자료는 details로 이동 |
| History | 지난 면접 결과 확인 | 결과 보기 | 두 세션 비교, 질문팩으로 새 면접 준비 | Pack internal id, 영어 장식 | 실제 날짜·시간·질문 수·상태 | 기술 id를 표시함. 사용자 제목과 실제 기록만 표시 |

## Session recovery

실제 `IN_PROGRESS` checkpoint가 있을 때만 질문팩 화면에 이어하기/새 면접 준비 선택을 제공한다. 자동 Interview 진입은 하지 않는다. 새 준비는 활성 Runtime만 초기화하고 질문팩 화면에 남아 현재 질문팩을 다시 확인하게 한다. 해당 실행에서 복구 안내를 접지만 저장된 checkpoint는 삭제하지 않아 기존 답변을 보존한다. 새로고침 후에는 다시 이어할 수 있다. 이어하기는 해당 세션의 원래 질문팩을 활성화한다.

## 검증

이전 UI 검증: inline Import 오류, Pack 변경/삭제, 설정 persistence, recovery 선택, Interview 숨김 정보, Result/History/ZIP, dev/production deep-link. 현재 변경의 검증 기준은 새 계획 문서를 따른다.
