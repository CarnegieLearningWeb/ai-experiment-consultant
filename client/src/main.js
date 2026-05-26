import { initChatApp } from './app.js';

initChatApp({
  messagesEl: document.getElementById('messages'),
  emptyStateEl: document.getElementById('empty-state'),
  starterPromptsEl: document.getElementById('starter-prompts'),
  formEl: document.getElementById('composer-form'),
  inputEl: document.getElementById('composer-input'),
  fileInputEl: document.getElementById('file-input'),
  sendBtn: document.getElementById('send-btn'),
  attachmentTrayEl: document.getElementById('attachment-tray'),
  newChatBtn: document.getElementById('new-chat'),
  artifactPanelEl: document.getElementById('artifact-panel'),
  artifactTitleEl: document.getElementById('artifact-panel-title'),
  artifactBodyEl: document.getElementById('artifact-panel-body'),
  artifactCopyBtn: document.getElementById('artifact-copy'),
  artifactDownloadBtn: document.getElementById('artifact-download'),
  artifactCloseBtn: document.getElementById('artifact-close'),
});
