import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray package-lock.json in the home directory makes Turbopack infer the
  // workspace root as C:\Users\TFC. Pin it to this project instead.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
