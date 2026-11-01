# تعديل المحتوى من GitHub

كل تعديل (commit) على المستودع يُنشر تلقائياً على Netlify خلال دقائق.
يمكنك التعديل مباشرة من GitHub: افتح الملف ← أيقونة القلم ✏️ ← عدّل ← **Commit changes**.

> انتبه لعلامات الاقتباس والفواصل `,` وإلا فشل البناء.

## إضافة ملفات لمادة موجودة (بدون أي كود)

الأسهل: ارفع الملف إلى Supabase ← Storage ← bucket `Twix` داخل مجلد المادة:

- محاضرات وشيتات: `اسم_المجلد/Lectures`
- امتحانات: `اسم_المجلد/Exams`

يظهر للطلاب تلقائياً بلا نشر جديد. اسم المجلد هو العنصر الثالث للمادة في `src/data/semesters.js` (مثل `Accounting2`).

## إضافة رابط ثابت لملف

في `src/data/files.js` أضف داخل المادة:

```js
"Calculus": {
  "Lectures": [
    {name:"Lecture 1", url:"https://.../lecture1.pdf"},
  ],
  "Exams": [
    {name:"Midterm 2025", url:"https://.../midterm.pdf"},
  ]
},
```

اسم المادة هنا يجب أن يطابق تماماً الاسم في `semesters.js`.

## إضافة مادة جديدة

1. في `src/data/semesters.js` أضف سطراً داخل `subjects` للسمستر المطلوب:

   ```js
   ["Database Systems","🗄️","DatabaseSystems"],
   ```
   الترتيب: `[الاسم الظاهر, الأيقونة, اسم المجلد في Storage]`. اسم المادة يجب أن يكون **فريداً**، وأحرفه الإنجليزية والأرقام تُستخدم لبناء رابطها.
2. أنشئ في Storage مجلد `DatabaseSystems` (بداخله `Lectures` و`Exams`) عند رفع أول ملف.
3. (اختياري) في `src/data/aliases.js` أضف أسماء عربية للبحث:

   ```js
   "Database Systems": ["قواعد البيانات", "نظم قواعد البيانات"],
   ```

## إضافة أسئلة اختيار من متعدد

في `src/data/questions.js` أضف داخل المادة (اسمها يطابق `semesters.js`):

```js
{ q:{ar:"نص السؤال", en:"Question text"},
  options:{ ar:["أ","ب","ج","د"], en:["A","B","C","D"] },
  correct: 2 },   // رقم الإجابة الصحيحة، يبدأ من 0
```

## سمستر جديد

السمسترات الحالية مرتبطة بزرّين في `src/app/(platform)/page.js` (`semester3` و`semester2`). لإضافة سمستر:
أضف مفتاحاً جديداً في `SEMESTERS` ثم أضف زراً مقابلاً في الصفحة الرئيسية (أو اطلب المساعدة).

## تغيير الخطوط أو الألوان

- الخطوط: `src/app/layout.js` (التحميل) وآخر `src/app/globals.css` (التطبيق).
- الألوان: المتغيرات في أول `src/app/globals.css` (`--navy`, `--teal`, `--gold` ...).
- ألوان صفحة الدخول: كلاسات `.lg-*` في `globals.css`.

## منح صلاحية أدمن

```sql
update public.profiles set role = 'admin' where email = 'someone@example.com';
```

## سحب صلاحية أدمن

```sql
update public.profiles set role = 'student' where email = 'someone@example.com';
```
