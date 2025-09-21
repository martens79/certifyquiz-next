// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // <-- top-level, NON dentro experimental
  turbopack: {
    root: __dirname, // forza la root corretta per zittire il warning
  },
};

export default nextConfig;
