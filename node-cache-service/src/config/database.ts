import mysql from 'mysql2/promise';
import { logger } from './logger';

let pool: mysql.Pool;

export async function connectMySQL() {
  try {
    pool = mysql.createPool({
      host: process.env.MYSQL_HOST || 'localhost',
      port: parseInt(process.env.MYSQL_PORT || '3306'),
      database: process.env.MYSQL_DATABASE || 'microservice_db',
      user: process.env.MYSQL_USER || 'app_user',
      password: process.env.MYSQL_PASSWORD || 'app_password',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    await pool.getConnection();
    logger.info('Connected to MySQL');
  } catch (error) {
    logger.error('MySQL connection error:', error);
    throw error;
  }
}

export function getPool() {
  if (!pool) {
    throw new Error('Database not initialized');
  }
  return pool;
}