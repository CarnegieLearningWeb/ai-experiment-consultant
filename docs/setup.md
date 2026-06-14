# Local setup

## Prerequisites

- Node.js **20+** (`.nvmrc` pins major version 20). `nvm use` if you have nvm.
- npm 10+ (ships with Node 20).

## First-time setup

```bash
# Clone and install (installs both the frontend and the server)
git clone https://github.com/CarnegieLearningWeb/upgrade-consultant.git
cd upgrade-consultant
npm install
cp server/.env.example server/.env   # then fill in your credentials
npm run dev
```

This starts both processes concurrently:

- **Client (Vite):** http://localhost:5173/ai-consultant/
- **Server (Express):** http://localhost:3001

Open the client URL. The Vite dev server proxies `/api/*` to the Express
server, so the frontend code can use relative API paths exactly as it will in
production.

The app sits behind **Google login** (a soft access guard). Set `GOOGLE_CLIENT_ID`
and `SESSION_SECRET` in `server/.env` (see [architecture.md](architecture.md#environment-variables))
— without them the sign-in page can't complete login and the API guard returns
`401` for every protected route. The `/health` endpoint stays open.

To run them separately:

```bash
npm run dev:client   # Vite only
npm run dev:server   # Express only (with nodemon)
```

## Verify the API stubs

```bash
curl http://localhost:3001/api/v1/ai-consultant/health
# -> {"status":"ok"}

curl -X POST http://localhost:3001/api/v1/ai-consultant/chat
# -> {"error":{"code":"not_implemented","message":"chat is not yet implemented (M2)"}}
```

All non-health endpoints return `501 Not Implemented` until their milestone lands. See [tasks.md](tasks.md).

## Build for production

```bash
npm run build      # builds client into client/dist/
npm start          # runs Express server in production mode
```

In production, a reverse proxy on the deployment host should:

- Serve `client/dist/` at `/ai-consultant` (with HTML5-history fallback to `index.html`).
- Proxy `/api/v1/ai-consultant/*` to the Express server.

See [architecture.md](architecture.md) for the URL plan.

## Common issues

- **`npm install` fails on a fresh clone.** Make sure you're on Node 20+ (`node -v`). The workspaces feature relies on a recent npm.
- **`localhost:5173/` shows a 404.** Open `localhost:5173/ai-consultant/` (with the trailing slash). The Vite `base` is set to `/ai-consultant/`.
- **Express port already in use.** The port (3001) is hardcoded in [server/src/index.js](../server/src/index.js), with the Vite proxy targeting it in [client/vite.config.js](../client/vite.config.js). Free the port, or change it in both places.

## Demo walkthrough

The full demo script is part of M6. For now: just open the dev URL and click around the chat shell.
