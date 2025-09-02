import { Router, Request, Response, NextFunction } from 'express';
import { CacheService } from '../services/cache.service';
import { PostService } from '../services/post.service';
import { logger } from '../config/logger';

const router = Router();
const cacheService = new CacheService();
const postService = new PostService();

router.get('/posts', async (_req: Request, res: Response, next: NextFunction) => {
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
  } catch (error) {
    logger.error('Error in /cache/posts:', error);
    next(error);
  }
});

router.get('/posts/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
  } catch (error) {
    logger.error(`Error in /cache/posts/${req.params.id}:`, error);
    next(error);
  }
});

router.delete('/flush', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    await cacheService.flush();
    res.json({ message: 'Cache flushed successfully' });
  } catch (error) {
    logger.error('Error flushing cache:', error);
    next(error);
  }
});

export default router;