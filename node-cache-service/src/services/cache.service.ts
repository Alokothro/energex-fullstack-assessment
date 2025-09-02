import { redisClient } from '../config/redis';
import { logger } from '../config/logger';

export class CacheService {
  private defaultTTL: number;

  constructor() {
    this.defaultTTL = parseInt(process.env.CACHE_TTL || '600');
  }

  async get(key: string): Promise<any> {
    try {
      const data = await redisClient.get(key);
      if (data) {
        logger.debug(`Cache hit for key: ${key}`);
        return JSON.parse(data);
      }
      logger.debug(`Cache miss for key: ${key}`);
      return null;
    } catch (error) {
      logger.error(`Error getting cache for key ${key}:`, error);
      return null;
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<boolean> {
    try {
      const serialized = JSON.stringify(value);
      await redisClient.setEx(key, ttl || this.defaultTTL, serialized);
      logger.debug(`Cache set for key: ${key}`);
      return true;
    } catch (error) {
      logger.error(`Error setting cache for key ${key}:`, error);
      return false;
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      await redisClient.del(key);
      logger.debug(`Cache deleted for key: ${key}`);
      return true;
    } catch (error) {
      logger.error(`Error deleting cache for key ${key}:`, error);
      return false;
    }
  }

  async flush(): Promise<boolean> {
    try {
      await redisClient.flushAll();
      logger.info('Cache flushed');
      return true;
    } catch (error) {
      logger.error('Error flushing cache:', error);
      return false;
    }
  }
}