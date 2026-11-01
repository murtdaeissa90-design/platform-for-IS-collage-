"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useApp } from "./AppProvider";
import { findSubject } from "@/lib/subjects";
import { MATERIALS } from "@/data/semesters";

const EXAM_KEY = "exam_dates";

function loadDates() {
  try {
    return JSON.parse(localStorage.getItem(EXAM_KEY)) || {};
  } catch {
    return {};
  }
}

export default function SubjectView({ slug }) {
  const { L, lang } = useApp();
  const subject = findSubject(slug);
  const [dateStr, setDateStr] = useState("");
  const [saved, setSaved] = useState("");

  useEffect(() => {
    if (!subject) return;
    const v = loadDates()[subject.name] || "";
    setSaved(v);
    setDateStr(v);
  }, [subject]);

  if (!subject) {
    return (
      <div className="container">
        <p className="empty">{L("Subject not found.", "المادة غير موجودة.")}</p>
        <Link href="/" className="back">{L("← Back", "→ رجوع")}</Link>
      </div>
    );
  }

  const persist = (value) => {
    const dates = loadDates();
    if (value) dates[subject.name] = value;
    else delete dates[subject.name];
    try {
      localStorage.setItem(EXAM_KEY, JSON.stringify(dates));
    } catch (e) {
      console.error("Could not save exam date:", e);
    }
    setSaved(value);
  };

  // العد التنازلي للامتحان
  let examNode = L("⏳ No exam date set", "⏳ لم يُحدد موعد امتحان");
  let urgent = false;
  if (saved) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days = Math.round((new Date(saved + "T00:00:00") - today) / 86400000);
    urgent = days >= 0 && days <= 2;
    if (days < 0) examNode = L("✅ This exam date has passed", "✅ انتهى موعد هذا الامتحان");
    else if (days === 0) examNode = L("🚨 Exam is today!", "🚨 الامتحان اليوم!");
    else
      examNode =
        lang === "ar" ? (
          <>⏳ باقي <span className="mono">{days}</span> يوم على الامتحان</>
        ) : (
          <>⏳ <span className="mono">{days}</span> day(s) left until the exam</>
        );
  }

  return (
    <div className="container">
      <Link href="/" className="back">{L("← Back", "→ رجوع")}</Link>
      <div className="subject-title">
        <h2>📚 {subject.name}</h2>
      </div>

      <div className={"exam-card" + (urgent ? " urgent" : "")}>
        <span>{examNode}</span>
        <input type="date" value={dateStr} onChange={(e) => setDateStr(e.target.value)} />
        <button type="button" onClick={() => dateStr && persist(dateStr)}>{L("Save", "حفظ")}</button>
        <button type="button" className="clear-btn" onClick={() => { setDateStr(""); persist(""); }}>
          {L("Clear", "مسح")}
        </button>
      </div>

      <div className="materials">
        {MATERIALS.map(([key, icon, en, ar]) => (
          <Link key={key} href={`/subject/${subject.slug}/${key}/`} className="material">
            <div className="material-icon">{icon}</div>
            <h3>{lang === "ar" ? ar : key}</h3>
            <p>{lang === "ar" ? ar : en}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
