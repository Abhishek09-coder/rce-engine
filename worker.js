const { Worker } = require('bullmq');
const Docker = require('dockerode');
const stream = require('stream');

const docker = new Docker();

// Redis Connection
const redisConfig = { host: '127.0.0.1', port: 6379 };

const worker = new Worker('code-execution-queue', async (job) => {
    console.log(`\n👨‍🍳 Chef: Cooking Job ${job.id}...`);
    
    const userCode = job.data.code;
    let container; // 🟢 FIX 1: Container variable ko bahar define kiya

    try {
        const image = 'python:3.9-alpine';
        const cmd = ['python3', '-c', userCode];

        const logStream = new stream.PassThrough();
        let output = '';

        logStream.on('data', (chunk) => {
            output += chunk.toString();
        });

        // 1. Container Create
        container = await docker.createContainer({
            Image: image,
            Cmd: cmd,
            Tty: false
        });

        // 2. Stream Attach
        const streamData = await container.attach({ stream: true, stdout: true, stderr: true });
        streamData.pipe(logStream);

        // 3. Start
        await container.start();

        // 4. Timeout Logic
        const runPromise = container.wait();
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Time Limit Exceeded")), 5000)
        );

        await Promise.race([runPromise, timeoutPromise]);
        
        console.log(`✅ Job Finished!`);
        return output;

    } catch (err) {
        console.error("❌ Error:", err.message);
        
        if(err.message.includes("Time Limit")) {
            return "Error: Time Limit Exceeded (Code took too long)";
        }
        return `Error: ${err.message}`;

    } finally {
        // 🟢 FIX 2: Ye block HAMESHA chalega (Chahe Error aaye ya Success ho)
        if (container) {
            try {
                // 'force: true' zaroori hai agar infinite loop chal raha ho toh zabardasti maarne ke liye
                await container.remove({ force: true }); 
                console.log("🧹 Cleanup: Container removed.");
            } catch (cleanupErr) {
                console.error("⚠️ Cleanup Failed:", cleanupErr.message);
            }
        }
    }
    
}, {
    connection: redisConfig
});

console.log("👷 Worker is ready (Crash Proof w/ FINALLY block)...");