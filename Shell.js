"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "./AppProvider";
import { useAuth } from "./AuthProvider";
import GlobalSearch from "./GlobalSearch";

/** الهيكل العام للمنصة: الهيدر، التنقل، البحث، الفوتر + حماية الصفحات بتسجيل الدخول */
export default function Shell({ children }) {
  const { L, dark, toggleDark, toggleLang, lang } = useApp();
  const { session, loading, recovery, signOut, displayName } = useAuth();
  const router = useRouter();
  const path = usePathname() || "/";

  const [showAdmin, setShowAdmin] = useState(false);
  const taps = useRef({ n: 0, t: null });

  useEffect(() => {
    if (!loading && (!session || recovery)) router.replace("/login/");
  }, [loading, session, recovery, router]);

  if (loading || !session || recovery) {
    return <div className="splash" aria-busy="true">🎓</div>;
  }

  const onLogoTap = () => {
    const s = taps.current;
    s.n += 1;
    clearTimeout(s.t);
    s.t = setTimeout(() => (s.n = 0), 3000);
    if (s.n >= 5) {
      s.n = 0;
      setShowAdmin(true);
    }
  };

  const is = (p) => (p === "/" ? path === "/" : path.startsWith(p));

  return (
    <>
      <header>
        <h1>{L("🎓 Students IS Education Platform", "🎓 منصة Students IS التعليمية")}</h1>
        <p>{L("Al-Bayan University", "جامعة البيان")}</p>
        <p>{L("College of Computer Science & IT", "كلية علوم الحاسوب وتقانة المعلومات")}</p>
        <p>{L("Information Systems Department", "قسم نظم المعلومات")}</p>
      </header>

      <nav>
        <Link href="/" className={is("/") ? "active" : ""}>{L("🏠 Home", "🏠 الرئيسية")}</Link>
        <Link href="/tasks/" className={is("/tasks") ? "active" : ""}>{L("📝 Tasks", "📝 مهامي")}</Link>
        <Link href="/about/" className={is("/about") ? "active" : ""}>{L("ℹ️ About", "ℹ️ حول المنصة")}</Link>
        <button type="button" onClick={toggleDark} aria-label={L("Toggle dark mode", "تبديل الوضع الليلي")}>
          {dark ? "☀️" : "🌙"}
        </button>
        <button type="button" onClick={toggleLang}>{lang === "ar" ? "English" : "عربي"}</button>
        <button type="button" onClick={signOut} title={displayName}>
          {L("Sign out", "تسجيل خروج")}
        </button>
      </nav>

      <GlobalSearch />

      <main>{children}</main>

      <footer>
        <p id="footerLogo" onClick={onLogoTap} style={{ cursor: "default", userSelect: "none" }}>
          🎓 Students IS Education Platform
        </p>
        <p className="contact">
          👤 Murtda eissa |  📧Murtdaeissa90@gmail.com
        </p>
        <div className="credits">
          <span className="label">{L("Developed by", "تطوير وإعداد")}</span>
          <span className="names">
            {L("Murtda Eissa", "مرتضى عيسى")} <i>•</i> {L("Abdullah Ismail", "عبدالله إسماعيل")}
          </span>
        </div>
        <p>© 2026 All Rights Reserved</p>
        {showAdmin && (
          <Link href="/admin/" className="admin-link">🔑 Admin</Link>
        )}
      </footer>
    </>
  );
}
