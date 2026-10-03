# GitHub 백업·공유

- 저장소: https://github.com/gunpodoman/myeok (public)
- 공유 사이트: https://gunpodoman.github.io/myeok/
- `main` push마다 Actions가 타입/단위 테스트 후 빌드하여 Pages에 게시한다.
- 최초 버전은 `v0.1.0`. 후속 업데이트는 검증 후 commit, 새 버전 tag, push로 보존한다. 기존 tag를 덮어쓰거나 force-push하지 않는다.

```powershell
git add .
git commit -m "변경 내용"
git tag -a v0.1.1 -m "변경 내용"
git push origin main
git push origin v0.1.1
```

이 PC의 폴더 소유권과 실행 계정이 다르면 각 명령을 `git -c safe.directory=C:/project/myeok ...`로 실행한다. 전역 safe.directory나 자격 증명 저장 방식을 바꾸지 않았다.

Pages는 `/myeok/` 아래의 hash 주소(`#/app/packs`)를 사용해 새로고침 404를 피한다. 로컬 Vite의 기존 주소는 유지한다. 기존 localhost의 질문팩/녹음은 공개 사이트로 자동 이전되지 않으며 각 브라우저 origin에 별도로 저장된다. `.agent`, 환경·녹음·배포 ZIP·비밀 설정은 Git에서 제외한다.

기본 TTS와 물리 마이크의 기존 사용자 확인 사항은 그대로다.
