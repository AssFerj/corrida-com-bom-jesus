import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Gera .next/standalone: servidor enxuto usado na imagem Docker (Dokploy)
  output: "standalone",
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
