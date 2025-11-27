const redis = require('redis');

// Redis configuration
const redisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    db: process.env.REDIS_DB || 0,
    ttl: process.env.CACHE_TTL || 3600, // 1 jam dalam detik
    fallbackToMemory: process.env.FALLBACK_TO_MEMORY !== 'false'
};

// In-memory fallback cache
let memoryCache = {};

// Create Redis client
let redisClient = null;
let isRedisConnected = false;

async function initializeRedis() {
    try {
        redisClient = redis.createClient({
            socket: {
                host: redisConfig.host,
                port: redisConfig.port
            },
            password: redisConfig.password,
            database: redisConfig.db
        });

        redisClient.on('error', (err) => {
            console.error('Redis Client Error:', err);
            isRedisConnected = false;
        });

        redisClient.on('connect', () => {
            console.log('Redis Client Connected');
            isRedisConnected = true;
        });

        redisClient.on('ready', () => {
            console.log('Redis Client Ready');
            isRedisConnected = true;
        });

        redisClient.on('end', () => {
            console.log('Redis Client Connection Ended');
            isRedisConnected = false;
        });

        await redisClient.connect();
        return true;
    } catch (error) {
        console.error('Failed to connect to Redis:', error.message);
        console.log('Falling back to in-memory cache');
        isRedisConnected = false;
        return false;
    }
}

// Initialize Redis connection
initializeRedis();

module.exports = {
    redisConfig,
    redisClient: () => redisClient,
    isRedisConnected: () => isRedisConnected,
    memoryCache
};