## 서버 연결

`.env.example`을 참고해 로컬 `.env`에 서버 주소를 설정합니다.

```bash
EXPO_PUBLIC_API_BASE_URL=https://portia-nonrepressed-unperfectively.ngrok-free.dev
EXPO_PUBLIC_ACCESS_TOKEN=
EXPO_PUBLIC_GOOGLE_CLIENT_ID=
```

로컬 서버를 직접 띄워 연결할 때는 위 값을 서버 주소로 바꿉니다. 실기기에서
개발 서버에 연결할 때는 `localhost` 대신 서버가 실행 중인 컴퓨터의 LAN IP를
사용해야 합니다.

현재 연결된 API:

- `GET /api/auth/me`
- `GET/PUT /api/user/profile`
- `GET/PUT /api/user/settings`
- `GET/POST /api/attendances`
- `GET /api/attendances/me`
- `GET /api/attendances/{attendenceCode}`
- `GET/POST /api/inventory`
- `GET/PUT/DELETE /api/inventory/{foodCode}`
- `GET /api/foods`
- `GET /api/foods/{foodCode}`
- `GET /api/pets`
- `GET /api/pets/{petCode}`
- `GET/POST /api/user-pets`
- `GET /api/user-pets/users`
- `GET/PUT /api/user-pets/{petCode}`
- `POST /feed`
- `GET /api/furnitures_all`
- `GET /api/furnitures_single/{furnitureCode}`
- `GET/POST /api/furnitures-inventory`
- `GET/PUT/DELETE /api/furnitures-inventory/{furnitureCode}`
- `GET/POST /api/points`
- `GET /api/points/users`
- `GET /api/points/{pointLogCode}`
- `GET /api/reports`
- `POST /api/reports/generate`
- `GET /api/quest/generate`
- `POST /api/answer`

Google OAuth는 서버의 `/oauth2/authorization/google`에서 시작합니다. 서버의
OAuth 성공 리디렉션은 아래 앱 딥링크로 설정해야 합니다.

```text
jellylog://auth?userAccessToken=...&userRefreshToken=...&userCode=...
```

성공 핸들러에서 토큰 JSON을 브라우저 응답으로 반환하면 앱이 로그인 완료를
감지할 수 없습니다. Spring Security 서버는 OAuth 성공 시 아래처럼 앱으로
리디렉션해야 합니다.

```java
String redirectUrl = UriComponentsBuilder
    .fromUriString("jellylog://auth")
    .queryParam("userAccessToken", accessToken)
    .queryParam("userRefreshToken", refreshToken)
    .queryParam("userCode", userCode)
    .build()
    .encode()
    .toUriString();

response.sendRedirect(redirectUrl);
```

Google Cloud Console에는 서버의 Google OAuth 콜백 주소를 등록하고, Google
인증이 끝난 뒤 실행되는 서버 성공 핸들러에서 위 앱 딥링크로 다시
리디렉션합니다. `jellylog://auth` 자체를 Google 승인 리디렉션 URI로
등록하는 구조는 아닙니다.

로그인 토큰은 기기의 SecureStore에 저장되고, API가 `401`을 반환하면
`POST /api/auth/refresh`로 자동 갱신됩니다.

`EXPO_PUBLIC_ACCESS_TOKEN`은 OAuth 완료 전 개발용 Bearer 토큰으로만 사용합니다.
