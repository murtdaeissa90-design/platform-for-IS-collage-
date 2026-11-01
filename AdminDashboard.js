"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useApp } from "./AppProvider";
import { useAuth } from "./AuthProvider";
import { supabase, BUCKET } from "@/lib/supabase";
import { fuzzySearch } from "@/lib/search";

/** رابط التخزين العام -> مسار الملف داخل الـ bucket */
function storagePathFromUrl(url) {
  const marker = "/storage/v1/object/public/" + BUCKET + "/";
  const s = String(url || "");
  const i = s.indexOf(marker);
  if (i === -1) return null;
  try {
    return decodeURIComponent(s.slice(i + marker.length).split("?")[0]);
  } catch {
    return null;
  }
}

export default function AdminDashboard() {
  const { L, lang, toggleLang } = useApp();
  const { displayName, user, signOut } = useAuth();

  const [stats, setStats] = useState(null);
  const [pending, setPending] = useState(null);
  const [approved, setApproved] = useState(null);
  const [students, setStudents] = useState(null);
  const [studentQ, setStudentQ] = useState("");
  const [flashMsg, setFlashMsg] = useState("");

  const flash = (text) => {
    setFlashMsg(text);
    setTimeout(() => setFlashMsg(""), 8000);
  };

  const loadAll = useCallback(async () => {
    const [p, a, ps, as] = await Promise.all([
      supabase.from("submissions").select("*").eq("approved", false).order("created_at", { ascending: false }),
      supabase.from("submissions").select("*").eq("approved", true).order("created_at", { ascending: false }).limit(200),
      supabase.from("submissions").select("id", { count: "exact", head: true }).eq("approved", false),
      supabase.from("submissions").select("id", { count: "exact", head: true }).eq("approved", true),
    ]);
    setPending(p.error ? "error" : p.data || []);
    setApproved(a.error ? "error" : a.data || []);
    setStats(ps.error || as.error ? null : { pending: ps.count ?? 0, approved: as.count ?? 0 });
  }, []);

  const loadStudents = useCallback(async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id,full_name,email,role,created_at")
      .order("created_at", { ascending: false })
      .limit(1000);
    setStudents(error ? "error" : data || []);
  }, []);

  useEffect(() => {
    loadAll();
    loadStudents();
  }, [loadAll, loadStudents]);

  const approve = async (id) => {
    const { error } = await supabase.from("submissions").update({ approved: true }).eq("id", id);
    if (error) {
      console.error(error);
      alert(L("Could not approve the file.", "تعذرت الموافقة."));
      return;
    }
    loadAll();
  };

  const remove = async (row) => {
    if (!confirm(L("Delete this file permanently?", "حذف هذا الملف نهائياً؟"))) return;
    let note = "";
    const filePath = storagePathFromUrl(row.path);
    if (filePath) {
      const { data, error } = await supabase.storage.from(BUCKET).remove([filePath]);
      if (error) {
        console.error(error);
        note = L("Could not delete the file from storage. Check the storage delete policy.", "تعذر حذف الملف من التخزين، تحقق من صلاحية الحذف على Storage.");
      } else if (!data || !data.length) {
        note = L("File not found in storage (already deleted, or no delete permission).", "لم يُعثر على الملف في التخزين (ربما حُذف مسبقاً أو لا توجد صلاحية حذف).");
      }
    }
    const { error: dbErr } = await supabase.from("submissions").delete().eq("id", row.id);
    if (dbErr) {
      console.error(dbErr);
      alert(L("Could not delete.", "تعذر الحذف."));
      return;
    }
    if (note) flash(L("Record deleted. ", "تم حذف السجل من المنصة. ") + note);
    loadAll();
  };

  // البحث التلقائي عن الطلاب: يتحمل الأخطاء الإملائية، ويظهر للأدمن فقط
  const shownStudents = useMemo(() => {
    if (!Array.isArray(students)) return [];
    if (!studentQ.trim()) return students.slice(0, 50);
    return fuzzySearch(students, studentQ, (s) => [s.full_name, s.email], 50);
  }, [students, studentQ]);

  const empty = (t) => <div className="empty">{t}</div>;

  return (
    <div className="ad-page">
      <header className="ad-header">
        <h1>{L("🔐 Platform control panel", "🔐 لوحة تحكم المنصة")}</h1>
      </header>

      <div className="container ad-container">
        <div className="ad-top">
          <span>👋 {displayName || user?.email}</span>
          <div className="ad-top-actions">
            <Link href="/" className="ad-btn ghost">{L("Platform", "المنصة")}</Link>
            <button type="button" className="ad-btn ghost" onClick={toggleLang}>{lang === "ar" ? "English" : "عربي"}</button>
            <button type="button" className="ad-btn" onClick={signOut}>{L("Sign out", "تسجيل خروج")}</button>
          </div>
        </div>

        {flashMsg && <div className="msg show">{flashMsg}</div>}

        <div className="ad-stats">
          <div className="ad-stat pending">
            <div className="num mono">{stats ? stats.pending : "–"}</div>
            <div>{L("⏳ Pending review", "⏳ بانتظار المراجعة")}</div>
          </div>
          <div className="ad-stat approved">
            <div className="num mono">{stats ? stats.approved : "–"}</div>
            <div>{L("✅ Approved", "✅ موافق عليها")}</div>
          </div>
          <div className="ad-stat students">
            <div className="num mono">{Array.isArray(students) ? students.length : "–"}</div>
            <div>{L("🎓 Students", "🎓 الطلاب")}</div>
          </div>
        </div>

        <h2 className="ad-section">{L("⏳ Pending review", "⏳ بانتظار المراجعة")}</h2>
        {pending === null && empty(L("Loading...", "جارٍ التحميل..."))}
        {pending === "error" && empty(L("Could not load files. Make sure the submissions table exists and your account is an admin.", "تعذر تحميل الملفات. تأكد أن جدول submissions موجود وأن حسابك أدمن."))}
        {Array.isArray(pending) && pending.length === 0 && empty(L("📭 No files waiting for review.", "📭 لا توجد ملفات بانتظار المراجعة."))}
        {Array.isArray(pending) && pending.map((row) => (
          <div className="ad-card" key={row.id}>
            <div className="ad-meta">{row.subject} ← {row.material}</div>
            <div className="ad-name">📄 {row.name}</div>
            <a href={encodeURI(row.path)} target="_blank" rel="noopener noreferrer">{L("Preview file", "معاينة الملف")}</a>
            <div className="ad-actions">
              <button type="button" className="approve" onClick={() => approve(row.id)}>{L("✅ Approve", "✅ موافقة")}</button>
              <button type="button" className="reject" onClick={() => remove(row)}>{L("❌ Reject", "❌ رفض")}</button>
            </div>
          </div>
        ))}

        <h2 className="ad-section">{L("✅ Approved files", "✅ الملفات المعتمدة")}</h2>
        {approved === null && empty(L("Loading...", "جارٍ التحميل..."))}
        {approved === "error" && empty(L("Could not load approved files.", "تعذر تحميل الملفات المعتمدة."))}
        {Array.isArray(approved) && approved.length === 0 && empty(L("No approved files yet.", "لا توجد ملفات معتمدة بعد."))}
        {Array.isArray(approved) && approved.map((row) => (
          <div className="ad-card" key={row.id}>
            <div className="ad-meta">{row.subject} ← {row.material}</div>
            <div className="ad-name">📄 {row.name}</div>
            <a href={encodeURI(row.path)} target="_blank" rel="noopener noreferrer">{L("Preview file", "معاينة الملف")}</a>
            <div className="ad-actions">
              <button type="button" className="reject" onClick={() => remove(row)}>{L("🗑️ Delete permanently", "🗑️ حذف نهائي")}</button>
            </div>
          </div>
        ))}

        <h2 className="ad-section">{L("🎓 Students", "🎓 الطلاب")}</h2>
        <input
          type="search"
          className="file-search"
          value={studentQ}
          onChange={(e) => setStudentQ(e.target.value)}
          placeholder={L("🔎 Search a student by name or email...", "🔎 ابحث عن طالب بالاسم أو البريد...")}
        />
        {students === null && empty(L("Loading...", "جارٍ التحميل..."))}
        {students === "error" && empty(L("Could not load students. Run supabase/schema.sql and make sure your account is an admin.", "تعذر تحميل الطلاب. شغّل ملف supabase/schema.sql وتأكد أن حسابك أدمن."))}
        {Array.isArray(students) && shownStudents.length === 0 && empty(L("No students match.", "لا يوجد طلاب مطابقون."))}
        <div className="ad-students">
          {shownStudents.map((s) => (
            <div className="ad-student" key={s.id}>
              <b>{s.full_name || L("(no name)", "(بدون اسم)")}</b>
              <span dir="ltr">{s.email}</span>
              {s.role === "admin" && <em>{L("Admin", "أدمن")}</em>}
            </div>
          ))}
        </div>
        {Array.isArray(students) && !studentQ.trim() && students.length > 50 && (
          <p className="ad-note">{L("Showing the latest 50. Type to search all students.", "يعرض آخر 50 طالباً. اكتب للبحث في الجميع.")}</p>
        )}
      </div>
    </div>
  );
}
