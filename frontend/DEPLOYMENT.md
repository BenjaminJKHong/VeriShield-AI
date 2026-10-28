# VeriShield AI — Deployment Guide

## Prerequisites

- Node.js 22 (compatible with Next.js 16.4.3)
- npm (lockfile `package-lock.json` required)
- Docker (for image build and container test)

## Local Development

```bash
npm install
npm run lint
npm run build
npm run dev
```

## Standalone Build

The project uses `output: "standalone"` in `next.config.ts`. The build generates:

- `.next/standalone/` — server files
- `.next/static/` — static assets

## Docker Build

```bash
docker build \
  --build-arg NEXT_PUBLIC_API_URL=https://YOUR-CONFIRMED-BACKEND-URL \
  --build-arg NEXT_PUBLIC_API_PATH=/verify-link \
  --build-arg NEXT_PUBLIC_MOCK_MODE=false \
  -t verishield-frontend:latest .
```

**Important:** `NEXT_PUBLIC_*` variables are embedded at build time. Changing the container environment after build will not update the bundled API URL.

## Docker Run

```bash
docker run --rm -p 3000:3000 -e NEXT_PUBLIC_MOCK_MODE=false verishield-frontend:latest
```

Container: port `3000`, host `0.0.0.0`, non-root user `nextjs`.

## Backend API Configuration

Confirm with Benjamin / Meththani:

- Actual backend base URL (`NEXT_PUBLIC_API_URL`)
- Endpoint path (`NEXT_PUBLIC_API_PATH` — default `/verify-link`)
- Request method/field (current assumption: `POST { url }`)
- Required CORS settings for the backend

If the endpoint is unconfirmed, leave the build argument empty; the frontend will show a clear config message instead of inventing results.

## Mock Mode (Development Only)

For local UI preview of all verdict states:

```bash
# Create .env.local
echo "NEXT_PUBLIC_MOCK_MODE=true" > .env.local
npm run dev
```

Mock mode is disabled by default (`false`) in production builds and must not be enabled accidentally.

## Nebius Deployment Preparation

Before deploying to Nebius Serverless Containers:

1. Confirm the actual backend endpoint (see above).
2. Build the image with the correct `--build-arg NEXT_PUBLIC_API_URL=...`.
3. Publish the image to your registry (e.g., Nebius Container Registry or Docker Hub).
4. Configure Nebius container settings:
   - Port: `3000`
   - Startup command: `node server.js` (already set in Dockerfile `CMD`)
   - Environment: `NODE_ENV=production`, `PORT=3000`, `HOSTNAME=0.0.0.0`
   - Health check: HTTP `GET /`
5. Ensure the backend allows CORS for the Nebius deployment URL.

**Not verified locally:** Nebius-specific dashboard settings (image tag, registry auth, scaling limits, cold-start behavior). Confirm with Nebius documentation or team lead.

## Troubleshooting

- **Build fails:** Ensure `package-lock.json` exists; use `npm ci` inside Docker.
- **Missing standalone output:** Confirm `next.config.ts` includes `output: "standalone"`; rebuild.
- **API unavailable:** Check `NEXT_PUBLIC_API_URL` build arg; verify backend is running; check CORS.
- **Mock results shown in production:** Confirm `NEXT_PUBLIC_MOCK_MODE=false` at build time.
- **No verdict shown:** Verify input passes validation (`http:`/`https:` required); check console for errors.

## Security Notes

- No API keys or secrets in Dockerfile or build args.
- `.env` files excluded via `.dockerignore`.
- All backend text is rendered as plain text (no `dangerouslySetInnerHTML`).
- URL validation does not claim security verdict; only structural checks.
