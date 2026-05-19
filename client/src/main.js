import { initChatApp } from './app.js';

initChatApp({
  rootEl: document.getElementById('app'),
  messagesEl: document.getElementById('messages'),
  formEl: document.getElementById('composer-form'),
  inputEl: document.getElementById('composer-input'),
  fileInputEl: document.getElementById('file-input'),
  newChatBtn: document.getElementById('new-chat'),
});
