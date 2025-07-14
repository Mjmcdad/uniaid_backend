const { getAsync, setAsync, delAsync, keysAsync } = require("../config/redis");

const DEFAULT_EXPIRATION = 3600; // 1 hour

const getOrSetCache = async (key, callback) => {
  try {
    const cachedData = await getAsync(key);
    if (cachedData) return JSON.parse(cachedData);

    const freshData = await callback();
    await setAsync(key, JSON.stringify(freshData), "EX", DEFAULT_EXPIRATION);
    return freshData;
  } catch (error) {
    console.error("Cache error:", error);
    return callback(); // Fallback to original function if cache fails
  }
};

const clearCacheByPattern = async (pattern) => {
  try {
    const keys = await keysAsync(pattern);
    if (keys.length > 0) {
      await Promise.all(keys.map((key) => delAsync(key)));
    }
  } catch (error) {
    console.error("Cache clear error:", error);
  }
};

module.exports = {
  getOrSetCache,
  clearCacheByPattern,
};
