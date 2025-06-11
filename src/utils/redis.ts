// import { createClient } from "redis";

// const redisClient = createClient({
//   url: process.env.REDIS_URL || "redis://localhost:6379",
// });

// redisClient.on("error", (err) => console.error("Redis Client Error", err));

// async function connection() {
//   await redisClient.connect();
// };
// connection();

// export default redisClient;

// import { createClient } from "redis";
// console.log("Using Redis URL:", process.env.REDIS_URL);

// const redisClient = createClient({
//   url: process.env.REDIS_URL,
// });

// redisClient.on("error", (err) => {
//   console.error("Redis Client Error", err);
// });

// async function connectWithRetry(retries = 5) {
//   while (retries) {
//     try {
//       await redisClient.connect();
//       console.log("Connected to Redis");
//       return;
//     } catch (err) {
//       console.error("Failed to connect to Redis. Retrying in 3s...", err);
//       retries--;
//       await new Promise(res => setTimeout(res, 3000));
//     }
//   }
//   throw new Error("Redis connection failed after retries");
// }

// connectWithRetry();

// export default redisClient;

import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL;
if (!redisUrl) throw new Error(" REDIS_URL not set");

// console.log(" Connecting to Redis at:", redisUrl);

const redisClient = createClient({ url: redisUrl });

redisClient.on("error", (err) => {
  console.error(" Redis Client Error:", err.message);
});

redisClient.on("connect", () => {
  console.log(" Redis client connected");
});

(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error(" Redis connection failed:", err);
  }
})();

export default redisClient;
