import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  async redirects() {
    return [
      {
        source: "/search.",
        destination: "/search",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;