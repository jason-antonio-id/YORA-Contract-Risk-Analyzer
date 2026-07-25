# YORA | Contract Risk Analyzer (永睿 AI 合同风险分析)

AI-powered legal risk assessment for Indonesian SME importers, built for the Indonesia-China trade corridor. Upload a Chinese supplier contract and get a risk report identifying toxic clauses, missing protections, and citations to relevant Indonesian (KUHPerdata) and Chinese (民法典) civil law — in Indonesian, English, and Mandarin.

## Scope (by design — do not expand)

CRA analyzes **signed/draft contracts only.** It intentionally does not accept or analyze invoices, purchase orders, or packing lists — these have different risk profiles and require different analysis logic. This is a fixed product decision, not a missing feature.

## Key Features

- **Contract Risk Analyzer** — scans uploaded contracts (PDF) for risky or missing clauses.
- **Red Flag Alerts** — flags high-risk clauses with plain-language explanations and legal citations.
- **Smart Q&A** — follow-up chat to ask questions about the analyzed contract.
- **Contract Translation** — full contract translation on demand.
- **Bilingual/Trilingual Output** — Indonesian, English, and Simplified Mandarin throughout.
- **Email OTP Verification** — gates analysis behind a verified email (Gmail SMTP).
- **Admin Stats** — usage/lead stats behind a secret admin key, logged to Google Sheets.
- **Mobile responsive.**

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 19 + TypeScript, Vite, Tailwind CSS |
| Backend | Express (TypeScript) |
| AI | Google Gemini (`@google/genai`), Gemini 2.0 Flash |
| Email | Nodemailer via Gmail SMTP (OTP delivery) |
| Auth | Custom JWT session tokens (post-OTP) |
| Logging | Google Sheets API (leads, analytics, feedback) |
| Deployment | Vercel (serverless) — see `vercel.json` / `Dockerfile` for alternatives |

## Architecture Notes

- Long-running Gemini analysis calls use an **async job + polling pattern**: `POST /api/analyze` kicks off a job and returns a `jobId` immediately, and the client polls `GET /api/analyze/status/:jobId` for the result. This avoids tying a single HTTP request to the full duration of a long AI call, which is important on serverless platforms with function execution timeouts.
- `api/index.ts` is the Vercel serverless entry point. Note this currently duplicates the full route/handler logic rather than importing a shared `server.ts` app builder — if `server.ts` and `api/index.ts` diverge, fixes need to be applied to both.
- Rate limiting (`ipRequests` Map) and the analysis job store (`analysisJobs` Map) are in-memory, keyed per running instance.

## Known Limitations

- **OTP store is in-memory** (`otpStore` — a `Map`). On stateless/multi-instance serverless deployments (e.g. Vercel), an OTP sent on one instance may not be found by a verification request served by a different instance, or after a cold start/redeploy. This needs to move to a persistent store (e.g. a database table) to be fully reliable in production. This is a known, not-yet-fixed limitation.
- `JWT_SECRET` has an insecure hardcoded fallback (`"fallback-dev-secret-change-in-prod"`) if the env var isn't set. **Always set `JWT_SECRET` explicitly in every deployment environment.**
- `api/index.ts` and `server.ts` contain duplicated logic (see Architecture Notes) — a future refactor should extract shared route logic into one place, similar to the pattern used in the Negotiation Coach app (`buildApp()` factory imported by a thin serverless entry point).

## Getting Started

### 1. Prerequisites
- Node.js 18+ (or Bun)
- A [Google Gemini API key](https://aistudio.google.com)
- A Gmail account with an [App Password](https://myaccount.google.com/apppasswords) (requires 2-Step Verification) for sending OTP emails
- (Optional) A Google Cloud service account with Sheets API access, for lead/analytics logging

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Copy `.env.example` to `.env` and fill in:

| Variable | Notes |
|---|---|
| `GEMINI_API_KEY` | From Google AI Studio |
| `APP_URL` | The public URL this app is hosted at (used for self-referential links) |
| `GMAIL_USER` / `GMAIL_APP_PASSWORD` | For sending OTP verification emails |
| `GOOGLE_SHEET_ID` | ID from the target sheet's URL, between `/d/` and `/edit` |
| `GOOGLE_SHEETS_CLIENT_EMAIL` | Service account email — must be given Editor access to the sheet |
| `GOOGLE_SHEETS_PRIVATE_KEY_1` / `_2` | Service account private key, split across two vars — preserve newlines (use `\n` literals if setting as a platform env var) |
| `JWT_SECRET` | Generate with `openssl rand -base64 32` — **do not skip this, there is an insecure fallback if left unset** |
| `ADMIN_STATS_KEY` | Secret required in the `x-admin-key` header to access `GET /api/admin/stats` |

### 4. Run locally
```bash
npm run dev
```

### 5. Deploy

**Vercel (default):** push to your connected repo. `vercel.json` routes `/api/*` to `api/index.ts` and serves the Vite build output as static assets. Set all env vars above in **Settings → Environment Variables** (scoped to Production), and check **Settings → Functions → Max Duration** — contract analysis can take a while, so this should be raised well above the default.

**Docker (alternative):** a multi-stage `Dockerfile` is included for hosts like Render, Koyeb, Fly.io, or a VPS:
```bash
docker build -t yora-cra .
docker run -p 3000:3000 --env-file .env yora-cra
```

## Project Structure

```
├── api/
│   └── index.ts            # Vercel serverless entry point (full route logic)
├── server.ts                # Express app for traditional/local hosting
├── src/
│   ├── components/          # Scanner, AnalysisReport, Hero, Navbar, etc.
│   ├── lib/
│   │   ├── sheets.ts        # Google Sheets logging helpers
│   │   └── translations.ts
│   ├── offlineDemoFallbacks.ts  # Fallback content when the API is unavailable
│   └── types.ts
├── Dockerfile
└── vercel.json
```

## License

Private/proprietary — part of the YORA product suite.
