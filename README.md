# 🎓 Students IS Education Platform

منصة تعليمية ثنائية اللغة (عربي / English) لتنظيم المواد الجامعية والمحاضرات والامتحانات وأسئلة الاختيار المتعدد، لطلاب قسم نظم المعلومات.

**Al-Bayan University** · College of Computer Science & IT · Information Systems Department

## ✨ Features

- 🌐 Bilingual interface (Arabic / English) with full RTL support
- 🌙 Dark mode (saved in the browser)
- 📚 Two semesters with all their subjects
- 📄 Lectures and practice exams for each subject (PDF / PPTX)
- ❓ Interactive MCQ quizzes with instant correct/wrong feedback
- ⭐ Favorite subjects (pinned to the top)
- ⏳ Exam countdown per subject
- 📝 Personal study tasks list
- 🔎 Search for subjects and files
- 📤 Student file uploads, published only after admin approval
- 📱 Responsive design, optimized for phones

## 🛠️ Tech Stack

- HTML, CSS, and vanilla JavaScript (no build step)
- [Supabase](https://supabase.com) Storage for files and a `submissions` table for uploads
- Google Fonts (Poppins, Cairo)

## 📁 Project Structure

```
├── index.html   # Main platform (UI, data, logic)
└── admin.html   # Admin page for reviewing uploads
```

## 🚀 Getting Started

1. Clone the repo:
   ```bash
   git clone https://github.com/username/students-is-platform.git
   cd students-is-platform
   ```
2. Create a Supabase project, then:
   - Create a public Storage bucket named `Twix`
   - Create a table `submissions` with columns:
     `subject`, `material`, `name`, `path`, `approved` (boolean, default `false`)
3. In `index.html`, set your values:
   ```js
   const STORAGE_URL = "https://YOUR-PROJECT.supabase.co";
   const STORAGE_KEY = "YOUR_PUBLISHABLE_KEY";
   const BUCKET = "Twix";
   ```
4. Open `index.html` in a browser, or deploy with GitHub Pages / Netlify / Vercel.

## ➕ Adding Content

- **New subject:** add it to `SEMESTERS` in `index.html`:
  `["Subject Name", "📘", "StorageFolderName"]`
- **Direct file links:** add them to the `STATIC` object under `Lectures` or `Exams`.
- **MCQ questions:** add them to `QUESTIONS_DATA` using this format:
  ```js
  { q:{ar:"...", en:"..."}, options:{ar:[...], en:[...]}, correct:0 }
  ```
- **Files by upload:** put them in Storage under `SubjectFolder/Lectures/` or `SubjectFolder/Exams/`, and they appear automatically.

## 🔐 Upload Review Flow

1. A student uploads a file, which is stored in `pending/` with `approved = false`.
2. The admin reviews it from `admin.html`.
3. Once approved, the file shows up for everyone in the matching section.

## 👨‍💻 Developed by

**Murtda Eissa** · **Abdullah Ismail**

## 📄 License

All rights reserved © 2026
