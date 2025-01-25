import Redis from "ioredis"
import "dotenv/config"

export const redis = new Redis(process.env.UPSTASH_REDIS_URL);
// await redis.set('fo', 'bar');
// await redis.get("fo");