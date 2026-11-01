// تفاصيل الأخطاء التقنية تظهر للمطوّر فقط:
// افتح الموقع بإضافة ?debug=1 للرابط مرة واحدة (تُحفظ في المتصفح)، ولإيقافها استخدم ?debug=0
export function debugDetail(err) {
  try {
    const q = new URLSearchParams(window.location.search).get("debug");
    if (q === "1") localStorage.setItem("students_is_debug", "1");
    if (q === "0") localStorage.removeItem("students_is_debug");
    if (localStorage.getItem("students_is_debug") === "1" && err?.message) return " (" + err.message + ")";
  } catch {}
  return "";
}
