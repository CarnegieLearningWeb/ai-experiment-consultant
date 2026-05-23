import { config as dotenvConfig } from 'dotenv';
import { fileURLToPath } from 'node:url';
import { dirname, isAbsolute, join } from 'node:path';

// .env lives at the repo root, not in server/. Load it explicitly so it works
// regardless of cwd (workspace dev, `node src/index.js` from server/, etc.).
const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..', '..');
dotenvConfig({ path: join(REPO_ROOT, '.env') });

function resolveFromRepoRoot(p) {
  if (!p) return p;
  return isAbsolute(p) ? p : join(REPO_ROOT, p);
}

const nodeEnv = process.env.NODE_ENV || 'development';

export const config = {
  nodeEnv,
  isDev: nodeEnv !== 'production',
  port: Number(process.env.PORT) || 3001,
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',

  // Filled in once respective milestones land. Don't require them at boot —
  // the server should still start without them so M1 work isn't blocked.
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || null,
  upgradeApiUrl:
    process.env.UPGRADE_API_URL || 'https://upgrade-demo.carnegielearning.com/api',
  // Path to a Google service-account JSON key. Resolved relative to process cwd
  // (which is the repo root under `npm run dev`). Required once M4 wires the
  // simulation feature against the UpGrade demo backend.
  upgradeServiceAccountKeyPath: resolveFromRepoRoot(
    process.env.UPGRADE_SERVICE_ACCOUNT_KEY_PATH || 'upgrade-service-account-key.json',
  ),
};
