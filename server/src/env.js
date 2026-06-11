import { config as loadDotenv } from 'dotenv';
import { fileURLToPath } from 'node:url';
import { dirname, isAbsolute, join } from 'node:path';

// This app is backend-only, so .env and the service-account key live in server/.
// Resolve them relative to this file so loading works regardless of cwd. Import
// this once, first, before anything reads env.
const SERVER_DIR = join(dirname(fileURLToPath(import.meta.url)), '..');
loadDotenv({ path: join(SERVER_DIR, '.env') });

export const fromServerDir = (p) => (isAbsolute(p) ? p : join(SERVER_DIR, p));
