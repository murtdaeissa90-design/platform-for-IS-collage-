# حل المشاكل

## تفاصيل تقنية للمطوّر

الطلاب يرون رسائل بسيطة فقط. لرؤية السبب التقني على جهازك، افتح الموقع مرة واحدة بإضافة `?debug=1` للرابط، مثل:
`https://computer-is-collage.netlify.app/login/?debug=1`
وللإيقاف `?debug=0`. التفاصيل تُسجَّل أيضاً في console المتصفح دائماً.

## التسجيل وتسجيل الدخول

| العَرَض | السبب | الحل |
|---|---|---|
| «حدث خطأ» عند إنشاء الحساب | **Allow new users to sign up** مغلق | فعّله في Authentication ← Sign In / Providers |
| لا التسجيل ولا الدخول يعملان | **Enable email provider** مطفأ | فعّله في Email |
| «البريد غير صحيح» | بريد ناقص مثل `name@90` | اكتبه كاملاً `name@gmail.com` |
| طالب سجّل ولا يستطيع الدخول | **Confirm email** مفعّل والرسائل لا تصل (SMTP افتراضي) | عطّل Confirm email، أو فعّل SMTP مخصصاً، أو أكّده من Authentication ← Users |
| «Database error saving new user» | لم يُشغَّل `schema.sql` أو trigger/جدول `profiles` تالف | أعد تشغيل `supabase/schema.sql` |
| «نسيت كلمة المرور» لا يصل بريده | SMTP الافتراضي لا يرسل لغير فريقك | فعّل SMTP مخصصاً (Brevo/Resend)، أو غيّر كلمة الطالب من Authentication ← Users |
| رابط استعادة كلمة المرور لا يعود للموقع | Site URL / Redirect URLs غير مضبوطة | اضبطها في URL Configuration |

## الأدمن

| العَرَض | الحل |
|---|---|
| «لا توجد صلاحية أدمن» | `update public.profiles set role = 'admin' where email = '...';` |
| الأدمن لا يرى الملفات أو الطلاب | تأكد من تشغيل `schema.sql` ومن أن دور الحساب `admin` |
| الحذف يحذف السجل لكن الملف باقٍ في Storage | سياسة حذف Storage (`twix_admin_delete`) غير موجودة — أعد تشغيل `schema.sql` |

## رفع الملفات

| العَرَض | الحل |
|---|---|
| «تعذر رفع الملف» | افتح الصفحة بـ `?debug=1` لترى السبب. الكلمة `storage` تعني مشكلة سياسات Storage، و`database` تعني سياسات جدول `submissions` |
| `storage: ... row-level security` | تأكد من سياسة `twix_upload_pending` ومن اسم الـ bucket `Twix` (حساس لحالة الأحرف) |
| `database: ... row-level security` | تأكد من سياسة `submissions_insert_pending` |
| الملف كبير جداً أو نوع غير مسموح | راجع `file_size_limit` و`allowed_mime_types` للـ bucket: `select id, file_size_limit, allowed_mime_types from storage.buckets;` |

## البناء والنشر على Netlify

| العَرَض | الحل |
|---|---|
| الموقع يعرض النسخة القديمة | Deploys: هل آخر نشر **Published**؟ ثم Ctrl+Shift+R، أو افتح نافذة خاصة |
| فشل البناء | افتح سجل البناء وانسخ آخر 30 سطراً |
| «Publish directory not found» | اضبط Publish directory على `out` (وامسح قيمة `.next` من لوحة Netlify إن وُجدت) |
| صفحة 404 عند فتح رابط مادة مباشرة | تأكد أن الرابط ينتهي بـ `/` وأن اسم المادة موجود في `semesters.js` |
| مادة جديدة لا تظهر | أُضيفت في `semesters.js`؟ وهل اكتمل النشر؟ |

## الاستعلامات المفيدة (SQL Editor)

```sql
-- كل الحسابات وأدوارها
select email, full_name, role, created_at from public.profiles order by created_at desc;

-- كل السياسات
select schemaname, tablename, policyname, cmd, roles
from pg_policies
where tablename in ('submissions','objects','profiles')
order by tablename, policyname;

-- إعدادات الـ bucket
select id, public, file_size_limit, allowed_mime_types from storage.buckets;
```
