import { config as loadDotenv } from 'dotenv';
import { fileURLToPath } from 'node:url';
import { dirname, isAbsolute, join } from 'node:path';

// .env and the service-account key live at the repo root, but the server's cwd
// under `npm run dev` is server/. Load the env file and resolve relative paths
// against the repo root. Import this once, first, before anything reads env.
const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
loadDotenv({ path: join(REPO_ROOT, '.env') });

export const fromRepoRoot = (p) => (isAbsolute(p) ? p : join(REPO_ROOT, p));
