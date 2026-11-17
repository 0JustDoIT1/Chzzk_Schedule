# 0군의 삶 — 작업·검증 기록

## 2026-11-17 김호러 채널과 본명 후보 연결

- 변경 파일: `apps/back-end/data/verified-chzzk-channels.json`, `apps/back-end/data/verified-namu-title-aliases.json`, `docs/STREAMER-CATALOG-AUDIT.md`, `docs/LOCAL_DB.md`, `docs/DEVLOG.md`. [김호러의 공개 채널 소개](https://tubemon.io/channel/UC_SEr4lmF69s2-c6oY1qkoA)에 본명 김효종과 치지직 채널 주소가 함께 기재되어 있고, [방송 기록](https://inbangmo.com/viewership/streamer/chzzk/59cbccdbc14b3e9318e0d477a35c64c5)에서 동일한 32자리 ID와 최근 방송을 확인했다. `김효종(1992)` 후보를 김호러 채널에 연결했다.
- 검증: 후보 감사 결과 연결 326건(이름 일치 229, 문서 구분자 제거 44, 검토한 별칭 53), 대기 1,333건. 로컬 공개 스트리머 1명과 후보 연결 1건을 추가했다. 공개 스트리머 333명, 일정 26건이다. 운영 DB와 배포 환경은 변경하지 않았다.
- 남은 위험: 남은 파트너 후보 7명은 채널 ID 또는 문서 제목의 정확성을 더 확인해야 한다. 이번 채널 연결은 미래 방송 예정을 뜻하지 않는다. 되돌릴 때는 이번 채널 ID의 로컬 스트리머 문서와 후보 연결을 개별 검토 후 제거하고 해당 시드 항목을 복원한다.

## 2026-11-17 농심 FC 온라인 선수 채널 연결

- 변경 파일: `apps/back-end/data/verified-chzzk-channels.json`, `apps/back-end/data/verified-namu-title-aliases.json`, `docs/STREAMER-CATALOG-AUDIT.md`, `docs/LOCAL_DB.md`, `docs/DEVLOG.md`. [치지직 FC 온라인 선수 채널](https://chzzk.naver.com/home/esports/FCO)에서 NS RYUK와 NS Exito를 확인했다. [RYUK 치지직 채널](https://chzzk.naver.com/52fd9d4ab4e019ada4576ae81a2ec78e)과 [Exito 방송 기록](https://streamrecorder.io/it/czk/a55bc2d4504e55c5f248a80475e60538)의 32자리 ID를 시드에 추가하고, [농심 공식 선수단](https://www.ns-esports.com/page/28)에서 확인한 윤창근·윤형석 본명 후보를 연결했다.
- 검증: 후보 감사 결과 연결 325건(이름 일치 229, 문서 구분자 제거 44, 검토한 별칭 52), 대기 1,334건. 로컬 공개 스트리머 2명과 후보 연결 2건을 추가했다. 공개 스트리머 332명, 일정 26건이다. 운영 DB와 배포 환경은 변경하지 않았다.
- 남은 위험: 채널 연결은 미래 방송 예정을 보장하지 않는다. 남은 파트너 후보 8명은 채널 ID 또는 문서 제목의 정확성을 더 확인해야 한다. 되돌릴 때 이번 2개 채널 ID의 로컬 스트리머 문서와 후보 연결을 개별 검토 후 제거하고 해당 시드 항목을 복원한다.

## 2026-11-17 농심 발로란트 선수 채널 4개 연결

- 변경 파일: `apps/back-end/data/verified-chzzk-channels.json`, `apps/back-end/data/verified-namu-title-aliases.json`, `docs/STREAMER-CATALOG-AUDIT.md`, `docs/LOCAL_DB.md`, `docs/DEVLOG.md`. [농심 발로란트 팀 방송 안내](https://www.sotwe.com/hashtag/NONGSHIM?lang=en)에 게시된 채널 링크 중 Francis와 Xross의 단축 링크가 가리키는 32자리 치지직 ID를 확인했다. [NS Ivy 채널 기록](https://auro.live/creator/chzzk/3aef9a2c159402f5912509d583d46733)과 [NS UdoTan 치지직 채널](https://chzzk.naver.com/live/8831d52ab67ff94acde26137e6617452)을 함께 대조했다. [농심 공식 선수단](https://ns-esports.com/page/24)의 Francis 김무빈, Ivy 박성현, Xross 정환 연결을 후보 별칭에 기록했다.
- 검증: 후보 감사 결과 연결 323건(이름 일치 229, 문서 구분자 제거 44, 검토한 별칭 50), 대기 1,336건. 로컬 공개 스트리머 4명과 후보 연결 3건을 추가했다. 공개 스트리머 330명, 예정 일정 26건이다. 운영 DB와 배포 환경은 변경하지 않았다.
- 남은 위험: 팀 방송 공지는 방송 편성 시각을 특정하지 않아 일정을 생성하지 않았다. 미연결 파트너 후보 10명의 채널 ID는 추가 확인이 필요하다. 되돌릴 때는 이 4개 채널 ID의 로컬 스트리머 문서와 3건의 후보 연결을 개별 검토 후 제거하고 해당 시드 항목을 복원한다.

## 2026-11-17 농심 Rb·플러리 채널 연결

- 변경 파일: `apps/back-end/data/verified-chzzk-channels.json`, `apps/back-end/data/verified-namu-title-aliases.json`, `docs/STREAMER-CATALOG-AUDIT.md`, `docs/LOCAL_DB.md`, `docs/DEVLOG.md`. [농심 레드포스 발로란트 팀 방송 안내](https://x.com/nsr_valorant)와 [NS Rb 채널 기록](https://auro.live/creator/chzzk/67c0edbb3127f93271c552d1dc1e5341)으로 `NS Rb`의 ID를 확인했다. [플러리 방송 기록](https://inbangmo.com/viewership/streamer/chzzk/fe558c6d1b8ef3206ac0bc0419f3f564)에서 채널 ID를 확인했다. 본명 연결은 [구상민 문서](https://www.namu.moe/w/구상민(프로게이머))와 [조현수 인터뷰](https://times.seoultech.ac.kr/reports?category=34&idx=19511)를 대조했다.
- 검증: 후보 감사 결과 연결 320건(이름 일치 229, 문서 구분자 제거 44, 검토한 별칭 47), 대기 1,339건. 로컬 공개 스트리머 2명과 후보 연결 2건을 추가했다. 공식 편성 배너의 다른 방송은 채널을 특정하지 못해 일정 시드를 추가하지 않았다. 운영 DB와 배포 환경은 변경하지 않았다.
- 남은 위험: 채널 연결이 미래 방송을 뜻하지 않는다. 미연결 파트너 후보 13명은 별칭과 채널 ID의 추가 대조가 필요하다. 되돌릴 때는 이번 2개 채널 ID의 로컬 스트리머 문서와 후보 연결을 개별 검토 후 제거하고 해당 시드 항목을 복원한다.

## 2026-11-17 한화생명·브리온 파트너 채널 연결

- 변경 파일: `apps/back-end/data/verified-chzzk-channels.json`, `apps/back-end/data/verified-namu-title-aliases.json`, `apps/back-end/scripts/audit-namu-streamer-candidates.js`, `apps/back-end/scripts/seed-starter-streamers.js`, `docs/STREAMER-CATALOG-AUDIT.md`, `docs/LOCAL_DB.md`, `docs/DEVLOG.md`. [치지직 파트너 쇼케이스](https://chzzk.naver.com/partner)와 [브리온 팀 링크 모음](https://litt.ly/brionaf)의 채널 주소를 대조해 한화생명 4명과 브리온 5명을 시드에 추가했다. 선수 본명 9건은 [한화생명 선수단 보도](https://www.kfm.co.kr/news/2026101270503)와 [브리온 선수단 보도](https://www.kukinews.com/article/print/kuk202603260021)를 대조해 후보 별칭에 연결했다. 개별 채널 확인일을 후보 검증일에 기록하도록 시드를 수정했다.
- 검증: 후보 감사 결과 연결 318건(이름 일치 229, 문서 구분자 제거 44, 검토한 별칭 45), 대기 1,341건. 로컬 DB에 스트리머 9명과 후보 연결 9건을 적용했다. 공개 스트리머 324명, 예정 일정 26건. 운영 DB와 배포 환경은 변경하지 않았다.
- 남은 위험: 채널 연결은 향후 방송 일정이나 지속 활동을 보장하지 않는다. 미연결 파트너 후보 15명은 인물과 채널 ID를 추가 대조해야 한다. 새 시드의 되돌림은 이번에 추가한 9개 채널 ID의 로컬 `streamer` 문서와 해당 후보 연결 9건을 개별 검토 후 제거하고 시드를 이전 버전으로 복원하는 방식이다.

## 2026-11-16 카린 후보 문서 제목 연결

- 변경 파일: `apps/back-end/data/verified-namu-title-aliases.json`, `docs/STREAMER-CATALOG-AUDIT.md`, `docs/LOCAL_DB.md`, `docs/DEVLOG.md`. 파트너 분류에서 잘못 수집된 `분룬:카린(인터넷 방송인)`을 [카린 문서](https://d.namu.moe/w/카린(인터넷%20방송인))와 [소속사 채널 공지](https://charonuniverse.com/notice/?bmode=view&idx=166543713)의 동일 채널 ID를 확인해 기존 카린 채널에 연결했다. 공개 스트리머는 중복 생성하지 않았다.
- 검증: 후보 감사 결과 연결 309건(정확한 이름 229, 문서 구분자 제거 44, 검토한 연결 36), 대기 1,350건, 파트너 분류 연결 164건. 로컬 후보 DB에 감사를 적용했다. 공개 스트리머 315명과 일정 26건은 변경하지 않았다. 운영 DB는 변경하지 않았다.
- 남은 위험: 잘못 수집된 제목은 후보 원본에 남아 있다. 연결은 검토한 별칭으로만 적용되며 현재 파트너 자격이나 향후 방송 예정을 뜻하지 않는다.

## 2026-11-16 NCRC 결승 중계 채널 조사

- 변경 파일: `docs/DEVLOG.md`. [NCRC 공식 대회 안내](https://robotics.connect.or.kr/info)는 11월 22일 결승·시상식의 치지직 라이브 중계를 명시하고, [치지직 홈](https://chzzk.naver.com/)은 시작 시각 13:00을 표시한다. [기존 NCRC 영상](https://chzzk.naver.com/video/15867426)에서 채널명이 `NCRC`인 것도 확인했다.
- 검증: 공개 페이지와 검색 결과에서 채널 주소의 32자리 ID를 확인하지 못했다. 로컬 DB와 시드는 변경하지 않았다. 공개 스트리머 315명, 일정 26건을 유지한다.
- 남은 위험: NCRC라는 이름만으로 채널 ID를 추정하면 다른 채널에 연결될 수 있다. 공식 채널 링크가 확인되면 11월 22일 13시 일정의 중복 여부를 먼저 대조하고 추가해야 한다.

## 2026-11-16 느바라디오 예정 방송 추가

- 변경 파일: `apps/back-end/scripts/seed-november-2026-featured-broadcasts.js`, `docs/LOCAL_DB.md`, `docs/DEVLOG.md`. [치지직 홈](https://chzzk.naver.com/)과 [편성표](https://chzzk.naver.com/schedule?filterId=world_championship_2026)의 11월 17일 20시 방송을 로컬 일정에 추가했다. [치지직 채널](https://m.chzzk.naver.com/live/2a2aab576b0b60b408a21a3a6b370276)에서 채널 이름과 ID를 대조했다. 종료 시각은 미정이며 `isOfficial: false`로 저장했다.
- 검증: 적용 전 채널·일정 각각 1건 추가 예정, 적용 후 재실행 추가 0건. 시드 구문 검사 통과. 로컬 공개 스트리머 315명, 일정 26건. 운영 DB는 변경하지 않았다.
- 남은 위험: 공식 홍보 편성은 변경될 수 있다. NCRC 결승은 11월 22일 13시 생중계가 확인되지만 채널 ID를 확인하지 못해 추가하지 않았다.

## 2026-11-16 보이는 라디오볼 예정 방송 추가

- 변경 파일: `apps/back-end/scripts/seed-november-2026-featured-broadcasts.js`, `docs/LOCAL_DB.md`, `docs/DEVLOG.md`. [치지직 홈](https://chzzk.naver.com/)의 11월 20일 13시 삼성 이승민 출연 안내를 로컬 일정에 추가했다. [보이는 라디오볼 채널 기록](https://auro.live/creator/chzzk/96d54ad9945bd57c0bd1e7b3342f5985)으로 이름과 채널 ID를 대조했다. 종료 시각은 미정이며 `isOfficial: false`로 저장했다.
- 검증: 적용 전 채널·일정 각각 1건 추가 예정, 적용 후 재실행 추가 0건. 로컬 공개 스트리머 314명, 일정 25건. 운영 DB는 변경하지 않았다.
- 남은 위험: 치지직 홈의 홍보 편성이 바뀔 수 있다. 치지직컵의 ‘치지직게임’ 바로가기 ID는 아직 확인하지 못해 기존 11건의 채널 연결은 변경하지 않았다.

## 2026-11-16 치지직 홈의 예정 방송 2건 추가

- 변경 파일: `apps/back-end/scripts/seed-november-2026-featured-broadcasts.js`, `docs/LOCAL_DB.md`, `docs/DEVLOG.md`. [치지직 홈](https://chzzk.naver.com/)에 시작 시각이 표시된 11월 18일 18시 `워독스 삼국개전 2기`와 22시 `생방송 음악이 좋다 EP.03`을 로컬 일정에 추가했다. 첫 방송은 [대회 안내](https://inbangmo.com/live-events/samguk-gaejeon-2)에서 주최자 개복어를, 둘째 방송은 [우키팝 채널의 이전 회차 기록](https://inbangmo.com/viewership/streamer/chzzk/e137dc6f45461108f4e22d205f639218)에서 방송 채널을 대조했다. 두 건 모두 `isOfficial: false`이며 종료 시각은 미정이다. 우키팝 채널 1건도 로컬 스트리머 목록에 추가했다.
- 검증: 시드 `node --check` 통과. 적용 전 일정 2건·채널 1건 예정, 적용 후 재실행 추가 0건. 저장된 두 건의 KST 시작 시각, 일반 방송 분류, 종료 시각 미정 상태를 확인했다. 로컬 공개 스트리머 313명, 일정 24건. 운영 DB는 변경하지 않았다.
- 남은 위험: 치지직 홈의 홍보 편성은 변경될 수 있다. G-STAR·보라볼·NCRC 등은 방송 채널이 충분히 확인되지 않아 이번 시드에서 제외했다. 정기 방송이라는 이유만으로 다음 회차를 추정 생성하지 않았다.

## 2026-11-16 전체 위키 후보 대조

- 변경 파일: `apps/back-end/data/verified-namu-title-aliases.json`, `apps/back-end/scripts/audit-namu-streamer-candidates.js`, `apps/back-end/scripts/seed-starter-streamers.js`, `docs/STREAMER-CATALOG-AUDIT.md`, `docs/LOCAL_DB.md`, `docs/DEVLOG.md`. 1,659개 위키 문서 제목을 검증된 채널 310개와 한 번에 대조했다. 정확한 이름 229개, 문서 구분자 제거 44개, 검토한 본명·활동명 연결 35개로 후보 308개에 채널 ID를 연결했다. [대조 기록](./STREAMER-CATALOG-AUDIT.md)에 파트너 분류의 미연결 26개를 기록했다. 후보는 공개 API가 읽지 않는다.
- 검증: 감사 스크립트가 308개 연결·1,351개 대기를 계산했다. 로컬 시드를 재적용한 뒤 후보 컬렉션의 `channel-verified` 308건과 `unverified` 1,351건을 확인하고 모든 연결의 채널 ID를 시드와 대조했다. 공개 스트리머 312건, 일정 22건은 변경되지 않았다. 운영 DB는 변경하지 않았다.
- 남은 위험: 별칭 35개는 사람과 활동명 연결을 개별 검토한 목록이며 현재 파트너 자격을 뜻하지 않는다. 나머지 후보를 일괄 공개하면 이름 충돌·과거 채널 혼입 위험이 있다. 채널 ID가 확인되면 출처를 추가하고 감사를 다시 실행해야 한다.

## 2026-11-16 치지직컵 공식 일정 로컬 입력

- 변경 파일: `apps/back-end/scripts/seed-chzzk-cup-2026-schedules.js`, `docs/LOCAL_DB.md`, `docs/DEVLOG.md`. [치지직의 2026 치지직컵 페이지](https://chzzk.naver.com/event/chzzkcup2026)에 명시된 팀 드래프트, 풀리그, 그룹배틀, 플레이오프 진출전, 플레이오프의 11개 방송 날짜를 로컬 DB에 입력했다. [치지직 홈](https://chzzk.naver.com/)에 명시된 팀 드래프트 11월 19일 17시만 시작 시각을 설정하고, 다른 10건은 시간 미정으로 기록했다. 공식 페이지가 치지직 공식 채널 생중계를 명시하므로 공식 일정으로 분류했다. 공식 채널 ID는 [공식 채널 링크가 기재된 안내](https://puzzk.tistory.com/entry/치지직-치스티벌-폴가이즈-스트리머-대전-다주쌍베마왕루야따효니)와 [현재 방송 기록](https://inbangmo.com/viewership/streamer/chzzk/c42cd75ec4855a9edf204a407c3c1dd2)을 대조했다. 종료 시각은 공지되지 않았다.
- 검증: 시드 `node --check` 통과. 적용 전 11건 예정, 적용 후 재실행 추가 0건. 저장된 11건의 KST 날짜, 시각 확인 상태, 공식 분류를 대조해 1건만 시각 확인·10건은 시간 미정임을 확인했다. 로컬 DB 전체 일정 22건, 공개 스트리머 312명. 운영 DB는 변경하지 않았다.
- 남은 위험: 대회 일정과 시작 시각은 변경될 수 있다. 공식 스크림 11월 20~21일은 공식 페이지에 날짜만 있고 생중계 여부가 분명하지 않아 추가하지 않았다. 참가자별 합방 일정은 만들지 않았다.

## 2026-11-16 농심 레드포스 채널 일괄 대조

- 변경 파일: `apps/back-end/data/verified-chzzk-channels.json`, `docs/LOCAL_DB.md`, `docs/DEVLOG.md`. [농심 레드포스 영상 설명에 기재된 채널 링크](https://allsnsrank.com/youtube/video/mUhEv4EqMTU)에서 Kingen·Sponge·Scout·Calix·Diable·Lehends 6명의 이름과 채널 ID를 확인했다. 위키 파트너 후보의 황성훈·배영준·이예찬·선현빈·남대근·손시우와 연결해 로컬 목록에 추가했다. 이 출처는 선수 명단과 링크 확인용이며 미래 일정 근거는 아니다.
- 검증: 적용 전 추가 예정 6건, 적용 후 재실행 추가 0건. 시드 JSON의 310개 이름과 채널 ID가 각각 모두 고유하다. 로컬 DB 전체 공개 스트리머 312명(기본 시드 310명과 별도 PUBG·치지직 공식 채널), 후보 1,659건. 운영 DB는 변경하지 않았다.
- 남은 위험: 위키 본명 후보 전체를 채널 ID로 확정할 수 없다. 팀 소속과 파트너 자격은 바뀔 수 있으므로 이번 채널 등록만으로 공식 방송·현재 파트너 자격을 확정하지 않는다.

## 2026-11-16 프로게이머 본명 후보 2명 추가

- 변경 파일: `apps/back-end/data/verified-chzzk-channels.json`, `docs/LOCAL_DB.md`, `docs/DEVLOG.md`. 위키 후보의 최인석(프로게이머)=인섹, 최재원(프로게이머)=크랭크를 대조하고 [세모랭크 치지직 랭킹](https://www.semorank.kr/ranking/chzzk)의 각 방송명과 채널 ID를 확인해 로컬 시드에 추가했다. 이미 등록된 피닉스박 등은 중복 추가하지 않았다.
- 검증: 시드 적용 전 추가 예정 2건, 적용 결과 2건, 재실행 추가 0건. 로컬 DB `streamer` 305건(별도 PUBG MOBILE Esports KR 포함), `streamer_candidate` 1,659건, `schedule` 11건을 확인했다. `git diff --check` 통과. 운영 DB는 변경하지 않았다.
- 남은 위험: 본명과 활동명 연결은 위키 문서에 의존한다. 현재 파트너 자격과 미래 일정은 이 채널 확인만으로 확정하지 않았다.

## 2026-11-16 활동명 불일치 후보 4명 추가

- 변경 파일: `apps/back-end/data/verified-chzzk-channels.json`, `docs/LOCAL_DB.md`, `docs/DEVLOG.md`. 위키 후보의 본명 표기와 방송명을 대조했다. 서현석=소우릎, 김배인=와디드, 정노철=노페, 장현재=던으로 연결했다. [치지직 파트너 페이지](https://chzzk.naver.com/partner)와 [세모랭크 랭킹](https://www.semorank.kr/ranking/chzzk)에서 소우릎의 방송명·채널 ID를, [인방모 와디드](https://inbangmo.com/viewership/streamer/chzzk/bad6d7da33aec001343a51b85a70fcdb)·[노페](https://inbangmo.com/viewership/streamer/chzzk/f20881fce506174330ecb58342c4c70d)의 최근 방송과 ID를, [Cygames 공지](https://shadowverse-wb.com/cht/news/detail/?id=01KZWTFSSMQHP1CHS6JR12A3PG)의 던 채널 링크를 확인했다.
- 검증: 시드 JSON의 이름·채널 ID 각각 302개가 모두 고유하다. 로컬 DB 적용 전 추가 예정 4건, 적용 결과 4건, 재실행 추가 0건. 로컬 DB `streamer` 303건(별도 PUBG MOBILE Esports KR 포함), `streamer_candidate` 1,659건, `schedule` 11건을 확인했다. `git diff --check` 통과. 운영 DB는 변경하지 않았다.
- 남은 위험: 본명과 방송명 연결은 위키·외부 공개 자료에 의존한다. 채널 검증과 현재 파트너 자격 검증은 다르며, 예정 일정은 생성하지 않았다.

## 2026-11-16 파트너 활동명 채널 대조

- 변경 파일: `apps/back-end/data/verified-chzzk-channels.json`, `docs/LOCAL_DB.md`, `docs/DEVLOG.md`. 나무위키 파트너 후보의 본명 표기와 방송 활동명을 대조했다. 박의진=운타라, 배준식=뱅, 강형우=캡틴잭, 이성진=큐베, 이창석=갱맘, 김건우=Zeka로 확인하고 [세모랭크 치지직 랭킹](https://www.semorank.kr/ranking/chzzk)의 현재 채널명·ID를 다시 수집해 6개 채널을 로컬 시드에 추가했다. 본명 대응은 [나무모에 미러의 이성진 문서](https://www.namu.moe/w/이성진(프로게이머)?from=CuVee) 등 각 인물 문서를 참고했다. 이미 등록된 활동명 채널은 중복 추가하지 않았다.
- 검증: 적용 전 추가 예정 6건, 적용 후 재실행 추가 0건. 로컬 DB에서 `streamer` 299건(기본 298건과 별도 PUBG MOBILE Esports KR 1건), `streamer_candidate` 1,659건, `schedule` 11건을 확인했다. `git diff --check` 통과. 운영 DB는 변경하지 않았다.
- 남은 위험: 위키의 파트너 목록과 현재 파트너 자격은 별도로 확정하지 않았다. 시드는 채널만 등록하고 미래 일정을 추정 생성하지 않는다. 공개 랭킹의 채널명과 순위는 바뀔 수 있다.

## 2026-11-16 후보 채널 추가 확인

- 변경 파일: `apps/back-end/data/verified-chzzk-channels.json`, `apps/back-end/scripts/seed-starter-streamers.js`, `docs/LOCAL_DB.md`, `docs/DEVLOG.md`. [세모랭크 치지직 랭킹](https://www.semorank.kr/ranking/chzzk)의 공개 페이지에 표시된 이름과 채널 ID를 후보 제목과 대조해 두뭉·바테·꽁아·키유 4명을 로컬 스트리머 목록에 추가했다. 시드 적용 시 제목이 정확히 일치하는 후보에 `channel-verified`와 채널 ID·출처를 기록하도록 했다.
- 검증: 로컬 DB에 4건을 추가한 뒤 재실행 시 추가 0건. `streamer` 51건, `streamer_candidate` 1,659건 중 `channel-verified` 36건, 일정 0건을 확인했다. 운영 DB는 변경하지 않았다.
- 남은 위험: 후보 1,623건은 채널 ID를 확인하지 못했다. [치지직 공식 채널 API](https://chzzk.gitbook.io/chzzk/chzzk-api/channel)는 채널 ID 조회를 제공하지만 이름 검색은 제공하지 않아 후보 이름만으로 전체를 검증할 수 없다. 공개 랭킹의 채널명은 변경될 수 있다.

## 2026-11-16 나무위키 분류 전체 후보 수집
- 변경 파일: `apps/back-end/data/namu-chzzk-streamer-candidates.json`, `apps/back-end/data/namu-chzzk-subcategories.json`, `apps/back-end/data/namu-chzzk-subcategory-titles.json`, `apps/back-end/data/verified-chzzk-channels.json`, `apps/back-end/scripts/import-namu-streamer-candidates.js`, `apps/back-end/scripts/seed-starter-streamers.js`, `docs/LOCAL_DB.md`, `docs/DEVLOG.md`. 원본 나무위키는 열리지 않아 [나무모에 미러의 치지직 스트리머 분류](https://www.namu.moe/w/분류:치지직%20스트리머)와 파트너·챌린저·프로게이머 하위 분류를 읽었다. 첫 번째 사용자 링크의 `치지직#s-17`은 스트리머 명단이 아니라 외부 링크 절이다. 분류의 문서 제목과 하위 분류 제목을 합쳐 중복 없는 후보 1,659개를 수집했다. 미러는 원문에 [CC BY-NC-SA 2.0 KR](https://creativecommons.org/licenses/by-nc-sa/2.0/kr/) 표시를 한다. 이 저장소의 JSON은 문서 제목만 추출·중복 제거한 것이다.
- 데이터 구분: 후보 제목은 채널 ID나 현재 활동 여부를 보증하지 않는다. 로컬 `streamer_candidate`에만 `unverified`로 저장하고 공개 조회에서는 제외한다. [세모랭크 치지직 랭킹](https://www.semorank.kr/ranking/chzzk)의 현재 이름·채널 링크를 대조한 47명만 로컬 `streamer`에 등록했다. 공식 방송 분류나 예정 일정은 생성하지 않았다.
- 검증: 두 스크립트 `node --check` 통과. 적용 후 재실행 추가 0건. 로컬 DB 조회 결과 후보 1,659건 모두 `unverified`, 공개 스트리머 47건, 일정 0건. 운영 DB는 변경하지 않았다.
- 남은 위험: 미러의 일부 하위 분류는 갱신 시점이 서로 다르고 위키 문서 제목은 방송명과 다를 수 있다. 후보를 공개 데이터로 옮기려면 각 치지직 채널 링크와 이름을 확인해야 한다. 기존 Atlas 일정의 복원 문제는 해결되지 않았다.

## 2026-11-16 로컬 기본 스트리머 목록
- 변경 파일: `apps/back-end/scripts/seed-starter-streamers.js`, `docs/LOCAL_DB.md`, `docs/DEVLOG.md`. 사용자가 제공한 나무위키 두 페이지는 브라우징 도구에서 열리지 않았다. 대신 [세모랭크 치지직 랭킹](https://www.semorank.kr/ranking/chzzk)의 스트리머 이름과 각 상세 페이지의 치지직 채널 링크를 대조해 7명(한동숙, 랄로, 침착맨, 탬탬버린, 아야츠노 유니, 풍월량, 다주)의 로컬 개발용 시작 목록을 만들었다. 이는 공식 방송 분류나 예정 일정의 근거가 아니다.
- 검증: `node --check scripts/seed-starter-streamers.js` 통과. 변경 전 미리보기 7건, 로컬 `Chzzk` DB에 7건 추가, 재실행 추가 0건. 조회 결과 `streamer` 7건, `schedule` 0건이다. 운영 DB는 변경하지 않았다.
- 남은 위험: 나무위키의 해당 목록과 직접 대조하지 못했다. 채널명 변경·목록 누락 가능성이 있어 이 목록을 운영 데이터로 옮기기 전 최신 채널 정보를 다시 확인해야 한다.

## 2026-11-16 전체 테스트 게이트와 프런트 Hook 경고 정리
- 변경 파일: `apps/front-end/src/lib/hook/useCalendar.ts`, `apps/front-end/src/lib/hook/useMember.ts`, `apps/front-end/src/lib/hook/useScheduleInput.ts`, `docs/DEVLOG.md`. 달력의 파생 날짜 계산을 해당 effect 안으로 옮기고, 회원 목록 초기화 함수를 안정화해 Hook 의존성 경고를 해소했다.
- 검증: 백엔드 `yarn.cmd test --runInBand` 3개 스위트·11건 통과. 격리 로컬 MongoDB에서 `RUN_DB_INTEGRATION=1 yarn.cmd test:e2e --runInBand` 3개 스위트·5건 통과. 임시 통합 DB 목록은 비어 있다. 프런트 `yarn.cmd build` 통과했고 기존 Hook 의존성 경고 2건은 사라졌다.
- 남은 위험: 프런트 빌드에 `metadataBase` 미설정과 오래된 Browserslist 데이터 경고가 남아 있다. 브라우저 실화면 검증과 운영 데이터 검증은 아직 수행하지 않았다. 과거 검증 실패 기록은 당시 결과로 아래에 남겨 둔다.

## 2026-11-16 달력 일정 폭 계산 수정
- 변경 파일: `apps/front-end/src/lib/components/calendar/calendarScheduleOverlay.tsx`, `docs/DEVLOG.md`. 달력 막대의 폭을 경과 시간의 24시간 단위가 아니라 KST 날짜 수로 계산한다. 종료가 정확히 자정이면 전날까지로 계산하고, 앞 주에서 이어지는 일정은 현재 주의 첫 표시 날짜부터 폭을 잰다.
- 검증: 프런트 `yarn.cmd build` 통과. 격리 샘플 DB를 연결한 로컬 API에서 11월 29일 자정 종료 일정은 29일에만, 자정을 넘어가는 일정은 29·30일에, 시간 미정 일정은 30일에 조회됨을 확인했다. 서버를 종료하고 샘플 DB를 삭제했다. 기존 React Hook 의존성 경고 2건과 `metadataBase` 경고는 남아 있다.
- 남은 위험: 브라우저 도구가 로컬 컴퓨터 연결 오류로 열리지 않아 달력 막대의 실제 화면 검증은 수행하지 못했다.

## 2026-11-16 D-03 월별 경계 격리 DB 검증
- 변경 파일: `apps/back-end/test/schedule-month-boundary-db.e2e-spec.ts`, `docs/DEVLOG.md`. 월 시작 자정 종료 제외, 월말 자정 종료의 전날 배치, 종료 미정의 시작 날짜 배치를 전체·스트리머 ID·참여자 이름·공식 월별 API에서 검증한다.
- 검증: 로컬 Docker MongoDB의 임시 `chzzk_schedule_integration_` DB로 `RUN_DB_INTEGRATION=1 yarn.cmd test:e2e --runInBand test/schedule-month-boundary-db.e2e-spec.ts` 1건 통과. `yarn.cmd tsc --noEmit -p tsconfig.json` 통과. 테스트 종료 뒤 임시 DB 목록이 빈 배열임을 확인했다.
- 테스트 정리: 초기 시험 실행에서 앱 종료 전 DB를 삭제해 인덱스 생성으로 임시 DB 세 개가 다시 생겼다. 종료 순서를 고쳐 재실행하고, 그 세 DB를 확인 후 삭제했다. 로컬 `Chzzk` DB는 변경하지 않았다.
- 남은 위험: 실제 프런트 화면과 운영 데이터에서의 회귀 검증은 아직 수행하지 않았다.

## 2026-11-16 D-03 월별 날짜 경계 수정
- 변경 파일: `apps/back-end/src/schedule/schedule.service.ts`, `apps/back-end/src/schedule/schedule-date-boundary.spec.ts`, `docs/DEVLOG.md`. 월별 전체·스트리머별·공식 조회를 다음 달 시작 직전까지의 반열린 구간으로 맞췄다. 종료 시각이 KST 자정인 일정은 전날까지만 배치하고, 시작·종료 기준값이 같은 종료 미정 일정은 시작 날짜에 남긴다.
- 검증: `yarn.cmd test --runInBand schedule-date-boundary.spec.ts` 3건 통과, `yarn.cmd tsc --noEmit -p tsconfig.build.json` 통과.
- 남은 위험: 실제 화면 자동화와 운영 데이터 기반 회귀 검증은 수행하지 않았다. 로컬 DB는 빈 상태이며 운영 DB 데이터는 확인하지 못했다.

## 2026-11-16 D-06 데이터 접근 점검
- 변경 파일: `docs/D06-legacy-schedule-plan.md`, `docs/DEVLOG.md`. 기존 일정 후보 조사를 재개하기 위한 접근 상태와 다음 조사 조건을 기록했다.
- 검증: Git 작업 폴더가 깨끗한 상태에서 시작했다. 현재 백엔드 `.env`는 로컬 DB를 가리킨다(주소의 호스트만 확인). 저장소에서 백업·덤프 파일을 찾지 못했다. Docker Desktop을 시작해 기존 볼륨의 `Chzzk` DB를 읽기 전용으로 확인했으며 `streamer`, `submissions`, `schedule`은 각각 0건이다. 운영 DB는 조회하지 않았고 데이터 변경도 하지 않았다.
- 남은 위험: 운영 DB의 읽기 전용 접속 정보 또는 백업 위치가 없어 기존 일정의 건수·복제 후보·출처를 확인할 수 없다. 원본 선정과 이전 범위는 계속 미결정이다.

## 2026-11-13 로컬 개발 DB 준비

- 로컬 Docker DB 격리 검증(2026-11-13): `RUN_DB_INTEGRATION=1 yarn.cmd test:e2e --runInBand test/submission-db.e2e-spec.ts` 1건 통과. 승인 전 비공개, 승인 후 공개, 합방 참여자 동일 ID, 수정·취소·시간 미정, 공식 분류 권한, 반려를 확인했다. `yarn.cmd test --runInBand schedule-date-boundary.spec.ts` 2건 통과. KST 자정 경계와 잘못된 날짜 거부를 확인했다. 임시 `chzzk_schedule_integration_` DB가 남지 않았음을 조회했다. 프런트 화면 자동화와 운영 데이터 복원은 수행하지 않았다.
- 변경 파일: `compose.yaml`, `docs/LOCAL_DB.md`. 기존 Atlas 주소의 DNS 조회가 실패해 로컬 개발용 MongoDB 컨테이너와 실행 절차를 추가했다.
- 검증: `docker compose config --quiet` 통과. Docker Desktop을 시작해 `docker compose up -d mongodb`로 컨테이너를 실행했고 상태가 `healthy`다. 로컬 `apps/back-end/.env`의 DB 주소를 변경한 뒤 백엔드 기동을 확인했다. 프런트 `/`, 백엔드 `/api`, `/v1/streamer/all`, `/v1/schedule/date/2026-11-13` 모두 HTTP 200을 반환했다.
- 남은 위험: 새 DB는 빈 상태여서 조회 API가 빈 배열을 반환한다. 기존 Atlas 데이터와 백업의 존재 여부는 미확인이다. 운영 DB를 로컬 DB로 대체하거나 기존 복제 일정을 자동 병합하지 않는다.

> 이 문서는 현재 상태와 실제 검증만 기록한다. 요구사항 기준은 [PRD](./PRD.md)다. 날짜는 한국 시간 기준이다.

## 현재 상태 · 2026-11-12

D-08 게시 출처·변경 이력: 승인된 일정에 출처 URL과 게시·수정 이력을 저장하고 상세 화면에 표시한다. 수정 승인에는 변경 요약을 요구한다. 기존 일정은 과거 이력을 소급 생성하지 않으며 출처 미기록으로 표시한다. 공유 관리자 비밀번호로는 개인 검수자를 식별할 수 없어 이 항목은 D-05로 남긴다.

| 영역 | 확인된 구현 | 남은 일 / 제한 |
| --- | --- | --- |
| 공개 조회 | 오늘, 전체·공식·스트리머별 캘린더/타임라인, 상세. 시간 미정·취소 표시 | 전체 날짜 경계 회귀 테스트 추가 필요 |
| 제보 | 스트리머·일정 접수 저장, 확인 토큰으로 상태 조회 | 출처의 신뢰도·중복 제보 검수 규칙 미정 |
| 검수 | `/admin` 대기 목록과 승인·반려, 서버 측 쓰기 보호 | 단일 비밀번호·프로세스별 로그인 제한. 다중 관리자·공통 제한·감사 기록 없음 |
| 합방 | 신규 일정 한 문서, 참여자별 같은 ID 조회, 수정 승인 반영 | 기존 일정 없음(사용자 확인). 신규 일정의 회귀 검증 필요 |
| 치지직 연동 | 공식 API의 채널·현재 라이브 범위 조사 | 연동 구현 없음. 미래 일정 조회 API는 확인되지 않음 |
| 배포 | 로컬 개발·테스트 | 공개 배포·백업·오류 관측 미완료 |

## PRD와 구현의 차이 · 기획 재점검

| 우선 | 차이 | 확인한 코드 동작 | 기획에서 정할 것 |
| --- | --- | --- | --- |
| 확인 | 공식 방송 판정 | 공개 제보의 공식 지정은 서버가 거부하고, 관리자가 내용을 수정·분류한 뒤 출처 확인을 명시해야 승인된다 | 실제 출처 판정은 관리자 수동 검수에 의존 |
| 확인 | 출처와 변경 이력 | 승인된 일정에 출처와 변경 이력을 보존하고 상세 화면에 표시한다 | 개인 검수자 식별은 D-05에서 결정. 기존 일정은 과거 이력 없음 |
| 종료 | 기존 일정 이전 | 사용자가 기존 일정이 없다고 확인했다. 로컬 DB의 기존 일정 0건은 별도로 확인했다 | D-06은 v1 범위에서 제외. 향후 기존 일정 발견 시 재검토 |
| 확인 | 시간과 취소 | 시작 날짜 필수, 시각 확정 플래그와 취소 상태 추가. 취소는 기존 날짜에 유지 | 기존 일정은 시각 확정·예정으로 해석. 전체 날짜 경계 회귀 테스트 필요 |
| 2 | 제보 남용 | 공개 제보 API에 요청량 제한이 없다 | 익명 제보 제한 기준과 차단·관리 절차 |
| 2 | 스트리머 식별 | 이름과 링크 중심이며 공식 `channelId`를 저장하지 않는다 | 이름 변경·중복·기존 링크 이전 (`D-07`) |
| 3 | 품질 게이트 | 백엔드 단위 테스트와 프런트 프로덕션 빌드는 통과. 배포 환경 검증은 미완료 | 출시 전 필수 명령과 배포 검증 범위 |

이 표는 구현 완료를 뜻하지 않는다. PRD에서 결정한 뒤 코드와 검증 기준을 갱신한다.

## 검증 기록

- 품질 게이트 정리(2026-11-12): 현재 기능과 무관한 기본 생성 테스트 6개를 제거했다. 백엔드 Jest 3개 스위트·10개 테스트와 전체 `tsc --noEmit -p tsconfig.json` 통과. 프런트의 기존 린트 오류와 스트리머 목록의 조건부 훅 호출을 수정했고 `next build` 통과. 검색 파라미터 사용 화면은 Suspense 경계를 추가했으며 `/streamer`는 빌드 중 API 대기를 피하도록 동적 렌더링으로 전환했다. 프런트 빌드에는 훅 의존성 경고 2건과 `metadataBase` 경고가 남는다. 브라우저 자동화, 격리 DB 통합 테스트, 배포 환경 검증은 수행하지 않았다.

- D-03 날짜 경계 추가 검증(2026-11-12): 일별 조회에서 KST 자정 시작, 종료 시각이 자정인 전날 일정 제외, 다음날 자정 시작 제외, 기존 문서의 누락된 `startTimeKnown`을 확정 시각으로 해석하는 격리 단위 테스트 2건을 통과했다. 존재하지 않는 날짜가 다른 날짜로 넘어가던 입력을 HTTP 400으로 거부하도록 수정했다. 백엔드 `tsc --noEmit -p tsconfig.build.json` 통과. 원격 DB DNS 문제로 격리 DB 통합 검증과 화면 자동화 검증은 수행하지 못했다.
- 백엔드 전체 Jest 실행은 8개 스위트 중 3개 통과, 5개 실패했다. 실패는 기존 기본 생성 테스트의 의존성 미주입 4개와 제거된 `getHello` 호출 1개다. `tsc --noEmit -p tsconfig.json`은 기존 테스트 파일 2개의 타입 오류로 실패했다. 빌드 대상 타입 검사는 통과했다.

- D-03: 공유 타입·백엔드 빌드와 프런트 타입 검사 통과. 격리 MongoDB 제보 통합 테스트에서 시간 미정 일정의 날짜 조회와 취소 승인 후 공개 상태·변경 이력을 확인했다. 프런트 전체 빌드와 화면 자동화 검증은 아직 수행하지 않았다.

- D-08: 공유 타입·백엔드 빌드, 프런트 타입 검사, 제보 서비스 단위 테스트 5개와 격리 MongoDB 제보 통합 테스트를 통과했다. 통합 테스트에서 최초 게시와 수정 승인 후 출처, 변경 요약, 버전 및 변경 필드를 확인했다.

- 백엔드 빌드와 프런트엔드 `tsc --noEmit` 통과.
- 관리자 쓰기 가드·제보 서비스 단위 테스트와 제보 HTTP 테스트 통과.
- 격리된 로컬 MongoDB 복제 세트에서 익명 직접 쓰기 거부, 제보 승인 전 비공개, 승인 후 공개, 반려 후 비공개를 확인했다.
- 같은 격리 DB에서 참여 스트리머 2명의 달력이 **같은 신규 일정 ID**를 표시하고, 수정 제보 승인 후 참여자 달력에도 수정 내용이 반영됨을 확인했다. 테스트 DB와 임시 컨테이너는 정리했다.
- 공개 제보의 공식 지정은 HTTP 400으로 거부되고, 공식 분류로 수정한 제보는 관리자의 출처 확인 표시 없이는 HTTP 400, 표시 후에만 공식 달력에 나타나는 것을 격리 DB에서 확인했다.
- 원격 MongoDB `justdoit.qj9gt.mongodb.net`의 `Chzzk` DB 연결은 DNS 조회 단계에서 실패했다. 운영 데이터의 내용·중복 현황은 확인하지 못했다.
- 프런트엔드 전체 빌드는 기존 ESLint 오류로 중단됐다. 백엔드 전체 단위 테스트는 기존 기본 테스트와 Jest 경로 설정 문제로 실패했다. 통과한 표적 테스트를 전체 품질 게이트 통과로 취급하지 않는다.
- Git 커밋·푸시는 하지 않았다. 이 환경에서는 Git의 `dubious ownership` 검사 때문에 상태 조회도 실패했다.

## 결정과 변경 이력

D-03: 시작 날짜 필수, 시작 시각·종료 시각 미정 플래그, 취소 상태를 추가했다. 미정 시각의 날짜 조회 기준값은 실제 시각으로 표시하지 않는다. 종료 미정은 시작 날짜에만 노출하고 취소는 원래 날짜에 유지한다. 기존 문서는 플래그 부재를 시각 확정·예정 상태로 해석한다. 복구는 승인된 수정으로 처리해 이력을 보존한다.

| 날짜 | 항목 | 근거·영향 |
| --- | --- | --- |
| 11-12 | v1은 공개 제보 → 관리자 검수 → 게시 | 사용자와 합의한 운영 방향. 즉시 공개 저장을 제보 접수로 분리 |
| 11-12 | 공식 API를 예정 일정 공급원으로 가정하지 않음 | 공식 문서에서 채널·현재 라이브 조회는 확인, 미래 편성표 조회는 확인되지 않음 |
| 11-12 | 서버 쓰기 API를 관리자 토큰으로 보호 | 제보 기능 전까지 무인증 쓰기를 막고, 이후 승인만 공개 데이터 변경 |
| 11-12 | 접수 확인 토큰을 무작위로 발급 | 제보 DB ID를 공개 상태 조회 키로 사용하지 않음 |
| 11-12 | 신규 합방 일정 단일 원본 | 참여자별 문서 복제가 수정 결과를 갈라놓던 문제를 줄임 |
| 11-12 | 기존 복제 일정 자동 병합 보류 | 같은 제목·시각의 별개 방송을 잘못 합칠 수 있음. 읽기 전용 후보 조사 도구만 작성 |
| 11-12 | 문서 체계 정리 | `AGENTS.md` 작업 기준, `PRD.md` 제품 기준, `DEVLOG.md` 사실 기록으로 분리 |
| 11-12 | D-01 공식 방송 판정 확정 | 치지직 직접 주최·공식 채널 공지 기준. 방문자 공식 선택 제거, 관리자 수정·재분류 및 명시적 확인 후 게시 |

## 다음 작업의 시작점

2026-11-18 화면 문구·검증 점검: `apps/front-end/src/app/layout.tsx`의 문서 언어를 실제 한국어 UI에 맞춰 `ko`로 바꾸고, `apps/front-end/src/lib/constants/metaTag.ts`의 기본 설명을 즉시 일정 생성으로 오해하지 않도록 조회·제보 문구로 수정했다. 프런트 프로덕션 빌드는 통과했다. 오래된 Browserslist 데이터와 `metadataBase` 미설정 경고가 남는다. 공개 사이트 주소가 정해지면 메타데이터 기준 URL을 설정해야 한다. Docker 엔진에 연결할 수 없고 서비스 시작도 실패해 격리 DB 통합 테스트는 이번에 실행하지 못했다. 실제 브라우저 화면과 배포 환경 검증도 남아 있다.

2026-11-18: 사용자가 기존 일정이 없다고 확인했다. D-06 기존 일정 이전·복제 후보 조사는 v1 작업에서 제외한다. 과거의 원격 DB 접근 실패 기록은 당시 사실로 아래에 보존한다. 이 확인은 기존 스트리머 후보나 현재 로컬 개발 DB의 신규 일정이 없다는 뜻은 아니다.

2026-11-18 검증: Yarn 4.9.2 의존성을 잠금 파일 그대로 설치한 뒤 백엔드 Jest 전체 3개 스위트·11개 테스트, 백엔드 빌드, 프런트 프로덕션 빌드를 통과했다. 프런트 빌드에는 `metadataBase` 미설정 경고가 남았다. 격리 DB 통합 테스트, 실제 브라우저 화면, 배포·백업·오류 관측은 이번 작업에서 실행하지 않았다. 변경 파일은 `docs/PRD.md`, `docs/DEVLOG.md`, `docs/D06-legacy-schedule-plan.md`이며, 기존 일정이 없다는 확인을 기획 범위와 작업 순서에 반영했다. 남은 위험은 운영 정책 미결정과 실제 환경 검증 미실행이다.

D-06 원본 선정·이전 검토안은 [별도 문서](./D06-legacy-schedule-plan.md)에 기록했다. 2026-11-12 읽기 전용 조사 스크립트를 실행했으나 MongoDB SRV DNS 조회가 시간 초과되었고, 권한을 높인 재시도에서는 연결이 거부되어 운영 후보 목록은 확인하지 못했다. 운영 데이터 변경은 없었다.
후보 조사 출력에 원본 비교에 필요한 주최자·참여자 ID, 종료 시각, 분류, 본문, 출처와 수정 시각을 추가했다. `node --check`와 격리된 `node --test apps/back-end/scripts/audit-legacy-schedules.test.js`(1건)를 통과했다. 원격 DB 대상 실행과 후보별 검토는 연결 문제로 미완료다.

1. D-05·D-09 관리자 권한·감사와 제보 남용 제한 정책을 결정한다. D-01의 공식 판정은 관리자가 수동으로 한다.
2. 신규 일정의 생성·수정·반려·취소·합방 표시와 날짜 경계를 격리 DB 및 브라우저에서 검증한다.
3. 전체 빌드·테스트 게이트와 배포 환경, 백업·복구, 오류 관측을 검증한다.
4. D-02·D-04·D-07과 화면 문구·SEO·개인정보 처리 범위를 정리한다.
# 2026-11-16 공개 예정 e스포츠 일정 로컬 입력

- 변경 파일: `apps/back-end/scripts/seed-pubgm-upcoming-schedules.js`, `docs/DEVLOG.md`. [치지직 e스포츠 화면](https://m.chzzk.naver.com/home/esports)에 표시된 PUBG MOBILE Esports KR의 2026-11-26~12-13 방송 11건을 로컬 개발 DB에 입력했다. 채널 ID는 [대회 운영사 안내](https://esports.pubgmobile.kr/ko/news/199)의 치지직 링크로 대조했다. 종료 시각은 공지되지 않아 `endTimeKnown: false`로 기록했다. 이 일정은 치지직이 직접 주최한 공식 방송으로 판단하지 않고 `match`로 분류했다.
- 검증: `node --check` 통과. 입력 전 11건 미등록, 적용 후 재실행 미등록 0건. 기존 나무위키 분류 후보 1,659건과 공개 스트리머 51명은 이미 로컬 DB에 있었다. 이번에 방송 채널 1개와 일정 11건을 추가했다. 운영 DB와 배포 환경은 변경하지 않았다.
- 남은 위험: 치지직 편성은 변경·취소될 수 있고, 종료 시각은 확인되지 않았다. 나무위키 후보의 채널 ID와 현재 활동 여부는 대다수 확인되지 않아 공개 목록으로 승격하지 않았다. 일정은 게시 전에 최신 원문과 대조해야 한다.

# 2026-11-16 나무위키 후보 채널 링크 추가 대조

- 변경 파일: `apps/back-end/scripts/collect-semorank-candidates.py`, `apps/back-end/data/verified-chzzk-channels.json`, `docs/LOCAL_DB.md`, `docs/DEVLOG.md`. 기존 나무위키 분류 후보 1,659개를 [세모랭크 치지직 팔로워 랭킹](https://www.semorank.kr/ranking/chzzk)의 여러 구간에 표시된 채널명·32자리 채널 ID와 대조했다. 정확히 일치하거나 문서 제목 끝의 `(인터넷 방송인)`만 제외하면 일치하는 신규 213명을 확인해 로컬 공개 스트리머 시드에 추가했다. 이름이 달라지는 다른 별칭과 동명이인은 자동 연결하지 않았다.
- 검증: 수집 스크립트 재실행 시 새 일치 0건. 로컬 DB에서 스트리머 시드를 세 차례 적용해 신규 74명, 101명, 38명을 추가했고, 최종 `streamer` 265건(PUBG MOBILE Esports KR 1건 포함), 후보 1,659건, 일정 11건을 확인했다. 후보 중 `channel-verified`는 211건이다. 운영 DB는 변경하지 않았다.
- 남은 위험: 랭킹은 치지직 운영 주체가 아닌 제3자 서비스이며 채널명과 활동 상태가 변할 수 있다. 공개 목록은 로컬 개발 DB에만 적용됐다. 나머지 후보는 채널 연결을 추가 확인해야 한다.

# 2026-11-16 남은 랭킹 구간·별칭 대조

- 변경 파일: `apps/back-end/scripts/collect-semorank-candidates.py`, `apps/back-end/data/verified-chzzk-channels.json`, `docs/LOCAL_DB.md`, `docs/DEVLOG.md`. [세모랭크 치지직 팔로워 랭킹](https://www.semorank.kr/ranking/chzzk)의 451~500위 구간을 추가 대조해 나무위키 후보와 이름이 맞는 16개 채널을 확인했다. 별칭 3건은 별도로 확인했다: `김정민(게임 해설가)` ↔ `김정민 해변킴`([나무위키 미러](https://www.namu.moe/w/김정민(게임%20해설가)), [치지직 채널](https://chzzk.naver.com/368ca51e82c85583e059fe669ef0f028)), `미치르 메르헨` ↔ `미치르`([나무위키 미러](https://www.namu.moe/w/미치르%20메르헨), [치지직 채널](https://chzzk.naver.com/390efc6c5186f85427b2d61297a9d4ed)), `영듀` ↔ `0영듀0`([본인 채널 안내](https://www.twitchmetrics.net/c/773078501-0due_), [치지직 채널](https://chzzk.naver.com/732f6f16d20991243ec3f2d7afed8821)).
- 일정 재확인: [치지직 e스포츠 화면](https://m.chzzk.naver.com/home/esports)에 기존 PUBG MOBILE Esports KR 예정 일정 11건의 제목·시작 시각이 그대로 표시됐다. 종료 시각은 여전히 표시되지 않는다. 로컬 일정 변경은 없었다.
- 검증: 로컬 시드 적용으로 신규 스트리머 19건 추가. 로컬 DB 조회 결과 공개 스트리머 284건(PUBG 채널 1건 포함), 후보 1,659건, `channel-verified` 후보 226건, 일정 11건. 운영 DB는 변경하지 않았다.
- 남은 위험: 제3자 랭킹과 채널명은 변경될 수 있다. 다른 후보의 동명이인·별칭은 자동 연결하지 않았다.

# 2026-11-16 파트너 후보의 다른 채널명 확인

- 변경 파일: `apps/back-end/data/verified-chzzk-channels.json`, `apps/back-end/scripts/collect-semorank-candidates.py`, `apps/back-end/scripts/seed-starter-streamers.js`, `docs/LOCAL_DB.md`, `docs/DEVLOG.md`. 나무위키 파트너 후보 중 채널 표시명이 다른 9명을 대조해 로컬 목록에 추가했다: `강승현(게임 해설가)`→`강퀴88`, `김도`→`김도의 취미방송`, `kfo`→`크포`, `오화요`→`오화요 Ohwayo`, `히렌히`→`히렌`, 그리고 이름이 같은 누스냥·쿠하·하하·망내. 채널 ID는 세모랭크 랭킹 또는 개별 치지직 채널·방송 기록을 확인했다. 랭킹 외 근거를 사용한 항목은 JSON의 개별 `source`에 기록하고, 시드가 후보의 `verifiedSource`에 그 값을 사용하도록 수정했다.
- 검증: 시드 적용 신규 9건. 로컬 DB 공개 스트리머 293건(PUBG 채널 1건 포함), 후보 1,659건, `channel-verified` 후보 229건, 일정 11건. 운영 DB는 변경하지 않았다.
- 남은 위험: 망내 등 일부 채널은 최근 방송 여부가 확인되지 않는다. 채널 링크 확인과 현재 활동 여부는 별개다. 동명이인이나 별칭 근거가 약한 후보는 연결하지 않았다.

# 2026-11-17 미연결 파트너 후보 개별 조사

- 변경 파일: `docs/STREAMER-CATALOG-AUDIT.md`, `docs/DEVLOG.md`. 미연결 파트너 후보 7명의 활동명, 동명 계정, 위키 문서 신뢰도와 채널 링크 단서를 각각 조사해 감사 문서에 출처와 남은 확인 사항을 기록했다.
- 검증: 공개 채널 시드와 별칭 시드의 기존 32자리 ID를 대조했다. `이늦잠`과 별개인 `늦잠` 채널 ID는 이미 시드에 있다. 신규 후보의 본인 채널 ID는 확인하지 못해 공개 목록·후보 상태·일정·DB를 변경하지 않았다.
- 남은 위험: 위키 분류와 동명 계정만으로 파트너 자격이나 인물 동일성을 확정할 수 없다. 영상 링크는 채널 URL이 아니며, 예정 방송의 날짜·시각도 확인되지 않았다.

