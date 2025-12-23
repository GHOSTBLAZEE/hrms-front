/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // 🔑 Sanctum CSRF
      {
        source: "/sanctum/:path*",
        destination: "http://localhost/sanctum/:path*",
      },

      // 🔑 API routes
      {
        source: "/api/:path*",
        destination: "http://localhost/api/:path*",
      },
    ];
  },
};

export default nextConfig;
