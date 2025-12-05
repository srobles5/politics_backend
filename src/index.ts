import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { logger } from './middlewares/logger';
import { errorHandler } from './middlewares/errorHandler';
import leaderRoutes from './modules/leaders/leaderRoutes';
import voterRoutes from './modules/voters/voterRoutes';
import twoFactorRoutes from './modules/twofactor/twoFactorRoutes';
import seedRoutes from './modules/seed/seedRoutes';
import geocodingRoutes from './modules/geocoding/geocodingRoutes';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
    : '*',
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middlewares globales
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/leaders', leaderRoutes);
app.use('/api/voters', voterRoutes);
app.use('/api/twofactor', twoFactorRoutes);
app.use('/api/seed', seedRoutes);
app.use('/api/geocoding', geocodingRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Error handler (debe ir al final)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

