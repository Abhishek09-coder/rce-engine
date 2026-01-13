const { Worker } = require('bullmq');
const Docker = require('dockerode');
const stream = require('stream');

const docker = new Docker(); // Docker Connection

const worker = new Worker('code-execution-queue', async (job) => {
    console.log(`\n👨‍🍳 Chef: Cooking Job ${job.id}...`);
    
    const userCode = job.data.code;
    
    try {
        // --- DOCKER LOGIC STARTS HERE ---
        const image = 'python:3.9-alpine';
        const cmd = ['python3', '-c', userCode];

        const logStream = new stream.PassThrough();
        let output = '';

        logStream.on('data', (chunk) => {
            output += chunk.toString();
        });

        // Container start karo
        await docker.run(
            image, 
            cmd, 
            logStream, 
            { Tty: true } 
        );
        // --- DOCKER LOGIC ENDS HERE ---

        console.log(`✅ Job Finished! Output:`);
        console.log("---------------------------------");
        console.log(output);
        return output;
        console.log("---------------------------------");

    } catch (err) {
        console.error("❌ Cooking Failed:", err);
    }
    
}, {
    connection: { host: '127.0.0.1', port: 6379 }
});

console.log("👷 Worker is ready to execute Docker jobs...");