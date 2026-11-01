# الإعداد لأول مرة

نفّذ الخطوات بالترتيب.

## 1) Supabase — قاعدة البيانات والصلاحيات

1. افتح **SQL Editor** وأنشئ استعلاماً جديداً.
2. افتح الملف `supabase/schema.sql` وغيّر `ADMIN_EMAIL_HERE` ببريد حساب الأدمن (يجب أن يكون الحساب موجوداً في Authentication ← Users).
3. شغّل الملف كاملاً (**Run**). هو آمن للتكرار.
4. إن كان اسم الـ bucket مختلفاً عن `Twix`، غيّره في الملف (في قسم Storage) وفي `NEXT_PUBLIC_STORAGE_BUCKET`.
5. شغّل استعلام مراجعة السياسات في آخر الملف واحذف أي سياسة قديمة تسمح لأي مستخدم مسجّل بالتعديل أو الحذف (راجع [SECURITY.md](SECURITY.md)).

## 2) Supabase — إعدادات Authentication

من **Authentication ← Sign In / Providers**:

- **Email** ← فعّل **Enable email provider**.
- في أعلى الصفحة تأكد أن **Allow new users to sign up** مفعّل.
- **Confirm email**: عطّله إن لم تُفعّل SMTP مخصصاً (الخدمة الافتراضية لا ترسل إلا لأعضاء فريقك وبحد منخفض جداً).

من **Authentication ← URL Configuration**:

- **Site URL**: `https://computer-is-collage.netlify.app`
- **Redirect URLs**: أضف نفس الرابط (مطلوب لاستعادة كلمة المرور).

## 3) Supabase — Storage

- الـ bucket اسمه `Twix` ويجب أن يكون **Public** (قراءة عامة).
- الطلاب يرفعون إلى مجلد `pending/` فقط (تضبطه السياسات)، والأدمن فقط يحذف.
- ملفات المواد الرسمية تُرفع إلى مجلد المادة: `اسم_المجلد/Lectures` و`اسم_المجلد/Exams` (اسم المجلد هو العنصر الثالث لكل مادة في `src/data/semesters.js`).

## 4) GitHub

ارفع محتويات المشروع إلى المستودع المربوط بـ Netlify. احذف أي ملفات قديمة في الجذر (مثل `index.html` و`admin.html` القديمين).

## 5) Netlify

الملف `netlify.toml` يضبط الإعدادات، وللتأكد من لوحة Netlify (Site configuration ← Build & deploy):

| الإعداد | القيمة |
|---|---|
| Build command | `npm run build` |
| Publish directory | `out` |
| Node version | 20 (في `netlify.toml`) |

أي commit جديد يُنشر تلقائياً. راقب النتيجة من **Deploys**.

## 6) متغيرات البيئة (اختياري)

انسخ `.env.example` وضع القيم في Netlify ← Site configuration ← Environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_KEY=...        # المفتاح العام (publishable) فقط
NEXT_PUBLIC_STORAGE_BUCKET=Twix
```

إن لم تضعها يستخدم المشروع القيم المكتوبة في `src/lib/supabase.js`.

> ⚠️ لا تضع مفتاح `service_role` أبداً في الكود أو في متغيرات `NEXT_PUBLIC_`.

## 7) اختبار بعد النشر

1. أنشئ حساب طالب ببريد كامل، وتأكد أنه يدخل الرئيسية.
2. افتح `/admin/` بحساب الأدمن.
3. ارفع ملفاً كطالب ← وافق عليه من الأدمن ← تأكد أنه يظهر في المادة.
4. ابحث عن الطالب في لوحة الأدمن (جرّب خطأً إملائياً).
