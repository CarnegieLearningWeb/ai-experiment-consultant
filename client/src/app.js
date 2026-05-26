import { api } from './api.js';
import { marked } from 'marked';

marked.setOptions({ gfm: true, breaks: true });

function renderMarkdown(text) {
  if (!text) return '';
  // marked.parse may return a Promise if async options are enabled. We use
  // sync options, so this is always a string — narrow the type for the linter.
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

function renderMessageToolRuns(msg, li) {
  if (!msg.toolRuns?.length) return;
  const wrap = document.createElement('div');
  wrap.className = 'tool-runs';
  for (const run of msg.toolRuns) {
    const card = document.createElement('div');
    card.className = `tool-run tool-run--${run.status}`;

    const header = document.createElement('div');
    header.className = 'tool-run__header';
    const TOOL_RUN_ICONS = { error: '⚠', done: '✓' };
    const iconChar = TOOL_RUN_ICONS[run.status] || '🔧';
    header.innerHTML = `<span class="tool-run__icon">${iconChar}</span> <span class="tool-run__title">${run.tool}</span>`;
    card.appendChild(header);

    if (run.progress.length) {
      const list = document.createElement('ul');
      list.className = 'tool-run__progress';
      for (const p of run.progress) {
        const item = document.createElement('li');
        item.textContent = p;
        list.appendChild(item);
      }
      card.appendChild(list);
    }

    if (run.error) {
      const err = document.createElement('div');
      err.className = 'tool-run__error';
      err.textContent = run.error;
      card.appendChild(err);
    }

    wrap.appendChild(card);
  }
  li.appendChild(wrap);
}

export function initChatApp({
  messagesEl,
  emptyStateEl,
  starterPromptsEl,
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
}) {
  const state = {
    messages: [],
    pendingAttachment: null,
    isSending: false,
    artifacts: new Map(), // artifactId -> { id, title, content, kind }
    openArtifactId: null,
  };

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

  function renderMessages() {
    messagesEl.innerHTML = '';
    for (const msg of state.messages) {
      const li = document.createElement('li');
      li.className = `msg msg--${msg.role}`;
      if (msg.pending) li.classList.add('msg--pending');

      renderMessageAttachments(msg, li);
      renderMessageToolRuns(msg, li);

      const hasContent = msg.content && msg.content.length > 0;
      const hasToolRun = (msg.toolRuns || []).length > 0;
      const hasArtifacts = (msg.artifactIds || []).length > 0;
      const showBubble = hasContent || (!hasToolRun && !hasArtifacts);
      if (showBubble) {
        const bubble = document.createElement('div');
        bubble.className = 'msg__bubble';
        if (msg.role === 'assistant' && msg.pending && !hasContent) {
          bubble.innerHTML =
            '<span class="thinking-dot"></span>' +
            '<span class="thinking-dot"></span>' +
            '<span class="thinking-dot"></span>';
        } else if (msg.role === 'assistant' && hasContent) {
          // Render markdown for assistant turns. User turns stay as plain text
          // (we never want a user-pasted "<script>" to execute, and they're
          // typing prose, not markdown).
          bubble.classList.add('msg__bubble--md');
          bubble.innerHTML = renderMarkdown(msg.content);
        } else {
          bubble.textContent = msg.content;
        }
        li.appendChild(bubble);
      }

      renderMessageArtifacts(msg, li);

      messagesEl.appendChild(li);
    }
  }

  function renderEmptyState() {
    const isEmpty = state.messages.length === 0;
    emptyStateEl.hidden = !isEmpty;
    messagesEl.hidden = isEmpty;
  }

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
    const fname = (a.title || 'report').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'report';
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
      artifactCopyBtn.textContent = 'Copied!';
      setTimeout(() => { artifactCopyBtn.textContent = 'Copy'; }, 1500);
    } catch (err) {
      console.warn('clipboard copy failed:', err);
    }
  }

  artifactCloseBtn?.addEventListener('click', closeArtifact);
  artifactCopyBtn?.addEventListener('click', copyCurrentArtifact);
  artifactDownloadBtn?.addEventListener('click', downloadCurrentArtifact);

  // The `.chat` <main> is the scrollable container, not the <ol>; scroll it.
  const scrollEl = messagesEl.parentElement;

  function scrollToBottom() {
    if (scrollEl) scrollEl.scrollTop = scrollEl.scrollHeight;
  }

  function render() {
    renderMessages();
    renderEmptyState();
    renderAttachmentTray();
    updateSendDisabled();
    if (state.messages.length) scrollToBottom();
  }

  function autosize() {
    inputEl.style.height = 'auto';
    inputEl.style.height = Math.min(inputEl.scrollHeight, 200) + 'px';
  }

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
          previewUrl: pa.previewUrl, // ownership transfers to the message; do not revoke
        },
      ];
    }
    state.messages.push(userMsg);

    inputEl.value = '';
    // Detach pendingAttachment without revoking the blob URL — the message
    // owns it now and will display the thumbnail.
    state.pendingAttachment = null;
    fileInputEl.value = '';
    autosize();

    const assistantMsg = { role: 'assistant', content: '', pending: true };
    state.messages.push(assistantMsg);
    state.isSending = true;
    render();

    const apiMessages = state.messages
      .filter((m) => m !== assistantMsg)
      .map((m) => {
        const out = { role: m.role, content: m.content };
        if (m.attachments?.length) {
          out.attachments = m.attachments.map((a) => ({ id: a.id }));
        }
        return out;
      });

    if (!assistantMsg.toolRuns) assistantMsg.toolRuns = [];

    const upsertRun = (toolUseId) => {
      let run = assistantMsg.toolRuns.find((r) => r.toolUseId === toolUseId);
      if (run) return run;
      run = {
        toolUseId,
        tool: '',
        status: 'running',
        progress: [],
        replaceKeys: new Map(),
        error: null,
      };
      assistantMsg.toolRuns.push(run);
      return run;
    };

    const pushProgress = (run, message, replaceKey) => {
      if (!message) return;
      if (replaceKey) {
        const existingIdx = run.replaceKeys.get(replaceKey);
        if (existingIdx !== undefined) {
          run.progress[existingIdx] = message;
        } else {
          run.replaceKeys.set(replaceKey, run.progress.length);
          run.progress.push(message);
        }
        return;
      }
      run.progress.push(message);
    };

    const applyEvent = (evt) => {
      if (evt.type === 'delta') {
        assistantMsg.content += evt.text;
        return;
      }
      if (evt.type === 'tool_start') {
        const run = upsertRun(evt.toolUseId);
        run.tool = evt.tool;
        run.status = 'running';
        run.progress.push('started');
        return;
      }
      if (evt.type === 'tool_progress') {
        const run = upsertRun(evt.toolUseId);
        run.tool = evt.tool;
        pushProgress(run, evt.message, evt.replaceKey);
        return;
      }
      if (evt.type === 'tool_end') {
        const run = upsertRun(evt.toolUseId);
        run.tool = evt.tool;
        run.status = evt.ok ? 'done' : 'error';
        if (evt.error) run.error = evt.error;
        return;
      }
      if (evt.type === 'artifact') {
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
        // Auto-open the new artifact.
        state.openArtifactId = evt.artifactId;
        renderArtifactPanel();
        return;
      }
      if (evt.type === 'error') {
        assistantMsg.content =
          (assistantMsg.content || '') + `\n\n_⚠️ ${evt.message || 'Stream error'}_`;
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
      assistantMsg.content =
        (assistantMsg.content || '') +
        `\n\n_⚠️ ${err.message || 'Request failed'}_`;
    } finally {
      assistantMsg.pending = false;
      state.isSending = false;
      render();
      inputEl.focus();
    }
  }

  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) {
      clearPendingAttachment();
      return;
    }

    // Detach any prior pending attachment first.
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
      // Race guard: user may have cancelled or picked a different file.
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
    state.messages = [];
    state.pendingAttachment = null;
    state.isSending = false;
    inputEl.value = '';
    fileInputEl.value = '';
    autosize();
    render();
    inputEl.focus();
  }

  function handleStarterPromptClick(event) {
    const target = event.target.closest('[data-prompt]');
    if (!target) return;
    inputEl.value = target.dataset.prompt;
    autosize();
    updateSendDisabled();
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
  starterPromptsEl.addEventListener('click', handleStarterPromptClick);

  // Verify the API is reachable. Not blocking; informational only.
  api
    .health()
    .then(() => console.info('[upgrade-consultant] api healthy'))
    .catch((err) => console.warn('[upgrade-consultant] api health check failed:', err.message));

  render();
  inputEl.focus();
}
