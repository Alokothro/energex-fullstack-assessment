import mysql from 'mysql2/promise';
import pg from 'pg';
export declare function connectMySQL(): Promise<void>;
export declare function getPool(): mysql.Pool | pg.Pool;
export declare function query(sql: string, params?: any[]): Promise<any[] | mysql.OkPacket | mysql.ResultSetHeader>;
//# sourceMappingURL=database.d.ts.map