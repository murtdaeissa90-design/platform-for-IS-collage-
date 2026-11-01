"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useApp } from "./AppProvider";
import { findSubject } from "@/lib/subjects";
import { loadFiles, uploadSubmission } from "@/lib/files";
import { QUESTIONS_DATA } from "@/data/questions";
import { norm, fuzzySearch } from "@/lib/search";
import { debugDetail } from "@/lib/debug";

function Mcq({ subject }) {
  const { L, lang } = useApp();
  const list = QUESTIONS_DATA[subject.name] || [];
  const [picked, setPicked] = useState({}); // {questionIndex: optionIndex}

  if (!list.length) return <div className="empty">📂 {L("No questions available.", "لا توجد أسئلة متاحة حالياً.")}</div>;

  return (
    <div className="mcq-wrap">
      <table className="mcq-table">
        <thead>
          <tr>
            <th>#</th>
            <th>{L("Question", "السؤال")}</th>
            <th>{L("Options", "الخيارات")}</th>
          </tr>
        </thead>
        <tbody>
          {list.map((item, qi) => {
            const opts = item.options[lang] || item.options.en || item.options.ar;
            const chosen = picked[qi];
            return (
              <tr key={qi}>
                <td className="mono" style={{ fontWeight: 700, width: 50 }}>{qi + 1}</td>
                <td style={{ fontWeight: 700 }}>{item.q[lang] || item.q.en || item.q.ar}</td>
                <td>
                  {opts.map((opt, oi) => {
                    let cls = "option-btn";
                    if (chosen !== undefined) {
                      if (oi === item.correct) cls += " correct";
                      else if (oi === chosen) cls += " wrong";
                    }
                    return (
                      <button key={oi} type="button" className={cls} disabled={chosen !== undefined}
                        onClick={() => setPicked((p) => ({ ...p, [qi]: oi }))}>
                        {opt}
                      </button>
                    );
                  })}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Files({ subject, material }) {
  const { L } = useApp();
  const [files, setFiles] = useState(null); // null = loading, "error"
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState(null); // {text, err}
  const [busy, setBusy] = useState(false);
  const fileInput = useRef(null);

  useEffect(() => {
    let alive = true;
    setFiles(null);
    loadFiles(subject.name, material)
      .then((d) => alive && setFiles(d))
      .catch((e) => {
        console.error(e);
        if (alive) setFiles("error");
      });
    return () => {
      alive = false;
    };
  }, [subject.name, material]);

  // فتح الصفحة من نتيجة البحث التلقائي: ?q=اسم الملف
  useEffect(() => {
    try {
      const v = new URLSearchParams(window.location.search).get("q");
      if (v) setQ(v);
    } catch {}
  }, []);

  const flash = (text, err) => {
    setMsg({ text, err });
    setTimeout(() => setMsg(null), 6000);
  };

  const onUpload = async () => {
    const file = fileInput.current?.files?.[0];
    if (!file || busy) return;
    setBusy(true);
    flash(L("Uploading...", "جارٍ الرفع..."), false);
    try {
      await uploadSubmission(subject.name, material, file);
      flash(L("Uploaded. It will appear after admin approval ✅", "تم الرفع، سيظهر بعد موافقة الأدمن ✅"), false);
      fileInput.current.value = "";
    } catch (e) {
      console.error(e);
      const m = String(e?.message || "").toLowerCase();
      let text = L("Could not upload the file. Try again.", "تعذر رفع الملف. حاول مجدداً.");
      if (m.includes("maximum allowed size") || m.includes("too large") || m.includes("payload"))
        text = L("The file is too large.", "حجم الملف كبير جداً.");
      else if (m.includes("mime") || m.includes("not supported"))
        text = L("This file type is not allowed. Use PDF, Word, PowerPoint or an image.", "نوع الملف غير مسموح. استخدم PDF أو Word أو PowerPoint أو صورة.");
      else if (m.includes("row-level security") || m.includes("unauthorized") || m.includes("jwt"))
        text = L("Your session expired. Sign in again and retry.", "انتهت جلستك. سجّل الدخول مجدداً وحاول.");
      else if (m.includes("failed to fetch") || m.includes("network"))
        text = L("No connection. Check your internet and try again.", "لا يوجد اتصال. تحقق من الإنترنت وحاول مجدداً.");
      flash(text + debugDetail(e), true);
    } finally {
      setBusy(false);
    }
  };

  let shown = Array.isArray(files) ? files : [];
  if (q.trim()) {
    const direct = shown.filter((f) => norm(f.name).includes(norm(q)));
    shown = direct.length ? direct : fuzzySearch(shown, q, (f) => [f.name], 50);
  }

  return (
    <>
      <div className="upload-card">
        <h3>{L("📤 Upload a File (reviewed before publishing)", "📤 رفع ملف (يُنشر بعد المراجعة)")}</h3>
        <input type="file" ref={fileInput} accept="application/pdf,.doc,.docx,.ppt,.pptx,image/*" />
        <button type="button" onClick={onUpload} disabled={busy}>{L("Upload", "رفع")}</button>
        {msg && <div className={"msg show" + (msg.err ? " err" : "")}>{msg.text}</div>}
      </div>

      <input type="text" className="file-search" value={q} onChange={(e) => setQ(e.target.value)}
        placeholder={L("🔎 Search files in this section...", "🔎 ابحث في هذا القسم...")} />

      <div className="file-list">
        {files === null && <div className="empty">{L("Loading...", "جارٍ التحميل...")}</div>}
        {files === "error" && <div className="empty">{L("Could not load files.", "تعذر تحميل الملفات.")}</div>}
        {Array.isArray(files) && files.length === 0 && (
          <div className="empty">📂 {L("No files available yet.", "لا توجد ملفات بعد.")}</div>
        )}
        {Array.isArray(files) && files.length > 0 && shown.length === 0 && (
          <div className="empty">{L("No files match your search.", "لا توجد ملفات مطابقة للبحث.")}</div>
        )}
        {shown.map((f) => (
          <div className="file" key={f.url}>
            <span>📄 {f.name}</span>
            <button type="button" onClick={() => window.open(f.url, "_blank", "noopener")}>
              {L("Open", "فتح")}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default function MaterialView({ slug, material }) {
  const { L } = useApp();
  const subject = findSubject(slug);

  if (!subject) {
    return (
      <div className="container">
        <p className="empty">{L("Subject not found.", "المادة غير موجودة.")}</p>
        <Link href="/" className="back">{L("← Back", "→ رجوع")}</Link>
      </div>
    );
  }

  const title =
    material === "Questions" ? L("Review Questions (MCQ)", "أسئلة الاختيار المتعدد") : material;

  return (
    <div className="container">
      <Link href={`/subject/${subject.slug}/`} className="back">{L("← Back", "→ رجوع")}</Link>
      <div className="subject-title">
        <h2>{subject.name} - {title}</h2>
      </div>
      {material === "Questions" ? <Mcq subject={subject} /> : <Files subject={subject} material={material} />}
    </div>
  );
}
