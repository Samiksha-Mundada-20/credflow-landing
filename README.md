# CredFlow Landing Page

Static HTML/CSS/JS landing site. No build step. No dependencies.

## Structure

```
credflow-landing/
├── index.html          ← Main landing page
├── css/
│   ├── style.css       ← All landing page styles (design tokens from brief)
│   └── legal.css       ← Shared styles for Privacy + Terms pages
├── js/
│   └── waitlist.js     ← Captures email → Supabase waitlist table
├── pages/
│   ├── privacy.html    ← Privacy Policy (required for Chrome Web Store)
│   └── terms.html      ← Terms of Service
└── vercel.json         ← Vercel static deployment config
```

## Deploy to Vercel (separate project from dashboard)

### 1. Create a new GitHub repo

```bash
cd credflow-landing
git init
git add .
git commit -m "Step 9: landing page + privacy + terms"
git remote add origin https://github.com/Samiksha-Mundada-20/credflow-landing.git
git push -u origin main
```

### 2. Import into Vercel

- Go to vercel.com → Add New Project
- Import the `credflow-landing` GitHub repo
- Framework preset: **Other** (it's plain HTML)
- Root directory: `.` (default)
- Build command: leave **blank**
- Output directory: `.` (current directory)
- Click Deploy

### 3. Set domain

Vercel will give you `credflow-landing.vercel.app` by default.
Rename it to `credflow.vercel.app` in Project Settings → Domains.

### 4. Create the waitlist table in Supabase

Run this SQL in the CredFlow Supabase project (SQL Editor):

```sql
create table waitlist (
  id           uuid primary key default gen_random_uuid(),
  email        text not null unique,
  source       text default 'landing_page',
  signed_up_at timestamptz default now()
);

-- No RLS needed — anon INSERT is intentional for waitlist
-- But restrict SELECT to authenticated users only
alter table waitlist enable row level security;

create policy "anon can insert waitlist"
  on waitlist for insert
  to anon
  with check (true);

create policy "authenticated can read waitlist"
  on waitlist for select
  to authenticated
  using (true);
```

### 5. Privacy Policy URL for Chrome Web Store

Once deployed, the privacy policy URL to submit is:
`https://credflow.vercel.app/pages/privacy`

---

## Git config reminder (same as dashboard)

```bash
git config user.email "mundadasamiksha20@gmail.com"
git config user.name "Samiksha-Mundada-20"
```
