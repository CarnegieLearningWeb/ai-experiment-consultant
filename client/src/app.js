import { api } from './api.js';

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
}) {
  const state = {
    messages: [],
    pendingAttachment: null,
    isSending: false,
  };

  function renderMessages() {
    messagesEl.innerHTML = '';
    for (const msg of state.messages) {
      const li = document.createElement('li');
      li.className = `msg msg--${msg.role}`;
      if (msg.pending) li.classList.add('msg--pending');

      renderMessageAttachments(msg, li);

      const bubble = document.createElement('div');
      bubble.className = 'msg__bubble';
      if (msg.role === 'assistant' && msg.pending && !msg.content) {
        bubble.innerHTML =
          '<span class="thinking-dot"></span>' +
          '<span class="thinking-dot"></span>' +
          '<span class="thinking-dot"></span>';
      } else {
        bubble.textContent = msg.content;
      }
      li.appendChild(bubble);

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

    try {
      await api.streamChat(apiMessages, {
        onEvent: (evt) => {
          if (evt.type === 'delta') {
            assistantMsg.content += evt.text;
            renderMessages();
            scrollToBottom();
          } else if (evt.type === 'error') {
            assistantMsg.content =
              (assistantMsg.content || '') +
              `\n\n_⚠️ ${evt.message || 'Stream error'}_`;
          }
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
