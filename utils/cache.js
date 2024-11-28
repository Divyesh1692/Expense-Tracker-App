const redis = require("redis");
require("dotenv").config();

const client = redis.createClient({
  password: process.env.REDIS_PASS,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

client.connect();

client.on("connect", () => {
  console.log("Connected to Redis");
});

client.on("error", (err) => {
  console.error("Redis connection error:", err);
});

const setCache = async (key, value, expirationInSeconds = 7200) => {
  try {
    // console.log("set cache:", value);
    await client.setEx(key, expirationInSeconds, JSON.stringify(value));
  } catch (error) {
    console.error("Error setting cache:", error);
  }
};

const getCache = async (key) => {
  try {
    const data = await client.get(key);
    // console.log("get cache:", data);

    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error getting cache:", error);
    return null;
  }
};

const deleteCache = async (keyPattern) => {
  try {
    const keys = await client.keys(keyPattern);
    if (keys.length > 0) {
      await client.del(keys);
      console.log("Cache deleted successfully");
    }
  } catch (error) {
    console.error("Error deleting cache:", error);
  }
};

module.exports = { setCache, getCache, deleteCache };
