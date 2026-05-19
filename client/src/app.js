import { api } from './api.js';

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

      const bubble = document.createElement('div');
      bubble.className = 'msg__bubble';
      bubble.textContent = msg.content;
      li.appendChild(bubble);

      if (msg.attachment) {
        const meta = document.createElement('div');
        meta.className = 'msg__attachment';
        meta.textContent = `📎 ${msg.attachment.name}`;
        li.appendChild(meta);
      }

      messagesEl.appendChild(li);
    }
  }

  function renderEmptyState() {
    const isEmpty = state.messages.length === 0;
    emptyStateEl.hidden = !isEmpty;
    messagesEl.hidden = isEmpty;
  }

  function renderAttachmentTray() {
    attachmentTrayEl.innerHTML = '';
    if (!state.pendingAttachment) {
      attachmentTrayEl.hidden = true;
      return;
    }
    attachmentTrayEl.hidden = false;

    const chip = document.createElement('div');
    chip.className = 'attachment-chip';

    const label = document.createElement('span');
    label.className = 'attachment-chip__name';
    label.textContent = state.pendingAttachment.name;
    chip.appendChild(label);

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'attachment-chip__remove';
    removeBtn.setAttribute('aria-label', `Remove attachment ${state.pendingAttachment.name}`);
    removeBtn.textContent = '×';
    removeBtn.addEventListener('click', () => {
      state.pendingAttachment = null;
      fileInputEl.value = '';
      renderAttachmentTray();
      updateSendDisabled();
      inputEl.focus();
    });
    chip.appendChild(removeBtn);

    attachmentTrayEl.appendChild(chip);
  }

  function updateSendDisabled() {
    const hasText = inputEl.value.trim().length > 0;
    const hasAttachment = state.pendingAttachment !== null;
    sendBtn.disabled = state.isSending || (!hasText && !hasAttachment);
  }

  function render() {
    renderMessages();
    renderEmptyState();
    renderAttachmentTray();
    updateSendDisabled();
    // Scroll to bottom only when there are messages (avoids jumping the empty state).
    if (state.messages.length) {
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }
  }

  function autosize() {
    inputEl.style.height = 'auto';
    inputEl.style.height = Math.min(inputEl.scrollHeight, 200) + 'px';
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (state.isSending) return;
    const text = inputEl.value.trim();
    if (!text && !state.pendingAttachment) return;

    const userMsg = { role: 'user', content: text || '(attachment only)' };
    if (state.pendingAttachment) {
      userMsg.attachment = {
        name: state.pendingAttachment.name,
        size: state.pendingAttachment.size,
        type: state.pendingAttachment.type,
      };
    }
    state.messages.push(userMsg);

    inputEl.value = '';
    state.pendingAttachment = null;
    fileInputEl.value = '';
    autosize();
    render();

    // TODO(chat) M2: replace this echo with a real api.chat(messages) call.
    state.isSending = true;
    updateSendDisabled();
    await Promise.resolve(); // yield so the user message paints before the echo
    state.messages.push({
      role: 'assistant',
      content:
        `echo: ${text || '(no text)'}` +
        (userMsg.attachment ? ` [+attachment: ${userMsg.attachment.name}]` : ''),
    });
    state.isSending = false;
    render();
    inputEl.focus();
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (file) {
      // TODO(uploads) M3: immediately POST to /uploads and store the returned id.
      state.pendingAttachment = {
        name: file.name,
        size: file.size,
        type: file.type,
        file,
      };
    } else {
      state.pendingAttachment = null;
    }
    renderAttachmentTray();
    updateSendDisabled();
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
