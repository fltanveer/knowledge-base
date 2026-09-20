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
  // Keystatic normalises the dev host to 127.0.0.1 before the GitHub OAuth
  // round-trip, so the admin UI is used on 127.0.0.1 while the dev server is
  // started on localhost. Without this, Next blocks the HMR and dev-asset
  // requests coming from that origin.
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
