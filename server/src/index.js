import './env.js';
import { createApp } from './app.js';
import { initUploadsDir } from './lib/uploads.js';

initUploadsDir();

const app = createApp();

const PORT = 3001;
const server = app.listen(PORT, () => {
  console.log(`[ai-experiment-consultant] server listening on http://localhost:${PORT}`);
});

function shutdown(signal) {
  console.log(`[ai-experiment-consultant] ${signal} received, shutting down`);
  server.close(() => process.exit(0));
  // Force-exit if close hangs.
  setTimeout(() => process.exit(1), 5000).unref();
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
