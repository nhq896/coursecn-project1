import { Redis } from "ioredis";

const redisClient = () => {
  if (process.env.REDIS_URL) {
    console.log(`Kết nối Redis thành công!!`);
    return process.env.REDIS_URL;
  }
  throw new Error("Không kết nối được Redis!!");
};

export const redis = new Redis(redisClient());
