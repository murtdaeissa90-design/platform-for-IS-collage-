"use client";

import { useState } from "react";
import { useApp } from "./AppProvider";
import { useAuth } from "./AuthProvider";
import { debugDetail } from "@/lib/debug";

function friendly(err, L) {
  const m = String(err?.message || "").toLowerCase();
  if (m.includes("invalid login"))
    return L("Email or password is incorrect.", "البريد الإلكتروني أو كلمة المرور غير صحيحة.");
  if (m.includes("email not confirmed"))
    return L("Confirm your email first, then sign in.", "أكّد بريدك الإلكتروني أولاً ثم سجّل الدخول.");
  if (m.includes("already registered") || m.includes("already been registered"))
    return L("This email already has an account. Sign in instead.", "هذا البريد لديه حساب بالفعل. سجّل الدخول بدلاً من ذلك.");
  if (m.includes("password") && (m.includes("least") || m.includes("short") || m.includes("weak")))
    return L("Password must be at least 6 characters.", "يجب ألا تقل كلمة المرور عن 6 أحرف.");
  if (m.includes("unable to validate email") || m.includes("invalid format") || m.includes("invalid email"))
    return L("The email address is not valid. Use a full address like name@gmail.com.", "البريد الإلكتروني غير صحيح. اكتبه كاملاً مثل name@gmail.com.");
  if (m.includes("signups not allowed") || m.includes("signup is disabled") || m.includes("sign up is disabled"))
    return L("New sign-ups are turned off. Contact the platform admin.", "إنشاء الحسابات الجديدة متوقف. تواصل مع مسؤول المنصة.");
  if (m.includes("database error"))
    return L("Account setup failed on the server. Tell the platform admin to run the database setup.", "فشل إعداد الحساب في الخادم. أبلغ مسؤول المنصة بتشغيل إعداد قاعدة البيانات.");
  if (m.includes("rate limit") || m.includes("too many"))
    return L("Too many attempts. Wait a minute and try again.", "محاولات كثيرة. انتظر دقيقة ثم حاول مجدداً.");
  if (m.includes("failed to fetch") || m.includes("network"))
    return L("No connection. Check your internet and try again.", "لا يوجد اتصال. تحقق من الإنترنت وحاول مجدداً.");
  console.error("auth error:", err);
  return L("Something went wrong. Try again.", "حدث خطأ. حاول مجدداً.") + debugDetail(err);
}

