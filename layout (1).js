import { Inter, Sora, JetBrains_Mono, Amiri, IBM_Plex_Sans_Arabic, Cairo } from "next/font/google";
import { AppProvider } from "@/components/AppProvider";
import { AuthProvider } from "@/components/AuthProvider";
import "./globals.css";

// الخطوط الإنجليزية: Inter (أساسي) · Sora (العناوين) · JetBrains Mono (الأكواد والأرقام)
const inter = Inter({ subsets: ["latin"], variable: "--f-inter", display: "swap" });
const sora = Sora({ subsets: ["latin"], variable: "--f-sora", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--f-mono", display: "swap" });

// الخطوط العربية: Amiri Bold (العناوين) · IBM Plex Sans Arabic Regular (النص) · Cairo SemiBold (الواجهة)
const amiri = Amiri({ subsets: ["arabic", "latin"], weight: ["400", "700"], variable: "--f-amiri", display: "swap" });
const plex = IBM_Plex_Sans_Arabic({ subsets: ["arabic", "latin"], weight: ["400"], variable: "--f-plex", display: "swap" });
const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--f-cairo", display: "swap" }); // خط متغيّر: نستخدم الوزن 600 (SemiBold) من CSS

export const metadata = {
  title: "Students IS Education Platform",
  description: "منصة تعليمية لتنظيم المواد الجامعية والشيتات والمحاضرات والامتحانات - جامعة البيان، قسم نظم المعلومات",
};

export default function RootLayout({ children }) {
  const fonts = [inter, sora, mono, amiri, plex, cairo].map((f) => f.variable).join(" ");
  return (
    <html lang="en" dir="ltr" className={fonts} suppressHydrationWarning>
      <body>
        <AppProvider>
          <AuthProvider>{children}</AuthProvider>
        </AppProvider>
      </body>
    </html>
  );
}
