🎓 Students IS Education Platform
A study platform that organizes university subjects, lectures, sheets, exams and review questions in one place.
Al-Bayan University · College of Computer Science & Information Technology · Information Systems Department
🌐 Live: https://computer-is-collage.netlify.app
✨ Features (live now)
Student accounts: sign up, sign in and password reset with Supabase Auth. The platform is open to signed-in students only.
Subjects by semester: each subject has Lectures, Practice Exams and Review Questions.
Multiple-choice questions: bilingual (Arabic / English) with instant correct / wrong feedback.
Smart search: finds subjects, lectures, sheets and exams, tolerates spelling mistakes, understands Arabic (hamza, taa marbuta, diacritics) and English.
Student uploads: students can upload files; they appear for everyone only after an admin approves them.
Admin panel: review pending files, approve, delete, and search students.
Study tools: personal task list, favorite subjects, and an exam countdown (saved in the student's browser).
Bilingual interface (Arabic RTL / English LTR) and dark mode.
🚀 Coming on November 25, 2026
Feature
What it does
🔎 Smarter search
Further improvements to finding content faster
🔔 Notifications
A student is notified the moment an uploaded file is approved (optional email too)
🤖 Built-in assistant
A chat helper that answers platform questions and finds lectures and exams for any subject. A free, rule-based version ships first; an optional AI upgrade (Claude) is already prepared
⚙️ Custom backend API
Supabase Edge Functions that run real server-side work: approving files, sending notifications, powering the assistant
🧱 Tech stack
Part
Technology
Frontend
Next.js 14 (App Router) + React 18, static export (output: "export")
Auth, database, storage
Supabase (Auth + Postgres + Storage) with Row Level Security
Backend API
Supabase Edge Functions (Deno / TypeScript)
Hosting
Netlify (auto-deploys from GitHub)
Fonts
Inter, Sora, JetBrains Mono · Amiri, IBM Plex Sans Arabic, Cairo
🔐 Security model
Real protection lives in Supabase Row Level Security, not in the browser.
Roles are stored in the profiles table (student / admin); only admins can approve, delete or list students.
Students can upload only into a pending/ folder, and only admins can delete.
Edge Functions verify the caller's identity on the server; secret keys are never exposed to the browser.
See docs/SECURITY.md (Arabic) for the full permission table.
📁 Project structure
src/
  app/            pages (login, admin, home, subject pages)
  components/     UI (Shell, Search, Admin, Chat assistant, Notification bell)
  data/           editable content: subjects, file links, questions
  lib/            Supabase client, search engine, assistant logic
supabase/
  schema.sql          tables and permissions
  notifications.sql   notifications table
  functions/          Edge Functions (API)
docs/             setup, editing, security, API guides (Arabic)
⚙️ Run locally
npm install
npm run dev      # http://localhost:3000
npm run build    # static site in ./out
Environment variables (optional, see .env.example):
⚠️ Never put a service_role key or any API secret in the code or in NEXT_PUBLIC_* variables.
📚 Documentation (Arabic)
I want to...
Read
Set up the project the first time
docs/SETUP.md
Add subjects, links or questions
docs/EDITING.md
Understand the file layout
docs/STRUCTURE.md
Install the API and assistant
docs/API.md
Fix a problem
docs/TROUBLESHOOTING.md
👨‍💻 Developers
Murtda Eissa · Abdullah Ismail
© 2026 All rights reserved.