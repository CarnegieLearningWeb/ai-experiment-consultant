import { Router } from 'express';
import { healthRouter } from './health.js';
import { chatRouter } from './chat.js';
import { uploadsRouter } from './uploads.js';

const API_BASE = '/api/v1/ai-consultant';

export function mountRoutes(app) {
  const api = Router();

  api.use('/health', healthRouter);
  api.use('/chat', chatRouter);
  api.use('/uploads', uploadsRouter);

  app.use(API_BASE, api);
}
