import { createReader } from "@keystatic/core/reader";
import config from "../../keystatic.config";

// Reads the .mdoc files committed in this repo, not the GitHub API. Keystatic
// commits every edit (see keystatic.config.tsx), Vercel rebuilds on that push,
// and this reader picks the changes up from the checkout - which keeps content
// and the images under public/ in lockstep. Swap to createGitHubReader from
// @keystatic/core/reader/github only if you need edits live without a rebuild.
export const reader = createReader(process.cwd(), config);
