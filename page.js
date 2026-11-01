"use client";

import Link from "next/link";
import LoginShell from "@/components/LoginShell";
import LoginForm from "@/components/LoginForm";
import AdminDashboard from "@/components/AdminDashboard";
import { useApp } from "@/components/AppProvider";
import { useAuth } from "@/components/AuthProvider";

export default function AdminPage() {
  const { L } = useApp();
  const { session, loading, ready, isAdmin, recovery, signOut, user } = useAuth();

  if (loading || (session && !ready)) return <div className="splash" aria-busy="true">🔐</div>;

  // نفس واجهة تسجيل الدخول المستخدمة للطلاب
  if (!session || recovery) {
    return (
      <LoginShell>
        <LoginForm mode="admin" />
      </LoginShell>
    );
  }

  if (!isAdmin) {
    return (
      <LoginShell>
        <div className="lg-card">
          <div className="lg-head">
            <h1>{L("No admin access", "لا توجد صلاحية أدمن")}</h1>
            <p>
              {L(
                `${user?.email} is not an admin account. Ask the platform owner to grant access.`,
                `الحساب ${user?.email} ليس حساب أدمن. اطلب من مالك المنصة منحك الصلاحية.`
              )}
            </p>
          </div>
          <Link href="/" className="lg-submit lg-linkbtn">{L("Back to the platform", "العودة للمنصة")}</Link>
          <button type="button" className="lg-link strong" onClick={signOut}>{L("Sign out", "تسجيل خروج")}</button>
        </div>
      </LoginShell>
    );
  }

  return <AdminDashboard />;
}
