"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheService = void 0;
const redis_1 = require("../config/redis");
const logger_1 = require("../config/logger");
class CacheService {
    defaultTTL;
    constructor() {
        this.defaultTTL = parseInt(process.env.CACHE_TTL || '600');
    }
    async get(key) {
        try {
            const data = await redis_1.redisClient.get(key);
            if (data) {
                logger_1.logger.debug(`Cache hit for key: ${key}`);
                return JSON.parse(data);
            }
            logger_1.logger.debug(`Cache miss for key: ${key}`);
            return null;
        }
        catch (error) {
            logger_1.logger.error(`Error getting cache for key ${key}:`, error);
            return null;
        }
    }
    async set(key, value, ttl) {
        try {
            const serialized = JSON.stringify(value);
            await redis_1.redisClient.setEx(key, ttl || this.defaultTTL, serialized);
            logger_1.logger.debug(`Cache set for key: ${key}`);
            return true;
        }
        catch (error) {
            logger_1.logger.error(`Error setting cache for key ${key}:`, error);
            return false;
        }
    }
    async delete(key) {
        try {
            await redis_1.redisClient.del(key);
            logger_1.logger.debug(`Cache deleted for key: ${key}`);
            return true;
        }
        catch (error) {
            logger_1.logger.error(`Error deleting cache for key ${key}:`, error);
            return false;
        }
    }
    async flush() {
        try {
            await redis_1.redisClient.flushAll();
            logger_1.logger.info('Cache flushed');
            return true;
        }
        catch (error) {
            logger_1.logger.error('Error flushing cache:', error);
            return false;
        }
    }
}
exports.CacheService = CacheService;
//# sourceMappingURL=cache.service.js.map