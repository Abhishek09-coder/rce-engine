const Redis = require('ioredis');

// 1. Redis se connect karo (Localhost:6379 par)
const redis = new Redis(); 

async function testRedis() {
    try {
        console.log("🔌 Connecting to Redis...");

        // 2. Kuch data save karo (SET command)
        // Key: 'user-1', Value: 'Abhishek'
        await redis.set('user-1', 'Abhishek');
        console.log("✅ Data Saved!");

        // 3. Wahi data wapas maango (GET command)
        const value = await redis.get('user-1');
        console.log("📥 Retrieved Value:", value);

        // Cleanup
        redis.disconnect();
    } catch (err) {
        console.error("❌ Error:", err);
    }
}

testRedis();