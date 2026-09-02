# OpportunityHub

A career and opportunity discovery platform for students, graduates, job seekers
and young professionals — built for Nigeria, architected to grow internationally.

Discover jobs, internships, scholarships, fellowships, grants, competitions,
training programs, remote work and more. Includes a CV builder, application
tracker, saved opportunities, a referral program, a manual payment center, and
an admin dashboard.

---

## Tech stack

- **React 18 + Vite** — frontend
- **React Router v7** — routing
- **Supabase** (`@supabase/supabase-js`) — auth, Postgres database, Row Level
  Security
- **lucide-react** — icons
- Plain CSS (`src/styles.css`) — no CSS framework, mobile-first

---

## Project structure

```
src/
  assets/            official logo files
  components/
    layout/          Header, Footer, Layout (route outlet)
    opportunities/    OpportunityCard, OpportunityFilters
    ui/              Logo, States (loading/empty/error), ProtectedRoute
  contexts/          AuthContext (Supabase session), ToastContext
  hooks/             useSavedOpportunities (guest + logged-in)
  lib/               supabaseClient.js, constants.js
  pages/             one file per route
    admin/           admin dashboard sub-pages
    legal/           Terms, Privacy, Refund, Disclaimer
  services/          one file per Supabase-backed resource (opportunities,
                     applications, cvs, payments, referrals, notifications,
                     admin)
  App.jsx            route table
  main.jsx           app bootstrap (providers)
  styles.css         global styles (mobile-first, class-based)
supabase/
  migrations/        SQL migrations — run these in the Supabase SQL editor
.env.example         documents the required environment variables
```

---

## Getting started

```bash
npm install
cp .env.example .env
# fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env
npm run dev
```

Without Supabase credentials, the app still builds and runs — pages that need
data will show a clear "Supabase is not connected yet" state instead of
crashing, and auth actions (login/register) show a banner explaining they're
disabled until configured.

```bash
npm run build      # production build to dist/
npm run preview    # preview the production build locally
```

---

## Required manual setup (cannot be done from code alone)

1. **Create a Supabase project** at https://supabase.com.
2. **Run the SQL migrations** in `supabase/migrations/` in order, using the
   Supabase SQL editor (or the Supabase CLI):
   - `0001_init_schema.sql` — all tables, RLS policies, triggers
   - `0002_referral_reward_trigger.sql` — automatic referral reward logic
   - `0003_seed_data.sql` — optional sample opportunities + payment
     destination placeholders (⚠️ replace the placeholder wallet
     addresses/account number with your real ones before launch)
3. **Copy your project's URL and anon/public key** into `.env`
   (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`). Never use the
   `service_role` key in the frontend.
4. **Enable email auth** in Supabase Authentication settings (enabled by
   default), and configure the **Site URL** / **Redirect URLs** in
   Authentication → URL Configuration to match your deployed domain (needed
   for password-reset emails to link back correctly, and matches
   `VITE_SITE_URL`).
5. **Promote your own account to admin** after registering once through the
   app:
   ```sql
   update public.profiles set role = 'admin' where id = '<your-auth-user-uuid>';
   ```
6. **Replace placeholder payment destinations** (`payment_destinations`
   table) with your real OPay account number and crypto wallet addresses.
   Never store private keys or seed phrases anywhere in this project.
7. **(Optional) Storage** — if you want organizations to upload their own
   logos instead of pasting a `logo_url`, create a public Supabase Storage
   bucket (e.g. `opportunity-logos`) and wire an upload control; this is not
   implemented yet (see Limitations).
8. **(Optional) Transactional email** — password recovery emails are sent by
   Supabase's built-in email service by default (rate-limited, fine for
   testing). For production volume, connect a custom SMTP provider under
   Authentication → Email settings.

---

## What's real vs. what's a placeholder

- **Real, Supabase-backed**: auth (register/login/logout/password reset/
  session persistence), opportunities CRUD + publishing workflow, saved
  opportunities, application tracker, CV storage, profile editing, referral
  code generation + automatic reward trigger, manual payment submission +
  admin approval flow with notifications, reporting, admin dashboard (all
  enforced via Postgres RLS, not just frontend checks).
- **Guest fallback (by design, per spec)**: saved opportunities and CV drafts
  are kept in `localStorage` for logged-out visitors, and merged into the
  account automatically on login/registration.
- **Manual by design**: payment verification is manual (no blockchain node
  integration) — this matches the spec, which explicitly asked for manual
  verification, not automatic on-chain confirmation.
- **Support contact form**: currently a session-only UI (no ticket is
  persisted) — see Limitations below for the suggested `support_tickets`
  table if you want it to be real.

---

## Limitations / suggested next steps

- **Email confirmations**: Supabase's default email templates are used;
  branding them (with the OpportunityHub logo/colors) is a Supabase dashboard
  task, not a code task.
- **Support form** does not yet persist to Supabase. Suggested schema:
  ```sql
  create table public.support_tickets (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references public.profiles(id),
    name text, email text, message text,
    status text default 'open',
    created_at timestamptz default now()
  );
  ```
- **Opportunity/organization logo uploads**: currently `logo_url` is a plain
  text field (paste an image URL); direct upload via Supabase Storage is not
  wired up yet.
- **New-opportunity / deadline-approaching notifications**: the
  `notifications` table and types support these, but the scheduled jobs that
  would generate them (e.g. a daily cron checking upcoming deadlines) need to
  be set up as a Supabase Edge Function + `pg_cron`/external scheduler — this
  is infrastructure that must be configured directly in your Supabase
  project, not something a frontend build can create.
- **Payments**: no payment gateway/blockchain API is integrated — by design,
  per the "manual verification only" requirement. If you later want real
  blockchain verification, that would be a new, explicit integration.
- **Bundle size**: the production build emits a single ~525KB JS chunk;
  consider route-based code-splitting (`React.lazy`) if this becomes a
  concern at scale.

---

## Deployment (Netlify)

`netlify.toml` is included with SPA redirect rules so client-side routing
works on refresh/deep links. In the Netlify UI, set the same environment
variables from `.env.example` under Site settings → Environment variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SITE_URL` (your production URL, e.g. `https://opportunityhub.app`)

Build command: `npm run build` · Publish directory: `dist`

---

## Brand

- Official logo files live in `src/assets/` (`oh-logo-full.png` for the full
  lockup with wordmark, `oh-logo-square.png`/`oh-logo-icon.png` for compact
  usage) and are used as-is, un-distorted, throughout the header, footer and
  auth pages.
- Brand colors (`src/lib/constants.js` → `BRAND.colors`, mirrored in
  `styles.css` CSS variables): navy `#0B1D3A`, blue `#1D4ED8`, sky blue
  `#38BDF8`, amber `#FBBF24`, green `#22C55E`.
- Creator credit "Created by Ojattah Wisdom" appears in the footer.
