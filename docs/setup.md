# Local setup

## Prerequisites

- Node.js **20+** (`.nvmrc` pins major version 20). `nvm use` if you have nvm.
- npm 10+ (ships with Node 20).

## First-time setup

```bash
git clone <this repo>
cd upgrade-consultant
npm install            # installs root + client + server workspaces
cp .env.example .env   # fill in values as you reach each milestone
```

`ANTHROPIC_API_KEY` is only required once you reach M2 (real chat). Earlier
milestones run without it.

## Run the dev servers

```bash
npm run dev
```

This starts both processes concurrently:

- **Client (Vite):** http://localhost:5173/ai-consultant/
- **Server (Express):** http://localhost:3001

Open the client URL. The Vite dev server proxies `/api/*` to the Express
server, so the frontend code can use relative API paths exactly as it will in
production.

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
- **CORS errors in dev.** Make sure `CLIENT_ORIGIN` in `.env` matches the Vite URL (default `http://localhost:5173`).
- **Express port already in use.** Set `PORT` in `.env` and restart. The Vite proxy reads the same value.

## Demo walkthrough

The full demo script is part of M6. For now: just open the dev URL and click around the chat shell.
