import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

// Pin the Turbopack root to this directory. Without it Next walks up looking for
// a lockfile and finds an unrelated package-lock.json in the home directory.
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;
