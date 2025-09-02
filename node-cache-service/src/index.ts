import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { logger } from './config/logger';
import { connectRedis } from './config/redis';
import { connectMySQL } from './config/database';
import cacheRoutes from './routes/cache.routes';
import { errorHandler } from './middleware/error.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'node-cache-service' });
});

app.use('/cache', cacheRoutes);

app.use(errorHandler);

async function startServer() {
  try {
    await connectRedis();
    await connectMySQL();
    
    app.listen(PORT, () => {
      logger.info(`Cache service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();