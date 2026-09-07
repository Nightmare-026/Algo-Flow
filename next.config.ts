import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/visualizer/matrix-row-traversal",
        destination: "/visualizer/row-wise-traversal",
        permanent: true,
      },
      {
        source: "/visualizer/linked-list-types",
        destination: "/visualizer/sll-traversal",
        permanent: true,
      },
    ];
  },
  async headers() {
    const isDev = process.env.NODE_ENV === "development";
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' blob: data: https:;
      font-src 'self' data: https:;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      connect-src 'self' ${isDev ? "ws: wss: http://localhost:* http://127.0.0.1:*" : ""} https://*.supabase.co https://accounts.google.com https://github.com https://va.vercel-scripts.com https://*.upstash.io;
      ${isDev ? "" : "upgrade-insecure-requests;"}
    `
      .replace(/\s{2,}/g, " ")
      .trim();

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: cspHeader },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
          { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
        ],
      },
    ];
  },
};

export default nextConfig;
