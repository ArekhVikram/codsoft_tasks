import app from './app.js';
import { config } from './config/config.js';
import { connectDB } from './config/db.js';
import { memoryStore } from './data/memoryStore.js';

async function startServer() {
  // Try connecting to MongoDB or fall back to Demo Mode
  await connectDB();
  await memoryStore.init();

  const PORT = config.port;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`=================================================`);
    console.log(` NOVA SUPPLY API Server running on port ${PORT}`);
    console.log(` URL: http://0.0.0.0:${PORT}`);
    console.log(` Health: http://0.0.0.0:${PORT}/api/health`);
    console.log(` Mode: ${config.nodeEnv}`);
    console.log(`=================================================`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
