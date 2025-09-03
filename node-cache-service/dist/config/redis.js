"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
exports.connectRedis = connectRedis;
const redis_1 = require("redis");
const logger_1 = require("./logger");
exports.redisClient = (0, redis_1.createClient)({
    socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379')
    },
    password: process.env.REDIS_PASSWORD || undefined
});
exports.redisClient.on('error', (err) => {
    logger_1.logger.error('Redis Client Error', err);
});
exports.redisClient.on('connect', () => {
    logger_1.logger.info('Connected to Redis');
});
async function connectRedis() {
    await exports.redisClient.connect();
}
//# sourceMappingURL=redis.js.map