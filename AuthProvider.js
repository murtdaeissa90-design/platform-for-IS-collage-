"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const Ctx = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recovery, setRecovery] = useState(false);
  // undefined = قيد التحميل، null = لا يوجد ملف شخصي
  const [profile, setProfile] = useState(undefined);

  useEffect(() => {
    let alive = true;
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (alive) setSession(data.session || null);
      })
      .catch(() => {})
      .finally(() => {
        if (alive) setLoading(false);
      });
    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s || null);
      if (event === "PASSWORD_RECOVERY") setRecovery(true);
      if (event === "SIGNED_OUT") setRecovery(false);
    });
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const uid = session?.user?.id;
  useEffect(() => {
    if (!uid) {
      setProfile(undefined);
      return;
    }
    let alive = true;
    setProfile(undefined);
    supabase
      .from("profiles")
      .select("full_name,email,role")
      .eq("id", uid)
      .maybeSingle()
      .then(({ data, error }) => {
        if (alive) setProfile(error ? null : data || null);
      });
    return () => {
      alive = false;
    };
  }, [uid]);

  const user = session?.user || null;
  const value = {
    session,
    user,
    profile,
    loading,
    recovery,
    ready: !loading && (!session || profile !== undefined),
    isAdmin: profile?.role === "admin",
    displayName: profile?.full_name || user?.user_metadata?.full_name || user?.email || "",
    signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }),
    signUp: (name, email, password) =>
      supabase.auth.signUp({ email, password, options: { data: { full_name: name } } }),
    signOut: () => supabase.auth.signOut(),
    sendReset: (email) =>
      supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + "/login/" }),
    setNewPassword: async (password) => {
      const res = await supabase.auth.updateUser({ password });
      if (!res.error) setRecovery(false);
      return res;
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
