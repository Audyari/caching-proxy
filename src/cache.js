const { redisClient, isRedisConnected, redisConfig, memoryCache } = require('../config/redis');

// In-memory fallback cache
let localCache = {};

async function getCache(key) {
    try {
        // Try Redis first if connected
        if (isRedisConnected() && redisClient()) {
            const value = await redisClient().get(key);
            if (value !== null) {
                console.log(`[REDIS HIT] Key: ${key}`);
                return value;
            }
            console.log(`[REDIS MISS] Key: ${key}`);
        } else {
            console.log(`[MEMORY FALLBACK] Key: ${key}`);
        }

        // Fallback to memory cache
        return localCache[key] || null;
    } catch (error) {
        console.error('Error getting cache:', error.message);
        // Fallback to memory cache on error
        return localCache[key] || null;
    }
}

async function setCache(key, value) {
    try {
        // Try Redis first if connected
        if (isRedisConnected() && redisClient()) {
            await redisClient().setEx(key, redisConfig.ttl, value);
            console.log(`[REDIS SET] Key: ${key}, TTL: ${redisConfig.ttl}s`);
        } else {
            console.log(`[MEMORY SET] Key: ${key}`);
        }

        // Always store in memory as fallback
        localCache[key] = value;
    } catch (error) {
        console.error('Error setting cache:', error.message);
        // Fallback to memory cache on error
        localCache[key] = value;
    }
}

async function clearCache() {
    try {
        // Clear Redis if connected
        if (isRedisConnected() && redisClient()) {
            await redisClient().flushDb();
            console.log('[REDIS CLEAR] All cache cleared');
        } else {
            console.log('[MEMORY CLEAR] Clearing memory cache only');
        }

        // Always clear memory cache
        localCache = {};
        console.log('[MEMORY CLEAR] Memory cache cleared');
    } catch (error) {
        console.error('Error clearing cache:', error.message);
        // Fallback to memory cache clear on error
        localCache = {};
        console.log('[MEMORY CLEAR] Memory cache cleared (fallback)');
    }
}

// Helper function to get cache statistics
async function getCacheStats() {
    try {
        const stats = {
            redisConnected: isRedisConnected(),
            memoryKeys: Object.keys(localCache).length
        };

        if (isRedisConnected() && redisClient()) {
            try {
                const info = await redisClient().info('memory');
                stats.redisInfo = info;
            } catch (err) {
                console.error('Error getting Redis info:', err.message);
            }
        }

        return stats;
    } catch (error) {
        console.error('Error getting cache stats:', error.message);
        return {
            redisConnected: false,
            memoryKeys: Object.keys(localCache).length,
            error: error.message
        };
    }
}

module.exports = {
    getCache,
    setCache,
    clearCache,
    getCacheStats
};
