# 로컬 개발 DB

Docker Desktop을 실행한 뒤 저장소 루트에서 `docker compose up -d mongodb`를 실행한다. MongoDB는 이 컴퓨터의 `127.0.0.1:27017`에서만 접근할 수 있고, 데이터는 Docker 이름 붙은 볼륨 `mongodb_data`에 보존된다.

`apps/back-end/.env`의 DB 설정을 다음처럼 지정한다. 이 파일은 Git에 포함하지 않는다.

```dotenv
DB_URI=mongodb://127.0.0.1:27017
DB_Name=Chzzk
```

이후 `yarn.cmd dev`를 실행하고 `http://localhost:3000`에서 화면을 확인한다. `docker compose ps`로 DB 상태를, `docker compose logs mongodb`로 DB 로그를 확인할 수 있다. `docker compose stop mongodb`는 데이터를 보존한다. `docker compose down --volumes`는 볼륨과 로컬 데이터를 삭제하므로 사용하지 않는다.

새로 만든 로컬 DB는 처음에 빈 상태다. 기존 Atlas 데이터가 자동으로 이동하지 않는다. 기존 데이터나 백업을 찾으면 별도 백업을 먼저 확보하고, 격리된 DB에 복원해 문서 수와 ID를 확인한 다음 가져온다. 기존 복제 일정은 자동 병합하지 않는다. 이 로컬 DB를 운영 DB나 격리 테스트 DB로 사용하지 않는다.

개발용 기본 스트리머 51명과 나무위키 분류 문서 제목 후보 1,659개는 `apps/back-end`에서 다음 명령으로 추가할 수 있다. 이름과 치지직 채널 링크를 대조한 51명만 공개 스트리머 컬렉션에 들어간다. 후보 가운데 이름이 정확히 일치하는 36개에는 `channel-verified` 상태와 채널 ID를 기록한다. 나머지 1,623개는 `unverified` 상태로 보관한다. 후보 컬렉션은 공개 API가 읽지 않는다. `--apply`를 빼면 변경 없이 추가 예정 건수를 확인한다. 재실행은 중복을 추가하지 않는다. 이 목록은 로컬 개발용이며 예정 일정을 생성하지 않는다.

```powershell
$env:DB_URI='mongodb://127.0.0.1:27017'
$env:DB_Name='Chzzk'
node scripts/seed-starter-streamers.js --apply
node scripts/import-namu-streamer-candidates.js --apply
```
