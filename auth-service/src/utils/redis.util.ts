import { Redis } from 'ioredis';
import { error } from 'node:console';

export class RedisUtil {
  private readonly redisClient: Redis;
  constructor() {
    this.redisClient = new Redis({
      host: '127.0.0.1',
      port: 6379,
    });

    this.redisClient.on('error', () => {
      console.error('redis error: ', error);
    });
  }

  async setValue(key: string, value: string, ttl: number): Promise<void> {
    await this.redisClient.set(key, value, 'EX', ttl);
  }

  getValue(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  deleteValue(key: string): Promise<number> {
    return this.redisClient.del(key);
  }
}
