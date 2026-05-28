import { api } from './api.js';
import { marked } from 'marked';

marked.setOptions({ gfm: true, breaks: true });

const SEED_GREETING = `Hi, I'm your AI consultant to help you run experiments on your learning app using UpGrade, an A/B testing platform for education software.

Can you tell me about your learning app? What does it do and who is it for?`;

const STARTER_CHIPS = [
  "I don't have an app yet",
  'Walk me through with an example',
];

const COPY_ICON_SVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <rect x="8" y="8" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.6"/>
  <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" stroke="currentColor" stroke-width="1.6"/>
</svg>`;

const CHECK_ICON_SVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

function makeSeedMessage() {
  return {
    role: 'assistant',
    isSeed: true,
    segments: [{ type: 'text', content: SEED_GREETING }],
  };
}

// Derive the plain-text content of a message for the Anthropic payload. User
// messages carry a `content` string; assistant messages carry ordered
// `segments` where each text segment contributes its content (tool segments
// are skipped — the AI's tool interactions don't replay into subsequent turns).
function messageContent(msg) {
  if (msg.segments) {
    return msg.segments
      .filter((s) => s.type === 'text')
      .map((s) => s.content)
      .join('');
  }
  return msg.content || '';
}

function renderMarkdown(text) {
  if (!text) return '';
  const out = marked.parse(text);
  return typeof out === 'string' ? out : '';
}

function escapeHtml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export function initChatApp({
  messagesEl,
  starterChipsEl,
  formEl,
  inputEl,
  fileInputEl,
  sendBtn,
  attachmentTrayEl,
  newChatBtn,
  artifactPanelEl,
  artifactTitleEl,
  artifactBodyEl,
  artifactCopyBtn,
  artifactDownloadBtn,
  artifactCloseBtn,
  lightboxEl,
  lightboxImgEl,
  lightboxCloseBtn,
}) {
  const state = {
    messages: [makeSeedMessage()],
    pendingAttachment: null,
    isSending: false,
    artifacts: new Map(),
    openArtifactId: null,
    isPinnedToBottom: true,
    // First-render animation flags. Once a fade-up plays we don't want to
    // replay it on every re-render — the flag flips to true after the first
    // render that includes the seed or chips, and resets in handleNewChat.
    seedAnimated: false,
    chipsAnimated: false,
  };

  // Track the pending "Copy → Check" timeout so rapid clicks don't stack.
  let copyResetTimeout = null;

  // ===========================================================================
  // Lightbox (native <dialog>)
  // ===========================================================================

  function openLightbox(src, alt) {
    if (!lightboxEl || !lightboxImgEl) return;
    lightboxImgEl.src = src;
    lightboxImgEl.alt = alt || '';
    if (typeof lightboxEl.showModal === 'function') {
      lightboxEl.showModal();
    } else {
      lightboxEl.setAttribute('open', '');
    }
  }

  function closeLightbox() {
    if (!lightboxEl) return;
    if (typeof lightboxEl.close === 'function') {
      lightboxEl.close();
    } else {
      lightboxEl.removeAttribute('open');
    }
    if (lightboxImgEl) lightboxImgEl.src = '';
  }

  lightboxCloseBtn?.addEventListener('click', closeLightbox);
  // Click on the backdrop (the dialog element itself, outside the image) closes.
  lightboxEl?.addEventListener('click', (event) => {
    if (event.target === lightboxEl) closeLightbox();
  });

  // ===========================================================================
  // Message rendering
  // ===========================================================================

  function renderMessageAttachments(msg, li) {
    if (!msg.attachments?.length) return;
    const wrap = document.createElement('div');
    wrap.className = 'msg__attachments';
    for (const a of msg.attachments) {
      if (a.previewUrl) {
        const img = document.createElement('img');
        img.className = 'msg__thumb';
        img.src = a.previewUrl;
        img.alt = a.filename || 'attachment';
        img.addEventListener('click', () => openLightbox(a.previewUrl, a.filename));
        wrap.appendChild(img);
      } else {
        const chip = document.createElement('div');
        chip.className = 'msg__attachment';
        chip.textContent = `📎 ${a.filename || a.id}`;
        wrap.appendChild(chip);
      }
    }
    li.appendChild(wrap);
  }

  const TOOL_RUN_ICONS = { error: '⚠', done: '✓' };

  function buildToolSegment(segment) {
    const wrap = document.createElement('div');
    wrap.className = 'tool-runs';

    const card = document.createElement('div');
    card.className = `tool-run tool-run--${segment.status}`;

    const header = document.createElement('div');
    header.className = 'tool-run__header';
    const iconChar = TOOL_RUN_ICONS[segment.status] || '🔧';
    header.innerHTML = `<span class="tool-run__icon">${iconChar}</span> <span class="tool-run__title">${segment.tool}</span>`;
    card.appendChild(header);

    if (segment.progress.length) {
      const list = document.createElement('ul');
      list.className = 'tool-run__progress';
      for (const p of segment.progress) {
        const item = document.createElement('li');
        item.textContent = p;
        list.appendChild(item);
      }
      card.appendChild(list);
    }

    if (segment.error) {
      const err = document.createElement('div');
      err.className = 'tool-run__error';
      err.textContent = segment.error;
      card.appendChild(err);
    }

    wrap.appendChild(card);
    return wrap;
  }

  function buildTextSegment(segment) {
    const bubble = document.createElement('div');
    bubble.className = 'msg__bubble msg__bubble--md';
    bubble.innerHTML = renderMarkdown(segment.content);
    return bubble;
  }

  function buildPendingTail() {
    const tail = document.createElement('div');
    tail.className = 'msg__bubble msg__pending-tail';
    tail.innerHTML =
      '<span class="thinking-dot"></span>' +
      '<span class="thinking-dot"></span>' +
      '<span class="thinking-dot"></span>';
    return tail;
  }

  function renderMessageArtifacts(msg, li) {
    if (!msg.artifactIds?.length) return;
    const wrap = document.createElement('div');
    wrap.className = 'artifact-chips';
    for (const id of msg.artifactIds) {
      const a = state.artifacts.get(id);
      if (!a) continue;
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'artifact-chip';
      chip.title = 'Open in panel';
      chip.innerHTML = `<span class="artifact-chip__icon" aria-hidden="true">📄</span><span>${escapeHtml(a.title || 'Report')}</span>`;
      chip.addEventListener('click', () => openArtifact(id));
      wrap.appendChild(chip);
    }
    li.appendChild(wrap);
  }

  function buildUserBubble(msg, li) {
    if (!msg.content) return;
    const bubble = document.createElement('div');
    bubble.className = 'msg__bubble';
    bubble.textContent = msg.content;
    li.appendChild(bubble);
  }

  function buildAssistantBody(msg, li) {
    const segments = msg.segments || [];
    for (const segment of segments) {
      if (segment.type === 'text' && segment.content) {
        li.appendChild(buildTextSegment(segment));
      } else if (segment.type === 'tool') {
        li.appendChild(buildToolSegment(segment));
      }
    }
    // Tail thinking-dots show in the "gap" states only: before the first
    // delta, between a text block ending and the next thing (typically
    // tool_start), and between tool_end and the next round's first delta.
    // We hide them while text is actively streaming (the text itself is the
    // indicator) and while a tool is running (the tool-runs card is). The
    // server emits a `text_stop` event when a text content block ends so we
    // can tell "delta paused for a tick" apart from "text block fully done".
    if (!msg.pending) return;
    const last = segments.at(-1);
    const activelyStreaming =
      (last?.type === 'text' && !last.completed) ||
      (last?.type === 'tool' && last.status === 'running');
    if (!activelyStreaming) li.appendChild(buildPendingTail());
  }

  function buildMessageLi(msg) {
    const li = document.createElement('li');
    li.className = `msg msg--${msg.role}`;
    if (msg.pending) li.classList.add('msg--pending');
    if (msg.isSeed) {
      li.classList.add('msg--seed');
      if (!state.seedAnimated) li.classList.add('msg--seed-anim');
    }

    renderMessageAttachments(msg, li);

    if (msg.role === 'user') {
      buildUserBubble(msg, li);
    } else {
      buildAssistantBody(msg, li);
    }

    renderMessageArtifacts(msg, li);
    return li;
  }

  function renderMessages() {
    messagesEl.innerHTML = '';
    let hadSeed = false;
    for (const msg of state.messages) {
      if (msg.isSeed) hadSeed = true;
      messagesEl.appendChild(buildMessageLi(msg));
    }
    // Latch the seed animation flag after first render so the fade-up doesn't
    // replay each time we re-render mid-stream.
    if (hadSeed) state.seedAnimated = true;
  }

  // ===========================================================================
  // Starter chips — visible only while the seed greeting is the only message
  // ===========================================================================

  function buildStarterChips() {
    if (!starterChipsEl) return;
    starterChipsEl.innerHTML = '';
    for (const prompt of STARTER_CHIPS) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'starter-chip';
      btn.textContent = prompt;
      btn.dataset.prompt = prompt;
      // Clicking a chip submits the prompt immediately — the chips serve as
      // one-tap shortcuts for users who don't have an app to describe, and
      // making them auto-send removes a redundant click before the consultant
      // can respond.
      btn.addEventListener('click', () => {
        if (state.isSending) return;
        inputEl.value = prompt;
        autosize();
        updateSendDisabled();
        formEl.requestSubmit();
      });
      starterChipsEl.appendChild(btn);
    }
  }

  function renderStarterChipsVisibility() {
    if (!starterChipsEl) return;
    const showChips =
      state.messages.length === 1 && state.messages[0].isSeed;
    starterChipsEl.hidden = !showChips;
    if (showChips && !state.chipsAnimated) {
      starterChipsEl.classList.add('starter-chips--anim');
      state.chipsAnimated = true;
    } else if (!showChips) {
      starterChipsEl.classList.remove('starter-chips--anim');
    }
  }

  // ===========================================================================
  // Attachment tray
  // ===========================================================================

  function clearPendingAttachment() {
    if (state.pendingAttachment?.previewUrl) {
      URL.revokeObjectURL(state.pendingAttachment.previewUrl);
    }
    state.pendingAttachment = null;
    fileInputEl.value = '';
    renderAttachmentTray();
    updateSendDisabled();
  }

  function renderAttachmentTray() {
    attachmentTrayEl.innerHTML = '';
    if (!state.pendingAttachment) {
      attachmentTrayEl.hidden = true;
      return;
    }
    attachmentTrayEl.hidden = false;
    const pa = state.pendingAttachment;

    const chip = document.createElement('div');
    chip.className = 'attachment-chip';
    if (pa.status === 'uploading') chip.classList.add('attachment-chip--uploading');
    if (pa.status === 'error') chip.classList.add('attachment-chip--error');

    if (pa.previewUrl) {
      const img = document.createElement('img');
      img.className = 'attachment-chip__thumb';
      img.src = pa.previewUrl;
      img.alt = '';
      chip.appendChild(img);
    }

    const label = document.createElement('span');
    label.className = 'attachment-chip__name';
    if (pa.status === 'uploading') label.textContent = `Uploading ${pa.filename}…`;
    else if (pa.status === 'error') label.textContent = pa.errorMessage || 'Upload failed';
    else label.textContent = pa.filename;
    chip.appendChild(label);

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'attachment-chip__remove';
    removeBtn.setAttribute('aria-label', `Remove ${pa.filename}`);
    removeBtn.textContent = '×';
    removeBtn.addEventListener('click', () => {
      clearPendingAttachment();
      inputEl.focus();
    });
    chip.appendChild(removeBtn);

    attachmentTrayEl.appendChild(chip);
  }

  function updateSendDisabled() {
    const hasText = inputEl.value.trim().length > 0;
    const pa = state.pendingAttachment;
    const hasReadyAttachment = pa?.status === 'ready';
    const isUploading = pa?.status === 'uploading';
    sendBtn.disabled = state.isSending || isUploading || (!hasText && !hasReadyAttachment);
  }

  // ===========================================================================
  // Artifact panel
  // ===========================================================================

  function renderArtifactPanel() {
    if (!state.openArtifactId) {
      artifactPanelEl.hidden = true;
      return;
    }
    const a = state.artifacts.get(state.openArtifactId);
    if (!a) {
      artifactPanelEl.hidden = true;
      return;
    }
    artifactPanelEl.hidden = false;
    artifactTitleEl.textContent = a.title || 'Report';
    artifactBodyEl.innerHTML = renderMarkdown(a.content);
  }

  function openArtifact(id) {
    if (!state.artifacts.has(id)) return;
    state.openArtifactId = id;
    renderArtifactPanel();
  }

  function closeArtifact() {
    state.openArtifactId = null;
    renderArtifactPanel();
  }

  function downloadCurrentArtifact() {
    const a = state.artifacts.get(state.openArtifactId);
    if (!a) return;
    const blob = new Blob([a.content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const fname =
      (a.title || 'report').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') ||
      'report';
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fname}.md`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  async function copyCurrentArtifact() {
    const a = state.artifacts.get(state.openArtifactId);
    if (!a) return;
    try {
      await navigator.clipboard.writeText(a.content);
      artifactCopyBtn.innerHTML = CHECK_ICON_SVG;
      artifactCopyBtn.classList.add('icon-btn--success');
      artifactCopyBtn.setAttribute('aria-label', 'Copied!');
      artifactCopyBtn.title = 'Copied!';
      if (copyResetTimeout) clearTimeout(copyResetTimeout);
      copyResetTimeout = setTimeout(() => {
        artifactCopyBtn.innerHTML = COPY_ICON_SVG;
        artifactCopyBtn.classList.remove('icon-btn--success');
        artifactCopyBtn.setAttribute('aria-label', 'Copy');
        artifactCopyBtn.title = 'Copy to clipboard';
        copyResetTimeout = null;
      }, 1000);
    } catch (err) {
      console.warn('clipboard copy failed:', err);
    }
  }

  artifactCloseBtn?.addEventListener('click', closeArtifact);
  artifactCopyBtn?.addEventListener('click', copyCurrentArtifact);
  artifactDownloadBtn?.addEventListener('click', downloadCurrentArtifact);

  // Escape closes the artifact panel. (The lightbox is a <dialog> and handles
  // Escape natively, so we only need to handle the panel here.)
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (lightboxEl?.open) return; // <dialog> will handle this itself
    if (state.openArtifactId) closeArtifact();
  });

  // ===========================================================================
  // Scroll — only auto-scroll when the user is already pinned to the bottom
  // ===========================================================================

  const scrollEl = messagesEl.parentElement?.parentElement; // .chat is the scroller
  const SCROLL_PIN_THRESHOLD = 80;

  function isUserPinnedToBottom() {
    if (!scrollEl) return true;
    const distFromBottom =
      scrollEl.scrollHeight - scrollEl.scrollTop - scrollEl.clientHeight;
    return distFromBottom < SCROLL_PIN_THRESHOLD;
  }

  function scrollToBottom({ force = false } = {}) {
    if (!scrollEl) return;
    if (!force && !state.isPinnedToBottom) return;
    scrollEl.scrollTop = scrollEl.scrollHeight;
  }

  scrollEl?.addEventListener('scroll', () => {
    state.isPinnedToBottom = isUserPinnedToBottom();
  });

  // ===========================================================================
  // Main render
  // ===========================================================================

  function render() {
    renderMessages();
    renderStarterChipsVisibility();
    renderAttachmentTray();
    updateSendDisabled();
    scrollToBottom();
  }

  function autosize() {
    inputEl.style.height = 'auto';
    inputEl.style.height = Math.min(inputEl.scrollHeight, 220) + 'px';
  }

  // ===========================================================================
  // Submit
  // ===========================================================================

  async function handleSubmit(event) {
    event.preventDefault();
    if (state.isSending) return;
    const text = inputEl.value.trim();
    const pa = state.pendingAttachment;
    const hasReadyAttachment = pa?.status === 'ready';
    if (!text && !hasReadyAttachment) return;

    const userMsg = { role: 'user', content: text };
    if (hasReadyAttachment) {
      userMsg.attachments = [
        {
          id: pa.id,
          mimeType: pa.mimeType,
          filename: pa.filename,
          previewUrl: pa.previewUrl,
        },
      ];
    }
    state.messages.push(userMsg);

    inputEl.value = '';
    state.pendingAttachment = null;
    fileInputEl.value = '';
    autosize();

    const assistantMsg = { role: 'assistant', segments: [], pending: true };
    state.messages.push(assistantMsg);
    state.isSending = true;
    // A fresh send pins the user back to the bottom.
    state.isPinnedToBottom = true;
    render();

    // Drop the in-flight assistant placeholder (always the last entry) and the
    // seed greeting — the system prompt tells the model the greeting was
    // already shown so it doesn't re-introduce itself.
    const apiMessages = state.messages
      .slice(0, -1)
      .filter((m) => !m.isSeed)
      .map((m) => {
        const out = { role: m.role, content: messageContent(m) };
        if (m.attachments?.length) {
          out.attachments = m.attachments.map((a) => ({ id: a.id }));
        }
        return out;
      });

    // Tool segments and text segments are interleaved in `segments` in the
    // order Anthropic emits them, so the renderer naturally shows the tool
    // card between the two text rounds that bracket the tool call.
    const findOrCreateToolSegment = (toolUseId, toolName) => {
      let seg = assistantMsg.segments.find(
        (s) => s.type === 'tool' && s.toolUseId === toolUseId,
      );
      if (seg) {
        if (toolName) seg.tool = toolName;
        return seg;
      }
      seg = {
        type: 'tool',
        toolUseId,
        tool: toolName || '',
        status: 'running',
        progress: [],
        replaceKeys: new Map(),
        error: null,
      };
      assistantMsg.segments.push(seg);
      return seg;
    };

    const pushProgress = (seg, message, replaceKey) => {
      if (!message) return;
      if (replaceKey) {
        const existingIdx = seg.replaceKeys.get(replaceKey);
        if (existingIdx === undefined) {
          seg.replaceKeys.set(replaceKey, seg.progress.length);
          seg.progress.push(message);
        } else {
          seg.progress[existingIdx] = message;
        }
        return;
      }
      seg.progress.push(message);
    };

    const appendTextDelta = (text) => {
      const last = assistantMsg.segments.at(-1);
      // Only fold deltas into the last text segment while that block is still
      // streaming. If the previous text was already closed (text_stop fired,
      // or the last segment is a tool), start a new text segment so the
      // boundaries line up with Anthropic's content blocks.
      if (last?.type === 'text' && !last.completed) {
        last.content += text;
        return;
      }
      assistantMsg.segments.push({ type: 'text', content: text });
    };

    const handleToolEvent = (evt) => {
      const seg = findOrCreateToolSegment(evt.toolUseId, evt.tool);
      if (evt.type === 'tool_start') {
        seg.status = 'running';
        seg.progress.push('started');
        return;
      }
      if (evt.type === 'tool_progress') {
        pushProgress(seg, evt.message, evt.replaceKey);
        return;
      }
      // tool_end
      seg.status = evt.ok ? 'done' : 'error';
      if (evt.error) seg.error = evt.error;
    };

    const handleArtifactEvent = (evt) => {
      state.artifacts.set(evt.artifactId, {
        id: evt.artifactId,
        kind: evt.kind,
        title: evt.title,
        content: evt.content,
      });
      if (!assistantMsg.artifactIds) assistantMsg.artifactIds = [];
      if (!assistantMsg.artifactIds.includes(evt.artifactId)) {
        assistantMsg.artifactIds.push(evt.artifactId);
      }
      state.openArtifactId = evt.artifactId;
      renderArtifactPanel();
    };

    const applyEvent = (evt) => {
      if (evt.type === 'delta') return appendTextDelta(evt.text);
      if (evt.type === 'text_stop') {
        const last = assistantMsg.segments.at(-1);
        if (last?.type === 'text') last.completed = true;
        return;
      }
      if (evt.type === 'tool_start' || evt.type === 'tool_progress' || evt.type === 'tool_end') {
        return handleToolEvent(evt);
      }
      if (evt.type === 'artifact') return handleArtifactEvent(evt);
      if (evt.type === 'error') {
        appendTextDelta(`\n\n_⚠️ ${evt.message || 'Stream error'}_`);
      }
    };

    try {
      await api.streamChat(apiMessages, {
        onEvent: (evt) => {
          applyEvent(evt);
          renderMessages();
          scrollToBottom();
        },
      });
    } catch (err) {
      appendTextDelta(`\n\n_⚠️ ${err.message || 'Request failed'}_`);
    } finally {
      assistantMsg.pending = false;
      state.isSending = false;
      render();
      inputEl.focus();
    }
  }

  // ===========================================================================
  // File upload
  // ===========================================================================

  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) {
      clearPendingAttachment();
      return;
    }

    if (state.pendingAttachment?.previewUrl) {
      URL.revokeObjectURL(state.pendingAttachment.previewUrl);
    }

    const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : null;
    const slot = {
      status: 'uploading',
      filename: file.name,
      mimeType: file.type,
      size: file.size,
      previewUrl,
      id: null,
      errorMessage: null,
    };
    state.pendingAttachment = slot;
    renderAttachmentTray();
    updateSendDisabled();

    try {
      const meta = await api.upload(file);
      if (state.pendingAttachment !== slot) return;
      slot.status = 'ready';
      slot.id = meta.id;
      slot.mimeType = meta.mimeType;
      slot.size = meta.size;
    } catch (err) {
      if (state.pendingAttachment !== slot) return;
      slot.status = 'error';
      slot.errorMessage = err.message || 'Upload failed';
    } finally {
      if (state.pendingAttachment === slot) {
        renderAttachmentTray();
        updateSendDisabled();
      }
    }
  }

  function handleKeydown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      formEl.requestSubmit();
    }
  }

  function handleNewChat() {
    state.messages = [makeSeedMessage()];
    state.pendingAttachment = null;
    state.isSending = false;
    state.isPinnedToBottom = true;
    // Replay the seed + chip fade-ups so New Chat feels just like first load.
    state.seedAnimated = false;
    state.chipsAnimated = false;
    inputEl.value = '';
    fileInputEl.value = '';
    autosize();
    render();
    inputEl.focus();
  }

  formEl.addEventListener('submit', handleSubmit);
  fileInputEl.addEventListener('change', handleFileChange);
  inputEl.addEventListener('keydown', handleKeydown);
  inputEl.addEventListener('input', () => {
    autosize();
    updateSendDisabled();
  });
  newChatBtn.addEventListener('click', handleNewChat);

  buildStarterChips();

  api
    .health()
    .then(() => console.info('[upgrade-consultant] api healthy'))
    .catch((err) => console.warn('[upgrade-consultant] api health check failed:', err.message));

  render();
  inputEl.focus();
}
