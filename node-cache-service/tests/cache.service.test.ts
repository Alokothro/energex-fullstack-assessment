import { CacheService } from '../src/services/cache.service';
import { redisClient } from '../src/config/redis';

jest.mock('../src/config/redis', () => ({
  redisClient: {
    get: jest.fn(),
    setEx: jest.fn(),
    del: jest.fn(),
    flushAll: jest.fn()
  }
}));

jest.mock('../src/config/logger', () => ({
  logger: {
    debug: jest.fn(),
    info: jest.fn(),
    error: jest.fn()
  }
}));

describe('CacheService', () => {
  let cacheService: CacheService;

  beforeEach(() => {
    cacheService = new CacheService();
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should return parsed data when cache hit', async () => {
      const testData = { id: 1, title: 'Test' };
      (redisClient.get as jest.Mock).mockResolvedValue(JSON.stringify(testData));

      const result = await cacheService.get('test-key');

      expect(result).toEqual(testData);
      expect(redisClient.get).toHaveBeenCalledWith('test-key');
    });

    it('should return null when cache miss', async () => {
      (redisClient.get as jest.Mock).mockResolvedValue(null);

      const result = await cacheService.get('test-key');

      expect(result).toBeNull();
    });

    it('should return null on error', async () => {
      (redisClient.get as jest.Mock).mockRejectedValue(new Error('Redis error'));

      const result = await cacheService.get('test-key');

      expect(result).toBeNull();
    });
  });

  describe('set', () => {
    it('should set cache with default TTL', async () => {
      const testData = { id: 1, title: 'Test' };
      (redisClient.setEx as jest.Mock).mockResolvedValue('OK');

      const result = await cacheService.set('test-key', testData);

      expect(result).toBe(true);
      expect(redisClient.setEx).toHaveBeenCalledWith(
        'test-key',
        600,
        JSON.stringify(testData)
      );
    });

    it('should set cache with custom TTL', async () => {
      const testData = { id: 1, title: 'Test' };
      (redisClient.setEx as jest.Mock).mockResolvedValue('OK');

      const result = await cacheService.set('test-key', testData, 300);

      expect(result).toBe(true);
      expect(redisClient.setEx).toHaveBeenCalledWith(
        'test-key',
        300,
        JSON.stringify(testData)
      );
    });

    it('should return false on error', async () => {
      (redisClient.setEx as jest.Mock).mockRejectedValue(new Error('Redis error'));

      const result = await cacheService.set('test-key', { id: 1 });

      expect(result).toBe(false);
    });
  });

  describe('delete', () => {
    it('should delete cache key', async () => {
      (redisClient.del as jest.Mock).mockResolvedValue(1);

      const result = await cacheService.delete('test-key');

      expect(result).toBe(true);
      expect(redisClient.del).toHaveBeenCalledWith('test-key');
    });

    it('should return false on error', async () => {
      (redisClient.del as jest.Mock).mockRejectedValue(new Error('Redis error'));

      const result = await cacheService.delete('test-key');

      expect(result).toBe(false);
    });
  });

  describe('flush', () => {
    it('should flush all cache', async () => {
      (redisClient.flushAll as jest.Mock).mockResolvedValue('OK');

      const result = await cacheService.flush();

      expect(result).toBe(true);
      expect(redisClient.flushAll).toHaveBeenCalled();
    });

    it('should return false on error', async () => {
      (redisClient.flushAll as jest.Mock).mockRejectedValue(new Error('Redis error'));

      const result = await cacheService.flush();

      expect(result).toBe(false);
    });
  });
});