"use client";

import { useApp } from "./AppProvider";

/** الخلفية الزرقاء + زر تبديل اللغة، تحيط بنموذج تسجيل الدخول */
export default function LoginShell({ children }) {
  const { lang, toggleLang } = useApp();
  return (
    <main className="lg-page">
      <button type="button" className="lg-lang" onClick={toggleLang}>
        {lang === "ar" ? "English" : "عربي"}
      </button>
      <div className="lg-wrap">{children}</div>
    </main>
  );
}
