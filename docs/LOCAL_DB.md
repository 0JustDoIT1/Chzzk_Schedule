# 로컬 개발 DB

## 관리자 계정과 제보 제한 (2026-11-18)

백엔드에는 `ADMIN_REVIEW_USERNAME`(단일 관리자 계정명), `ADMIN_REVIEW_PASSWORD`(32자 이상 비밀번호), `ADMIN_WRITE_TOKEN`(32자 이상 서버 내부 서명 비밀값)을 설정한다. 프런트에는 백엔드 주소인 `API_URL`을 설정한다. 비밀값을 브라우저용 `NEXT_PUBLIC_` 변수에 넣지 않는다. 기존 공유 비밀번호만 설정한 환경은 새 계정명과 백엔드 비밀번호를 설정하기 전까지 로그인할 수 없다. 기존 세션 쿠키는 새 로그인 방식에서 무효가 된다.

제보 제한은 `submission_limits`, 로그인 실패 제한은 `admin_login_limits` 컬렉션에 기간별 카운터를 저장한다. 각 컬렉션의 `key` 고유 인덱스와 `expiresAt` TTL 인덱스를 사용한다. 기존 `submissions`에는 선택적 `fingerprint`와 `reviewedBy` 필드를 추가한다. 새 제보의 `fingerprint`는 대기·처리 중에만 고유하며, 과거 제보 문서는 값이 없어 유지된다. 배포 전에 DB 백업을 확보하고 인덱스 생성 결과를 확인한다. 되돌릴 때는 이전 코드로 복귀하고 신규 컬렉션·필드는 그대로 두어 제보 및 검수 기록을 보존한다. 인덱스나 데이터를 자동 삭제하지 않는다.

IP 판정에는 서버가 직접 확인하는 접속 주소를 사용한다. 역방향 프록시 뒤에서는 신뢰할 프록시와 실제 사용자 IP 전달 설정을 배포 시 검증해야 한다. 이를 하지 않으면 여러 사용자가 프록시 주소 하나의 한도를 공유할 수 있다.

Docker Desktop을 실행한 뒤 저장소 루트에서 `docker compose up -d mongodb`를 실행한다. MongoDB는 이 컴퓨터의 `127.0.0.1:27017`에서만 접근할 수 있고, 데이터는 Docker 이름 붙은 볼륨 `mongodb_data`에 보존된다.

`apps/back-end/.env`의 DB 설정을 다음처럼 지정한다. 이 파일은 Git에 포함하지 않는다.

```dotenv
DB_URI=mongodb://127.0.0.1:27017
DB_Name=Chzzk
```

이후 `yarn.cmd dev`를 실행하고 `http://localhost:3000`에서 화면을 확인한다. `docker compose ps`로 DB 상태를, `docker compose logs mongodb`로 DB 로그를 확인할 수 있다. `docker compose stop mongodb`는 데이터를 보존한다. `docker compose down --volumes`는 볼륨과 로컬 데이터를 삭제하므로 사용하지 않는다.

새로 만든 로컬 DB는 처음에 빈 상태다. 기존 Atlas 데이터가 자동으로 이동하지 않는다. 기존 데이터나 백업을 찾으면 별도 백업을 먼저 확보하고, 격리된 DB에 복원해 문서 수와 ID를 확인한 다음 가져온다. 기존 복제 일정은 자동 병합하지 않는다. 이 로컬 DB를 운영 DB나 격리 테스트 DB로 사용하지 않는다.

개발용 기본 스트리머 328명과 나무위키 분류 문서 제목 후보 1,659개는 `apps/back-end`에서 다음 명령으로 추가할 수 있다. 공개 랭킹 또는 개별 치지직 채널·방송 기록에서 이름과 채널 ID를 대조한 스트리머만 공개 컬렉션에 들어간다. 이름이 일치하거나 문서 구분자·검토된 활동명 연결로 채널을 확정한 후보 326개에는 `channel-verified` 상태와 채널 ID를 기록한다. 나머지 1,333개는 `unverified` 상태로 보관한다. [후보 대조 기록](./STREAMER-CATALOG-AUDIT.md)에 세부 건수와 미연결 파트너 후보가 있다. 후보 컬렉션은 공개 API가 읽지 않는다. `--apply`를 빼면 변경 없이 추가 예정 건수를 확인한다. 재실행은 중복을 추가하지 않는다. 이 기본 스트리머 시드는 예정 일정을 생성하지 않는다. 아래의 세 일정 시드를 모두 적용하면 공개 스트리머 333명, 예정 일정 26건이다.

```powershell
$env:DB_URI='mongodb://127.0.0.1:27017'
$env:DB_Name='Chzzk'
node scripts/seed-starter-streamers.js --apply
node scripts/import-namu-streamer-candidates.js --apply
node scripts/seed-pubgm-upcoming-schedules.js --apply
node scripts/seed-chzzk-cup-2026-schedules.js --apply
node scripts/seed-november-2026-featured-broadcasts.js --apply
node scripts/audit-namu-streamer-candidates.js
```
