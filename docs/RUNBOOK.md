Etax-pro- Runbook (Agent + DevOps)
==================================

Preflight (static export compliance)
- next.config.mjs → output: 'export', distDir: 'dist'
- No /app/api (moved to /app/_api)
- Dynamic pages replaced by query string (?id=)

Build & Deploy
```bash
npm run build
firebase deploy --only hosting
```

Browser Automation (CDP, works for all repos)
- Start Chrome with CDP (headful):
```bash
npm run browser:cdp:ui
```
- Cursor → Settings → Tools & MCP → Browser Automation
  - Connection Type: CDP Connection
  - CDP URL: http://localhost:9222
  - Browser Context: Create New Context

Playwright E2E (live)
- Base URL via env:
```bash
E2E_BASE_URL=https://<live-url> npx playwright test --reporter=line
```
- Quick smoke:
```bash
E2E_BASE_URL=https://anhbao-373f3.web.app npm run e2e:live
```

Auth (Email/Password + role)
- Firebase Auth (email/password) at /login if input contains '@'.
- Role read from Firestore users/{uid}
  - role = "admin" → redirect /admin
  - else → /

Create admin role (Console)
1) Firebase Console → Authentication → Users → copy UID of mrkent1999x@gmail.com
2) Firestore → users → Add doc with id = UID:
```json
{ "email": "mrkent1999x@gmail.com", "role": "admin" }
```

Cache/Hard refresh
- PWA caches aggressively; after deploy press Ctrl+Shift+R or close/reopen PWA.
- If UI looks stale (icons mis-sized), force refresh SW by reloading twice or clearing site data.

