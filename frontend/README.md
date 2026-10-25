# VeriShield AI Frontend

AI-powered security intelligence for safer digital decisions.

## Environment variables

- `NEXT_PUBLIC_API_URL` (required for real analysis): base URL of the backend API. Leave empty to keep analysis disabled.
- `NEXT_PUBLIC_API_PATH` (optional): verification endpoint path. Defaults to `/verify-link`.
- `NEXT_PUBLIC_MOCK_MODE` (optional, development only): set to `true` to enable clearly labeled demonstration results.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Checks

```bash
npm run lint
npm run build
```
