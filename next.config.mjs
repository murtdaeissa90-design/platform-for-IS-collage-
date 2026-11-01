/** @type {import('next').NextConfig} */
const nextConfig = {
  // موقع ثابت (Static Export): يُنتج مجلد out ويعمل على Netlify بدون سيرفر.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
