"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

const Ctx = createContext(null);
const LANG_KEY = "students_is_lang";
const DARK_KEY = "students_is_dark_mode";

export function AppProvider({ children }) {
  const [lang, setLang] = useState("en");
  const [dark, setDark] = useState(false);

  useEffect(() => {
    try {
      const l = localStorage.getItem(LANG_KEY);
      if (l === "ar" || l === "en") setLang(l);
      setDark(localStorage.getItem(DARK_KEY) === "1");
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  useEffect(() => {
    document.body.classList.toggle("dark", dark);
  }, [dark]);

  const toggleLang = () => {
    const next = lang === "en" ? "ar" : "en";
    setLang(next);
    try {
      localStorage.setItem(LANG_KEY, next);
    } catch {}
  };
  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    try {
      localStorage.setItem(DARK_KEY, next ? "1" : "0");
    } catch {}
  };

  // L("English text", "النص العربي")
  const L = useCallback((en, ar) => (lang === "ar" ? ar : en), [lang]);

  return <Ctx.Provider value={{ lang, dark, toggleLang, toggleDark, L }}>{children}</Ctx.Provider>;
}

export const useApp = () => useContext(Ctx);
