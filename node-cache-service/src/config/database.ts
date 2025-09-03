import mysql from 'mysql2/promise';
import pg from 'pg';
import { logger } from './logger';

let mysqlPool: mysql.Pool | null = null;
let pgPool: pg.Pool | null = null;

function parsePostgresUrl(url: string) {
  const parsedUrl = new URL(url);
  return {
    host: parsedUrl.hostname,
    port: parseInt(parsedUrl.port || '5432'),
    database: parsedUrl.pathname.slice(1),
    user: parsedUrl.username,
    password: parsedUrl.password,
  };
}

export async function connectMySQL() {
  const dbConnection = process.env.DB_CONNECTION || 'mysql';
  
  try {
    if (process.env.DATABASE_URL && dbConnection === 'pgsql') {
      // PostgreSQL connection for Render
      const config = parsePostgresUrl(process.env.DATABASE_URL);
      pgPool = new pg.Pool({
        ...config,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });
      
      await pgPool.connect();
      logger.info('Connected to PostgreSQL');
    } else {
      // MySQL connection for local development
      mysqlPool = mysql.createPool({
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
      logger.info('Connected to MySQL');
    }
  } catch (error) {
    logger.error('Database connection error:', error);
    throw error;
  }
}

export function getPool() {
  if (pgPool) {
    return pgPool;
  }
  if (mysqlPool) {
    return mysqlPool;
  }
  throw new Error('Database not initialized');
}

export async function query(sql: string, params?: any[]) {
  if (pgPool) {
    // PostgreSQL query
    const result = await pgPool.query(sql, params);
    return result.rows;
  } else if (mysqlPool) {
    // MySQL query
    const [rows] = await mysqlPool.execute(sql, params);
    return rows;
  } else {
    throw new Error('Database not initialized');
  }
}