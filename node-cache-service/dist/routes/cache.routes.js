"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cache_service_1 = require("../services/cache.service");
const post_service_1 = require("../services/post.service");
const logger_1 = require("../config/logger");
const router = (0, express_1.Router)();
const cacheService = new cache_service_1.CacheService();
const postService = new post_service_1.PostService();
router.get('/posts', async (_req, res, next) => {
    try {
        const cacheKey = 'posts:all';
        // Try to get from cache
        let posts = await cacheService.get(cacheKey);
        if (!posts) {
            // If not in cache, get from database
            posts = await postService.getAllPosts();
            // Store in cache
            await cacheService.set(cacheKey, posts);
        }
        res.json(posts);
    }
    catch (error) {
        logger_1.logger.error('Error in /cache/posts:', error);
        next(error);
    }
});
router.get('/posts/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const cacheKey = `posts:${id}`;
        // Try to get from cache
        let post = await cacheService.get(cacheKey);
        if (!post) {
            // If not in cache, get from database
            post = await postService.getPostById(parseInt(id));
            if (!post) {
                res.status(404).json({ error: 'Post not found' });
                return;
            }
            // Store in cache
            await cacheService.set(cacheKey, post);
        }
        res.json(post);
    }
    catch (error) {
        logger_1.logger.error(`Error in /cache/posts/${req.params.id}:`, error);
        next(error);
    }
});
router.delete('/flush', async (_req, res, next) => {
    try {
        await cacheService.flush();
        res.json({ message: 'Cache flushed successfully' });
    }
    catch (error) {
        logger_1.logger.error('Error flushing cache:', error);
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=cache.routes.js.map