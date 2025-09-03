"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostService = void 0;
const database_1 = require("../config/database");
const logger_1 = require("../config/logger");
class PostService {
    async getAllPosts() {
        try {
            const rows = await (0, database_1.query)(`
        SELECT 
          p.id, p.title, p.content, p.user_id, p.created_at, p.updated_at,
          u.id as user_id, u.name as user_name, u.email as user_email
        FROM posts p
        JOIN users u ON p.user_id = u.id
        ORDER BY p.created_at DESC
      `);
            return rows.map(row => ({
                id: row.id,
                title: row.title,
                content: row.content,
                user_id: row.user_id,
                created_at: row.created_at,
                updated_at: row.updated_at,
                user: {
                    id: row.user_id,
                    name: row.user_name,
                    email: row.user_email
                }
            }));
        }
        catch (error) {
            logger_1.logger.error('Error fetching posts from database:', error);
            throw error;
        }
    }
    async getPostById(id) {
        try {
            // Use $1 for PostgreSQL, ? for MySQL
            const paramPlaceholder = process.env.DB_CONNECTION === 'pgsql' ? '$1' : '?';
            const rows = await (0, database_1.query)(`
        SELECT 
          p.id, p.title, p.content, p.user_id, p.created_at, p.updated_at,
          u.id as user_id, u.name as user_name, u.email as user_email
        FROM posts p
        JOIN users u ON p.user_id = u.id
        WHERE p.id = ${paramPlaceholder}
      `, [id]);
            const posts = rows;
            if (posts.length === 0) {
                return null;
            }
            const row = posts[0];
            return {
                id: row.id,
                title: row.title,
                content: row.content,
                user_id: row.user_id,
                created_at: row.created_at,
                updated_at: row.updated_at,
                user: {
                    id: row.user_id,
                    name: row.user_name,
                    email: row.user_email
                }
            };
        }
        catch (error) {
            logger_1.logger.error(`Error fetching post ${id} from database:`, error);
            throw error;
        }
    }
}
exports.PostService = PostService;
//# sourceMappingURL=post.service.js.map