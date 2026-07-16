import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Let LAN devices load dev resources (HMR, chunks) when the site is
  // opened via the machine's IP instead of localhost.
  allowedDevOrigins: ["192.168.1.133"],
  // Pin the workspace root to this app (a sibling lockfile from the old
  // vanilla prototype sits one level up and would otherwise be picked).
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
