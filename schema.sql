-- =====================================================================
--  Students IS Platform — إعداد الطلاب والأدمن في Supabase
--  شغّل هذا الملف كاملاً مرة واحدة: Supabase > SQL Editor > New query > Run
--  ⚠️ شغّله قبل نشر النسخة الجديدة، وقبل أن يسجّل أي طالب.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1) جدول الملفات الشخصية (الاسم + الدور: student / admin)
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text,
  email      text,
  role       text not null default 'student' check (role in ('student', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- دالة التحقق من الأدمن (security definer كي لا تحصل حلقة في سياسات RLS)
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- الطالب يرى ملفه فقط، والأدمن يرى الجميع (للبحث عن الطلاب)
drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin" on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.is_admin());

-- الأدمن فقط يعدّل الملفات الشخصية (مثلاً لمنح صلاحية أدمن). الطالب لا يستطيع تعديل دوره.
drop policy if exists "profiles_update_admin" on public.profiles;
create policy "profiles_update_admin" on public.profiles
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- إنشاء ملف شخصي تلقائياً عند تسجيل أي طالب جديد
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- إنشاء ملفات شخصية للحسابات الموجودة مسبقاً (ومنها حساب الأدمن الحالي)
insert into public.profiles (id, email, full_name)
select id, email, coalesce(raw_user_meta_data ->> 'full_name', '')
from auth.users
on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- 2) 👑 اجعل حساب الأدمن الحالي أدمن  (غيّر البريد قبل التشغيل!)
-- ---------------------------------------------------------------------
update public.profiles
set role = 'admin'
where email = 'ADMIN_EMAIL_HERE';

-- ---------------------------------------------------------------------
-- 3) جدول الملفات المرفوعة (submissions): من يقرأ ومن يعدّل
-- ---------------------------------------------------------------------
alter table public.submissions enable row level security;
alter table public.submissions add column if not exists user_id uuid default auth.uid();

-- أي شخص يرى الملفات المعتمدة فقط
drop policy if exists "submissions_read_approved" on public.submissions;
create policy "submissions_read_approved" on public.submissions
  for select to anon, authenticated
  using (approved = true);

-- الطالب المسجّل يرفع ملفاً بحالة "غير معتمد" فقط
drop policy if exists "submissions_insert_pending" on public.submissions;
create policy "submissions_insert_pending" on public.submissions
  for insert to authenticated
  with check (approved = false);

-- الأدمن فقط: يرى كل شيء، يوافق، يحذف
drop policy if exists "submissions_admin_all" on public.submissions;
create policy "submissions_admin_all" on public.submissions
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------
-- 4) التخزين (Storage): الطالب يرفع إلى مجلد pending فقط، والأدمن فقط يحذف
--    غيّر 'Twix' إذا كان اسم الـ bucket مختلفاً.
-- ---------------------------------------------------------------------
drop policy if exists "twix_upload_pending" on storage.objects;
create policy "twix_upload_pending" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'Twix' and (storage.foldername(name))[1] = 'pending');

drop policy if exists "twix_admin_delete" on storage.objects;
create policy "twix_admin_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'Twix' and public.is_admin());

-- ---------------------------------------------------------------------
-- 5) ⚠️ مراجعة مهمة بعد التشغيل
-- الصفحة القديمة كانت تعتبر أي مستخدم مسجّل دخول أدمن. إذا كانت عندك سياسات قديمة
-- على submissions أو storage.objects تسمح لـ "authenticated" بالتعديل أو الحذف،
-- فسيستطيع أي طالب مسجّل استخدامها! شغّل هذا الاستعلام لرؤية كل السياسات:
--
--   select schemaname, tablename, policyname, cmd, roles, qual
--   from pg_policies
--   where tablename in ('submissions', 'objects', 'profiles')
--   order by tablename, policyname;
--
-- واحذف أي سياسة قديمة (غير التي أنشأها هذا الملف) تسمح لـ authenticated
-- بـ update أو delete على submissions، أو delete على storage.objects:
--   drop policy "اسم_السياسة_القديمة" on public.submissions;
-- ---------------------------------------------------------------------
