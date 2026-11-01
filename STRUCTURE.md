# هيكل المشروع

```
students-is-platform/
├─ netlify.toml            إعدادات البناء والنشر على Netlify
├─ next.config.mjs         تصدير ثابت (output: "export") + trailingSlash
├─ package.json            الاعتمادات: next, react, @supabase/supabase-js
├─ jsconfig.json           الاختصار @/ يشير إلى src/
├─ .env.example            مثال لمتغيرات البيئة
├─ supabase/
│  └─ schema.sql           جداول وصلاحيات الطلاب والأدمن (يُشغَّل في Supabase)
├─ docs/                   هذا التوثيق
└─ src/
   ├─ app/
   │  ├─ layout.js         الخطوط + مزوّدا اللغة والحسابات
   │  ├─ globals.css       كل التنسيقات (الأصلية + الخطوط + الدخول + الأدمن)
   │  ├─ login/page.js     صفحة دخول الطلاب
   │  ├─ admin/page.js     صفحة الأدمن (نفس واجهة الدخول + اللوحة)
   │  └─ (platform)/       صفحات المنصة المحمية بتسجيل الدخول
   │     ├─ layout.js      يضع الهيكل العام (Shell)
   │     ├─ page.js        الرئيسية (السمسترات والمواد)
   │     ├─ tasks/         مهامي
   │     ├─ about/         حول المنصة
   │     └─ subject/[slug]/            صفحة المادة (العد التنازلي + الأقسام)
   │        └─ [material]/             Lectures | Exams | Questions
   ├─ components/
   │  ├─ AppProvider.js    اللغة (عربي/إنجليزي)، الوضع الليلي، دالة L()
   │  ├─ AuthProvider.js   الجلسة، الدور (profiles)، دخول/تسجيل/استعادة
   │  ├─ Shell.js          الهيدر، التنقل، الفوتر، حماية الصفحات
   │  ├─ GlobalSearch.js   البحث التلقائي
   │  ├─ LoginForm.js      نموذج الدخول (طلاب وأدمن)
   │  ├─ LoginShell.js     خلفية صفحة الدخول وزر اللغة
   │  ├─ SubjectView.js    محتوى صفحة المادة
   │  ├─ MaterialView.js   الملفات والرفع وأسئلة MCQ
   │  └─ AdminDashboard.js لوحة الأدمن
   ├─ data/                ← هنا تعدّل المحتوى
   │  ├─ semesters.js      المواد والسمسترات + أقسام المادة
   │  ├─ files.js          روابط الملفات الرسمية
   │  ├─ questions.js      أسئلة الاختيار من متعدد
   │  └─ aliases.js        أسماء عربية بديلة للمواد (للبحث)
   └─ lib/
      ├─ supabase.js       إنشاء عميل Supabase
      ├─ subjects.js       قائمة المواد الموحدة وروابطها (slug)
      ├─ files.js          تحميل الملفات + الرفع + فهرس البحث
      ├─ search.js         خوارزمية البحث التقريبي
      └─ debug.js          تفاصيل الأخطاء للمطوّر (?debug=1)
```

## كيف تتدفق الأمور

- **الحسابات:** `AuthProvider` يقرأ جلسة Supabase ثم صف المستخدم في `profiles` لمعرفة دوره (`student` أو `admin`).
- **حماية الصفحات:** `Shell` يحوّل غير المسجّل إلى `/login/`. هذه حماية للواجهة؛ الحماية الحقيقية للبيانات هي سياسات RLS في `schema.sql`.
- **الملفات في صفحة مادة:** تُدمج 3 مصادر بلا تكرار: الروابط الثابتة (`files.js`) + ملفات مجلد المادة في Storage + الملفات المعتمدة من جدول `submissions`.
- **الرفع:** الملف يذهب إلى `pending/` في Storage + صف في `submissions` بحالة `approved = false`. الأدمن يوافق فيتحول إلى `true` فيظهر للجميع.
- **البحث:** المواد والروابط الثابتة فورية، وبقية الملفات تُحمَّل عند أول ضغط على مربع البحث.
- **المحفوظ في متصفح الطالب (localStorage):** `study_tasks`، `fav_subjects`، `exam_dates`، `students_is_lang`، `students_is_dark_mode`.