const Icon = ({ children, className = "lg-ico" }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4A5878"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);
const MailIcon = () => (
  <Icon><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M3 8l9 6 9-6" /></Icon>
);
const LockIcon = () => (
  <Icon><rect x="4" y="10" width="16" height="11" rx="3" /><path d="M8 10V7a4 4 0 018 0v3" /></Icon>
);
const UserIcon = () => (
  <Icon><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" /></Icon>
);

/** نفس واجهة تسجيل الدخول للطلاب وللأدمن. mode = "student" | "admin" */
export default function LoginForm({ mode = "student" }) {
  const { L, lang } = useApp();
  const { signIn, signUp, sendReset, setNewPassword, recovery } = useAuth();
  const isAdmin = mode === "admin";

  const [view, setView] = useState("signin"); // signin | signup | forgot
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const current = recovery ? "reset" : view;

  const copy = {
    signin: {
      title: isAdmin ? L("Admin sign in", "دخول الأدمن") : L("Welcome back", "أهلاً بعودتك"),
      sub: isAdmin
        ? L("Only approved admins can manage files and students.", "إدارة الملفات والطلاب متاحة للأدمن فقط.")
        : L("Sign in to continue to your account", "سجّل الدخول لمتابعة حسابك"),
      button: L("Sign In", "تسجيل الدخول"),
    },
    signup: {
      title: L("Create your account", "أنشئ حسابك"),
      sub: L("Use your full name and email to get started", "أدخل اسمك الكامل وبريدك للبدء"),
      button: L("Create account", "إنشاء الحساب"),
    },
    forgot: {
      title: L("Reset your password", "استعادة كلمة المرور"),
      sub: L("We'll email you a link to set a new one", "سنرسل لك رابطاً لتعيين كلمة مرور جديدة"),
      button: L("Send reset link", "إرسال الرابط"),
    },
    reset: {
      title: L("Choose a new password", "اختر كلمة مرور جديدة"),
      sub: L("Use at least 6 characters", "استخدم 6 أحرف على الأقل"),
      button: L("Save password", "حفظ كلمة المرور"),
    },
  }[current];

  const go = (v) => {
    setView(v);
    setError("");
    setInfo("");
  };

  async function onSubmit(e) {
    e.preventDefault();
    if (busy) return;
    setError("");
    setInfo("");

    if (current !== "reset" && !email.trim()) {
      setError(L("Enter your email address.", "أدخل بريدك الإلكتروني."));
      return;
    }
    if (current !== "reset" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setError(L("Enter a full email address like name@gmail.com.", "اكتب البريد الإلكتروني كاملاً مثل name@gmail.com."));
      return;
    }
    if (current === "signup" && name.trim().length < 3) {
      setError(L("Enter your full name.", "أدخل اسمك الكامل."));
      return;
    }
    if ((current === "signin" || current === "signup" || current === "reset") && pw.length < (current === "signin" ? 1 : 6)) {
      setError(
        current === "signin"
          ? L("Enter your password.", "أدخل كلمة المرور.")
          : L("Password must be at least 6 characters.", "يجب ألا تقل كلمة المرور عن 6 أحرف.")
      );
      return;
    }

    setBusy(true);
    try {
      if (current === "signin") {
        const { error: err } = await signIn(email.trim(), pw);
        if (err) setError(friendly(err, L));
      } else if (current === "signup") {
        const { data, error: err } = await signUp(name.trim(), email.trim(), pw);
        if (err) setError(friendly(err, L));
        else if (!data.session) {
          setInfo(L("Account created. Check your email to confirm it, then sign in.", "تم إنشاء الحساب. افتح بريدك لتأكيده ثم سجّل الدخول."));
          setView("signin");
          setPw("");
        }
      } else if (current === "forgot") {
        const { error: err } = await sendReset(email.trim());
        if (err) setError(friendly(err, L));
        else setInfo(L("Reset link sent. Check your inbox.", "تم إرسال الرابط. تحقق من بريدك."));
      } else if (current === "reset") {
        const { error: err } = await setNewPassword(pw);
        if (err) setError(friendly(err, L));
        else setInfo(L("Password updated.", "تم تحديث كلمة المرور."));
      }
    } catch (err) {
      setError(friendly(err, L));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="lg-card">
      <div className="lg-brand">
        <div className="lg-logo">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#F6F4EE" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2 9l10-5 10 5-10 5-10-5z" />
            <path d="M6 11.5V16c0 1.4 2.7 3 6 3s6-1.6 6-3v-4.5" />
            <path d="M22 9v6" />
          </svg>
        </div>
        <div className="lg-brand-text">
          <div className="lg-brand-name" dir="ltr">Students IS</div>
          <div className="lg-brand-sub">
            {L("Al-Bayan University · Information Systems", "جامعة البيان · قسم نظم المعلومات")}
          </div>
        </div>
      </div>

      <div className="lg-head">
        <h1>{copy.title}</h1>
        <p>{copy.sub}</p>
      </div>

      <form className="lg-form" onSubmit={onSubmit} noValidate>
        {current === "signup" && (
          <div className="lg-field">
            <label htmlFor="lg-name">{L("Full name", "الاسم الكامل")}</label>
            <div className="lg-input">
              <UserIcon />
              <input id="lg-name" type="text" autoComplete="name" value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={L("Your full name", "اسمك الكامل")} />
            </div>
          </div>
        )}

        {current !== "reset" && (
          <div className="lg-field">
            <label htmlFor="lg-email">{L("Email address", "البريد الإلكتروني")}</label>
            <div className="lg-input">
              <MailIcon />
              <input id="lg-email" type="email" dir="ltr" autoComplete="email" value={email}
                onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
            </div>
          </div>
        )}

        {current !== "forgot" && (
          <div className="lg-field">
            <div className="lg-row">
              <label htmlFor="lg-pw">
                {current === "reset" ? L("New password", "كلمة المرور الجديدة") : L("Password", "كلمة المرور")}
              </label>
              {current === "signin" && (
                <button type="button" className="lg-link" onClick={() => go("forgot")}>
                  {L("Forgot password?", "نسيت كلمة المرور؟")}
                </button>
              )}
            </div>
            <div className="lg-input">
              <LockIcon />
              <input id="lg-pw" type={show ? "text" : "password"} value={pw}
                autoComplete={current === "signin" ? "current-password" : "new-password"}
                onChange={(e) => setPw(e.target.value)}
                placeholder={L("Enter your password", "أدخل كلمة المرور")} className="lg-pw" />
              <button type="button" className="lg-eye"
                aria-label={show ? L("Hide password", "إخفاء كلمة المرور") : L("Show password", "إظهار كلمة المرور")}
                onClick={() => setShow(!show)}>
                {show ? (
                  <Icon className="">
                    <path d="M3 3l18 18" />
                    <path d="M10.6 6.1A10 10 0 0112 5c6.4 0 10 7 10 7a17 17 0 01-3.2 4M6.5 6.8C3.7 8.6 2 12 2 12s3.6 7 10 7a9.8 9.8 0 004.2-.9" />
                    <path d="M9.9 9.9a3 3 0 004.2 4.2" />
                  </Icon>
                ) : (
                  <Icon className="">
                    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </Icon>
                )}
              </button>
            </div>
          </div>
        )}

        {error && <div className="lg-msg err" role="alert">{error}</div>}
        {info && <div className="lg-msg ok" role="status">{info}</div>}

        <button type="submit" className="lg-submit" disabled={busy}>
          {busy ? L("Please wait…", "يرجى الانتظار…") : copy.button}
        </button>
      </form>

      {!isAdmin && current !== "reset" && (
        <>
          <div className="lg-or">
            <span />
            <em>{L("or", "أو")}</em>
            <span />
          </div>
          <div className="lg-switch">
            {current === "signin" ? (
              <>
                {L("Don't have an account?", "ليس لديك حساب؟")}{" "}
                <button type="button" className="lg-link strong" onClick={() => go("signup")}>
                  {L("Create one", "أنشئ حساباً")}
                </button>
              </>
            ) : (
              <>
                {L("Already have an account?", "لديك حساب بالفعل؟")}{" "}
                <button type="button" className="lg-link strong" onClick={() => go("signin")}>
                  {L("Sign in", "سجّل الدخول")}
                </button>
              </>
            )}
          </div>
        </>
      )}
      {isAdmin && current === "forgot" && (
        <div className="lg-switch">
          <button type="button" className="lg-link strong" onClick={() => go("signin")}>
            {lang === "ar" ? "رجوع لتسجيل الدخول" : "Back to sign in"}
          </button>
        </div>
      )}
    </div>
  );
}
