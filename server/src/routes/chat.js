import { Router } from 'express';
import { getAnthropicClient, DEFAULT_MODEL } from '../lib/anthropic.js';
import { SYSTEM_PROMPT } from '../lib/prompt.js';
import { ALLOWED_UPLOADS, readUploadBytes } from '../lib/uploads.js';

export const chatRouter = Router();

function validateAttachments(attachments) {
  if (attachments === undefined) return null;
  if (!Array.isArray(attachments)) return 'attachments must be an array if present';
  for (const a of attachments) {
    if (!a || typeof a.id !== 'string') return 'each attachment must have id: string';
  }
  return null;
}

function validateMessages(messages) {
  if (!Array.isArray(messages) || messages.length === 0) {
    return 'messages must be a non-empty array';
  }
  for (const m of messages) {
    if (!m || (m.role !== 'user' && m.role !== 'assistant') || typeof m.content !== 'string') {
      return 'each message must have role: "user"|"assistant" and content: string';
    }
    const attErr = validateAttachments(m.attachments);
    if (attErr) return attErr;
  }
  if (messages[0].role !== 'user') return 'first message must have role: "user"';
  return null;
}

// Convert one message from the wire shape to an Anthropic-API message,
// inlining attachments as the appropriate content blocks.
function toAnthropicMessage(m) {
  const attachments = m.attachments || [];
  if (attachments.length === 0) {
    return { role: m.role, content: m.content };
  }

  const blocks = [];
  for (const a of attachments) {
    const meta = readUploadBytes(a.id);
    if (!meta) {
      // Attachment was uploaded against a previous server process (in-memory
      // registry is empty after restart) or otherwise missing. Note it inline
      // so the model knows something is being referenced.
      blocks.push({
        type: 'text',
        text: `[attachment ${a.id} unavailable — server was restarted or upload expired]`,
      });
      continue;
    }
    const spec = ALLOWED_UPLOADS[meta.mimeType];
    if (spec?.kind === 'image') {
      blocks.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: meta.mimeType,
          data: meta.bytes.toString('base64'),
        },
      });
    } else {
      // No path yet for non-image kinds (e.g. PDFs). Noted for the user but
      // not failed — falls back to a text marker so the conversation continues.
      blocks.push({
        type: 'text',
        text: `[attachment "${meta.filename}" of type ${meta.mimeType} is not yet supported in chat]`,
      });
    }
  }
  if (m.content) blocks.push({ type: 'text', text: m.content });
  return { role: m.role, content: blocks };
}

function processStreamEvent(event, ctx) {
  if (
    event.type === 'content_block_delta' &&
    event.delta?.type === 'text_delta' &&
    event.delta.text
  ) {
    ctx.write({ type: 'delta', text: event.delta.text });
  } else if (event.type === 'message_start' && event.message?.usage) {
    Object.assign(ctx.usage, event.message.usage);
  } else if (event.type === 'message_delta') {
    if (event.delta?.stop_reason) ctx.stopReason = event.delta.stop_reason;
    if (event.usage) Object.assign(ctx.usage, event.usage);
  }
}

// POST /api/v1/ai-consultant/chat
// Body:  { messages: [{ role: "user" | "assistant", content: string }, ...] }
// Response: application/x-ndjson stream of:
//   {"type":"delta","text":"..."}\n
//   {"type":"done","stopReason":"end_turn","usage":{...}}\n
//   {"type":"error","code":"...","message":"..."}\n
chatRouter.post('/', async (req, res, next) => {
  const validationError = validateMessages(req.body?.messages);
  if (validationError) {
    return res
      .status(400)
      .json({ error: { code: 'invalid_request', message: validationError } });
  }

  let client;
  try {
    client = getAnthropicClient();
  } catch (err) {
    return next(err);
  }

  res.status(200);
  res.setHeader('Content-Type', 'application/x-ndjson');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('X-Accel-Buffering', 'no'); // disable proxy buffering
  res.flushHeaders?.();

  const ctx = {
    write: (obj) => {
      if (!res.writableEnded) res.write(JSON.stringify(obj) + '\n');
    },
    stopReason: null,
    usage: {
      input_tokens: 0,
      output_tokens: 0,
      cache_creation_input_tokens: 0,
      cache_read_input_tokens: 0,
    },
  };

  try {
    const stream = await client.messages.create({
      model: DEFAULT_MODEL,
      max_tokens: 64000,
      thinking: { type: 'adaptive' },
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: req.body.messages.map(toAnthropicMessage),
      stream: true,
    });

    for await (const event of stream) {
      processStreamEvent(event, ctx);
    }

    ctx.write({ type: 'done', stopReason: ctx.stopReason, usage: ctx.usage });
    res.end();
  } catch (err) {
    console.error('[chat] anthropic stream error:', err?.message || err);
    const code = err?.status === 429 ? 'rate_limited' : err?.code || 'anthropic_error';
    ctx.write({
      type: 'error',
      code,
      message: err?.message || 'Anthropic API error',
    });
    res.end();
  }
});
