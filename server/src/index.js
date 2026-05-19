import { createApp } from './app.js';
import { config } from './config.js';
import { initUploadsDir } from './lib/uploads.js';

initUploadsDir();

const app = createApp();

const server = app.listen(config.port, () => {
  console.log(
    `[upgrade-consultant] server listening on http://localhost:${config.port} ` +
      `(env=${config.nodeEnv})`,
  );
});

function shutdown(signal) {
  console.log(`[upgrade-consultant] ${signal} received, shutting down`);
  server.close(() => process.exit(0));
  // Force-exit if close hangs.
  setTimeout(() => process.exit(1), 5000).unref();
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
