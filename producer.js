const { Queue } = require('bullmq');

const codeQueue = new Queue('code-execution-queue', {
    connection: { host: '127.0.0.1', port: 6379 }
});

async function addJob() {
    
    const pythonCode = `
import time
print("Step 1: Code recieved.")
time.sleep(1)
print("Step 2: Processing inside Docker...")
print("Step 3: Hello from a disposable container!")
    `;

    const job = await codeQueue.add('python-job', {
        code: pythonCode
    });

    console.log(`📥 Job ${job.id} added to queue.`);
}

addJob();