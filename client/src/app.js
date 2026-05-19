import { api } from './api.js';

const WELCOME = {
  role: 'assistant',
  content:
    "Hi — I'm a prototype AI consultant for planning A/B experiments with UpGrade. " +
    "The real chat backend isn't wired up yet (milestone M2). For now, anything you " +
    "send gets echoed back so you can sanity-check the UI.",
};

export function initChatApp({ messagesEl, formEl, inputEl, fileInputEl, newChatBtn }) {
  const state = {
    messages: [WELCOME],
    pendingAttachment: null,
  };

  function render() {
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
        meta.textContent = `attachment: ${msg.attachment.name}`;
        li.appendChild(meta);
      }
      messagesEl.appendChild(li);
    }
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function autosize() {
    inputEl.style.height = 'auto';
    inputEl.style.height = Math.min(inputEl.scrollHeight, 200) + 'px';
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const text = inputEl.value.trim();
    if (!text && !state.pendingAttachment) return;

    const userMsg = { role: 'user', content: text || '(attachment only)' };
    if (state.pendingAttachment) userMsg.attachment = state.pendingAttachment;
    state.messages.push(userMsg);

    inputEl.value = '';
    state.pendingAttachment = null;
    fileInputEl.value = '';
    autosize();
    render();

    // TODO(chat): replace this echo with a real api.chat(...) call in M2.
    state.messages.push({
      role: 'assistant',
      content:
        `echo: ${text || '(no text)'}` +
        (userMsg.attachment ? ` [+attachment: ${userMsg.attachment.name}]` : ''),
    });
    render();
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) {
      state.pendingAttachment = null;
      return;
    }
    state.pendingAttachment = { name: file.name, size: file.size, type: file.type };
    render();
    // TODO(uploads): in M3, immediately POST to /uploads and store the returned id.
  }

  function handleKeydown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      formEl.requestSubmit();
    }
  }

  function handleNewChat() {
    state.messages = [WELCOME];
    state.pendingAttachment = null;
    inputEl.value = '';
    fileInputEl.value = '';
    autosize();
    render();
    inputEl.focus();
  }

  formEl.addEventListener('submit', handleSubmit);
  fileInputEl.addEventListener('change', handleFileChange);
  inputEl.addEventListener('keydown', handleKeydown);
  inputEl.addEventListener('input', autosize);
  newChatBtn.addEventListener('click', handleNewChat);

  // Verify the API is reachable. Not blocking; informational only.
  api
    .health()
    .then(() => console.info('[upgrade-consultant] api healthy'))
    .catch((err) => console.warn('[upgrade-consultant] api health check failed:', err.message));

  render();
  inputEl.focus();
}
