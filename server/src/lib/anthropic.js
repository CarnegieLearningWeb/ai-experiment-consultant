import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config.js';

let client = null;

export function getAnthropicClient() {
  if (!config.anthropicApiKey) {
    const err = new Error(
      'ANTHROPIC_API_KEY is not set. Add it to .env and restart the server.',
    );
    err.status = 503;
    err.code = 'missing_api_key';
    err.expose = true;
    throw err;
  }
  if (!client) {
    client = new Anthropic({ apiKey: config.anthropicApiKey });
  }
  return client;
}

export const DEFAULT_MODEL = process.env.ANTHROPIC_MODEL || 'claude-opus-4-7';
