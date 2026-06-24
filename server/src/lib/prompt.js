import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// This branch is intentionally presentation-only. The system prompt describes
// one fixed MiniMathApp conversation rather than a general consulting product.
export const SYSTEM_PROMPT = readFileSync(
  join(__dirname, 'demo-system-prompt.md'),
  'utf8',
);

export function getSystemPrompt() {
  return SYSTEM_PROMPT;
}
