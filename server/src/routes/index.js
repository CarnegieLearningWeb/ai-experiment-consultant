import { Router } from 'express';
import { healthRouter } from './health.js';
import { chatRouter } from './chat.js';
import { uploadsRouter } from './uploads.js';
import { simulationRouter } from './simulation.js';
import { reportRouter } from './report.js';

const API_BASE = '/api/v1/ai-consultant';

export function mountRoutes(app) {
  const api = Router();

  api.use('/health', healthRouter);
  api.use('/chat', chatRouter);
  api.use('/uploads', uploadsRouter);
  api.use('/simulation', simulationRouter);
  api.use('/report', reportRouter);

  app.use(API_BASE, api);
}
