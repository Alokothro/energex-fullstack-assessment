"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = require("./config/logger");
const redis_1 = require("./config/redis");
const database_1 = require("./config/database");
const cache_routes_1 = __importDefault(require("./routes/cache.routes"));
const error_middleware_1 = require("./middleware/error.middleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/health', (_req, res) => {
    res.json({ status: 'healthy', service: 'node-cache-service' });
});
app.use('/cache', cache_routes_1.default);
app.use(error_middleware_1.errorHandler);
async function startServer() {
    try {
        await (0, redis_1.connectRedis)();
        await (0, database_1.connectMySQL)();
        app.listen(PORT, () => {
            logger_1.logger.info(`Cache service running on port ${PORT}`);
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to start server:', error);
        process.exit(1);
    }
}
startServer();
//# sourceMappingURL=index.js.map