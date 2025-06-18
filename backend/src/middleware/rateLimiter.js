import ratelimits from "../config/upstash.js";

const rateLimiter = async(req, res, next) => {
  try {
    const {success} = await ratelimits.limit("my-rate-limit")

    if(!success){
        return res.status(429).json({message: "Too many requests, please try again later."});
    }

    next();
  } catch (error) {
    console.error("Rate limiter error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default rateLimiter;

