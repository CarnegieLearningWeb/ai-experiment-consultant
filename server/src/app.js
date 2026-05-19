import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { mountRoutes } from './routes/index.js';

export function createApp() {
  const app = express();

  if (config.isDev) {
    app.use(cors({ origin: config.clientOrigin, credentials: false }));
  }

  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: false }));

  // Lightweight request log; enough for prototyping without bringing in morgan.
  app.use((req, _res, next) => {
    if (config.isDev) console.log(`${req.method} ${req.url}`);
    next();
  });

  mountRoutes(app);

  // 404 for anything outside the api namespace.
  app.use((req, res) => {
    res.status(404).json({
      error: { code: 'not_found', message: `No route for ${req.method} ${req.url}` },
    });
  });

  // Error envelope.
  app.use((err, _req, res, _next) => {
    console.error('[upgrade-consultant] unhandled error:', err);
    const status = err.status || 500;
    res.status(status).json({
      error: {
        code: err.code || 'internal_error',
        message: err.expose ? err.message : 'Internal server error',
      },
    });
  });

  return app;
}
