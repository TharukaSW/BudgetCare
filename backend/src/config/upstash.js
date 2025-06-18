import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit"; 
import "dotenv/config";

const redis = Redis.fromEnv();

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, "30 s"), 
});

export default ratelimit;