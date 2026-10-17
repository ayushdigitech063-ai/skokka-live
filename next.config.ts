import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.mycityqueen.com",
          },
        ],
        destination: "https://mycityqueen.com/:path*",
        permanent: true,
      },
      {
        source: "/escorts/:path*",
        destination: "/escorts-service/:path*",
        permanent: true,
      },
      {
        source: "/search.",
        destination: "/search",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
