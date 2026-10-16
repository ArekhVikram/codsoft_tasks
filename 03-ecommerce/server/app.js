import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { isDatabaseConnected } from './config/db.js';
import { memoryStore } from './data/memoryStore.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(
  cors({
    origin: true, // Allow dev server proxy or same-origin
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const connected = isDatabaseConnected();
  let count = 0;
  if (!connected) {
    await memoryStore.init();
    count = memoryStore.products.length;
  }
  res.status(200).json({
    status: 'ok',
    brand: 'NOVA SUPPLY',
    tagline: 'Objects for everyday living.',
    database: connected ? 'MongoDB Connected' : 'Demo Mode (Local In-Memory / File Storage)',
    isDemoMode: !connected,
    productsCount: count,
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);

// Serve client build if available (for production deployment)
const clientBuildPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientBuildPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(clientBuildPath, 'index.html');
  res.sendFile(indexPath, err => {
    if (err) {
      next();
    }
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
