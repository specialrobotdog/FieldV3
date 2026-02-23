# FieldV3

A minimal Pinterest-style pinboard built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, and **Supabase**.

## Features

- Email/password sign up + log in
- Create, list, and delete boards
- Save pins (image URL + optional title, link, note) to any board
- Masonry/grid feed of all your pins
- Per-board pin view
- Private data — RLS ensures each user sees only their own boards & pins

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 App Router + TypeScript |
| Styling | Tailwind CSS v3 |
| Auth + DB | Supabase (PostgreSQL + Auth) |
| Deploy | Vercel |

---

## Local development

### Prerequisites

- Node.js 18+
- A free [Supabase](https://supabase.com) project

### 1. Clone and install

```bash
git clone <repo-url>
cd FieldV3
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with values from **Supabase → Settings → API**:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

> Both vars are safe for the browser because Row Level Security enforces
> data access at the database layer — no service-role key is used anywhere.

### 3. Run the SQL migration

In your Supabase project, open **SQL Editor** and paste + run the full contents of:

```
supabase/migrations/001_initial.sql
```

This creates:

- `profiles` table + auto-create trigger (fires on new user signup)
- `boards` table
- `pins` table
- Indexes on foreign keys and `created_at`
- RLS enabled on all tables with `user_id = auth.uid()` policies

### 4. Configure Supabase Auth redirect URLs

In your Supabase project go to **Authentication → URL Configuration**:

| Setting | Value |
|---------|-------|
| Site URL | `http://localhost:3000` |
| Redirect URLs | `http://localhost:3000/**` |

After deploying to Vercel, add your production URL to both fields.

### 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you will be redirected to `/login`.

---

## Routes

| URL | Description |
|-----|-------------|
| `/` | Redirects to `/app` or `/login` |
| `/login` | Email/password sign-in |
| `/signup` | Create account |
| `/app` | Feed — all your pins, newest first |
| `/app/boards` | List / create / delete boards |
| `/app/boards/:id` | Pins inside a specific board |

---

## Deploy to Vercel

1. Push this repo to GitHub
2. Import on [vercel.com/new](https://vercel.com/new)
3. Add env vars in **Vercel → Settings → Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

After the first deploy, add your Vercel domain to Supabase's redirect URL list.

---

## Project structure

```
├── app/
│   ├── app/                   # Protected routes under /app
│   │   ├── layout.tsx         # App shell with Navbar (auth guard)
│   │   ├── page.tsx           # Feed (/app)
│   │   └── boards/
│   │       ├── page.tsx       # Board list (/app/boards)
│   │       └── [id]/page.tsx  # Board detail (/app/boards/:id)
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── layout.tsx             # Root HTML shell
│   ├── globals.css
│   └── page.tsx               # Root redirect
├── components/
│   ├── Navbar.tsx
│   ├── PinCard.tsx
│   ├── PinGrid.tsx
│   ├── CreatePinModal.tsx
│   └── CreateBoardModal.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts          # Browser Supabase client
│   │   └── server.ts          # Server Component Supabase client
│   └── types.ts
├── middleware.ts               # Route protection + session refresh
├── supabase/
│   └── migrations/
│       └── 001_initial.sql    # Schema + RLS policies
└── .env.example
```

## Security notes

- RLS is on for every table; another user cannot read or write your data.
- `.env.local` is git-ignored — never committed.
- No service-role key is used anywhere in the app.
- Passwords are handled entirely by Supabase Auth (hashed server-side).
