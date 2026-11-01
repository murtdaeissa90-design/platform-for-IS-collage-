"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "./AppProvider";
import { ALL_SUBJECTS } from "@/lib/subjects";
import { STATIC } from "@/data/files";
import { fuzzySearch } from "@/lib/search";
import { buildFileIndex } from "@/lib/files";

const subjectItems = ALL_SUBJECTS.map((s) => ({ type: "subject", ...s }));
const staticFileItems = ALL_SUBJECTS.flatMap((s) =>
  Object.entries(STATIC[s.name] || {}).flatMap(([material, files]) =>
    files.map((f) => ({ type: "file", name: f.name, url: f.url, subject: s.name, slug: s.slug, icon: s.icon, material }))
  )
);

/** بحث تلقائي: المواد + المحاضرات/الشيتات + الامتحانات، يتحمّل الأخطاء الإملائية */
export default function GlobalSearch() {
  const { L, lang } = useApp();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [files, setFiles] = useState(staticFileItems);
  const loaded = useRef(false);
  const box = useRef(null);

  // تحميل فهرس الملفات الكامل عند أول تركيز على مربع البحث
  const warm = () => {
    if (loaded.current) return;
    loaded.current = true;
    buildFileIndex()
      .then((idx) => {
        const seen = new Set();
        const merged = [...staticFileItems, ...idx].filter((f) => {
          const k = f.url + "|" + f.material;
          if (seen.has(k)) return false;
          seen.add(k);
          return true;
        });
        setFiles(merged);
      })
      .catch(() => {});
  };

  const results = useMemo(() => {
    if (!q.trim()) return [];
    const subs = fuzzySearch(subjectItems, q, (s) => [s.name, ...s.aliases], 5);
    const fls = fuzzySearch(files, q, (f) => [f.name, f.subject], 6);
    return [...subs, ...fls];
  }, [q, files]);

  useEffect(() => setActive(0), [q]);
  useEffect(() => {
    const onDoc = (e) => {
      if (box.current && !box.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const choose = (item) => {
    setOpen(false);
    setQ("");
    if (item.type === "subject") router.push(`/subject/${item.slug}/`);
    else router.push(`/subject/${item.slug}/${item.material}/?q=${encodeURIComponent(item.name)}`);
  };

  const onKey = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      choose(results[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const materialLabel = (m) =>
    m === "Exams" ? L("Exam", "امتحان") : L("Lecture / Sheet", "محاضرة / شيت");

  return (
    <div className="search" ref={box}>
      <input
        type="search"
        role="combobox"
        aria-expanded={open && results.length > 0}
        aria-controls="gs-list"
        autoComplete="off"
        value={q}
        placeholder={L("🔎 Search subjects, lectures, sheets...", "🔎 ابحث عن مادة أو محاضرة أو شيت...")}
        onFocus={() => {
          warm();
          setOpen(true);
        }}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onKeyDown={onKey}
      />
      {open && q.trim() && (
        <ul className="gs-list" id="gs-list" role="listbox">
          {results.length === 0 && (
            <li className="gs-empty">{L("No matches. Try fewer letters.", "لا توجد نتائج. جرّب كلمة أقصر.")}</li>
          )}
          {results.map((item, i) => (
            <li
              key={item.type + (item.url || item.slug) + i}
              role="option"
              aria-selected={i === active}
              className={"gs-item" + (i === active ? " active" : "")}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => {
                e.preventDefault();
                choose(item);
              }}
            >
              <span className="gs-ico">{item.icon}</span>
              <span className="gs-text">
                <b>{item.name}</b>
                <small>
                  {item.type === "subject"
                    ? L("Subject", "مادة")
                    : `${item.subject} · ${materialLabel(item.material)}`}
                </small>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
