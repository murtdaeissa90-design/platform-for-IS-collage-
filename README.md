# 🎓 Students IS Education Platform
🔗https://computer-is-collage.netlify.app
Al-Bayan University · College of Computer Science & IT · Information Systems Department
🌐 https://computer-is-collage.netlify.app

An educational platform for organizing university subjects, lectures, sheets, exams and review questions, with student accounts and an admin panel.

## Tech stack 

| Part | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) + React 18, static export |
| Language | JavaScript (JSX) |
| Accounts, database, storage | Supabase (Auth + Postgres + Storage) |
| Hosting & deployment | Netlify (auto-deploys from GitHub) |

## What is Next.js?

Next.js is a framework built on top of React for building modern websites. It adds what plain React lacks:

- **File-based routing:** every folder under `src/app` becomes a page, e.g. `/subject/calculus/Lectures/`.
- **Static export:** the site is built once into plain files (`out/`) that load fast and run on Netlify without a server.
- **Layouts:** shared parts such as the header, navigation and fonts are written once and reused on every page.
- **Font optimization:** `next/font` loads Inter, Sora, Amiri, Cairo and the others efficiently, without flicker.
- **Easy growth:** new pages, API routes or server features can be added later without a rewrite.

In this project, all data operations (login, storage, database) go through Supabase from the browser, so no custom server is needed yet.

## What is TypeScript?

TypeScript is JavaScript with types. You declare what kind of data each variable, function or object holds, and the editor catches mistakes before the site runs.

```ts
// TypeScript example
function approve(id: number, approved: boolean): void { /* ... */ }
approve("5", true); // ❌ error: "5" is a string, not a number
```

**Benefits:** fewer bugs, better autocomplete, safer refactoring, and self-documenting code.
**Trade-off:** slightly more code, and a build error if types do not match.

**Status in this project:** not used. The code is plain JavaScript, which keeps editing from GitHub simple. Migrating later is straightforward: rename `.js` files to `.ts` / `.tsx` and add a `tsconfig.json`. Next.js supports it out of the box. It becomes worthwhile when more developers join or the platform grows (grades, roles, announcements).

## Features

**Core**
- Lectures, exams and MCQ questions for every subject
- Study tasks, favorites and exam countdowns
- Arabic/English (RTL/LTR) and dark mode

**New (version 1.0)**
- Student accounts: sign up, sign in, password reset
- One shared login interface for students and admins
- Smart search that tolerates spelling mistakes across subjects and files
- Admin panel: review files, approve, permanently delete, and search students
- Roles and permissions enforced in the database
- Edit content from GitHub with automatic deployment

**Coming next**
- Admin announcements on the home page
- Saved MCQ results per student
- Custom SMTP for password reset
- A "Doctor" role to manage a specific subject

## Fonts

- **English:** Inter (main) · Sora (headings) · JetBrains Mono (code and numbers)
- **Arabic:** Amiri Bold (headings) · IBM Plex Sans Arabic Regular (body) · Cairo SemiBold (UI)

## Setup (one time)

1. Supabase → SQL Editor: run `supabase/schema.sql` (after replacing `ADMIN_EMAIL_HERE` with the admin's email).
2. Authentication → Sign In / Providers: enable Email and "Allow new users to sign up", and turn off "Confirm email".
3. Netlify: Build command `npm run build` · Publish directory `out`.

## Editing content from GitHub (deploys automatically)

- `src/data/semesters.js` → add a subject
- `src/data/files.js` → file links
- `src/data/questions.js` → MCQ questions
- Subject files: upload to Supabase Storage inside `folder/Lectures` or `folder/Exams`

## New admin

`update public.profiles set role = 'admin' where email = 'name@gmail.com';`

## Troubleshooting

Add `?debug=1` to a page URL to see the technical cause of an error (for developers only).

## Run locally

```bash
npm install
npm run dev
```

## Developers

Murtda Eissa · Abdullah Ismail — © 2026 All Rights Reserved