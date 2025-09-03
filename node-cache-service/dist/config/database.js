"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectMySQL = connectMySQL;
exports.getPool = getPool;
exports.query = query;
const promise_1 = __importDefault(require("mysql2/promise"));
const pg_1 = __importDefault(require("pg"));
const logger_1 = require("./logger");
let mysqlPool = null;
let pgPool = null;
function parsePostgresUrl(url) {
    const parsedUrl = new URL(url);
    return {
        host: parsedUrl.hostname,
        port: parseInt(parsedUrl.port || '5432'),
        database: parsedUrl.pathname.slice(1),
        user: parsedUrl.username,
        password: parsedUrl.password,
    };
}
async function connectMySQL() {
    const dbConnection = process.env.DB_CONNECTION || 'mysql';
    try {
        if (process.env.DATABASE_URL && dbConnection === 'pgsql') {
            // PostgreSQL connection for Render
            const config = parsePostgresUrl(process.env.DATABASE_URL);
            pgPool = new pg_1.default.Pool({
                ...config,
                max: 10,
                idleTimeoutMillis: 30000,
                connectionTimeoutMillis: 2000,
            });
            await pgPool.connect();
            logger_1.logger.info('Connected to PostgreSQL');
        }
        else {
            // MySQL connection for local development
            mysqlPool = promise_1.default.createPool({
                host: process.env.MYSQL_HOST || 'localhost',
                port: parseInt(process.env.MYSQL_PORT || '3306'),
                database: process.env.MYSQL_DATABASE || 'microservice_db',
                user: process.env.MYSQL_USER || 'app_user',
                password: process.env.MYSQL_PASSWORD || 'app_password',
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0
            });
            await mysqlPool.getConnection();
            logger_1.logger.info('Connected to MySQL');
        }
    }
    catch (error) {
        logger_1.logger.error('Database connection error:', error);
        throw error;
    }
}
function getPool() {
    if (pgPool) {
        return pgPool;
    }
    if (mysqlPool) {
        return mysqlPool;
    }
    throw new Error('Database not initialized');
}
async function query(sql, params) {
    if (pgPool) {
        // PostgreSQL query
        const result = await pgPool.query(sql, params);
        return result.rows;
    }
    else if (mysqlPool) {
        // MySQL query
        const [rows] = await mysqlPool.execute(sql, params);
        return rows;
    }
    else {
        throw new Error('Database not initialized');
    }
}
//# sourceMappingURL=database.js.map