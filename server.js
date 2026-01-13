const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');                // 🟢 NEW: HTTP Server
const { Server } = require('socket.io');     // 🟢 NEW: Socket.io
const { Queue, Job, QueueEvents } = require('bullmq'); // 🟢 NEW: QueueEvents

const app = express();
app.use(bodyParser.json());

// Express ko HTTP Server ke saath jodna padta hai Sockets ke liye
const server = http.createServer(app);
const io = new Server(server);

// 1. Redis Connection Setup
const redisConfig = { host: '127.0.0.1', port: 6379 };

const codeQueue = new Queue('code-execution-queue', { connection: redisConfig });
const queueEvents = new QueueEvents('code-execution-queue', { connection: redisConfig });

// 2. Queue Events Listener (Jaise hi Worker kaam khatam karega, ye chalega)
queueEvents.on('completed', ({ jobId, returnvalue }) => {
    console.log(`⚡ Job ${jobId} completed! Sending to frontend...`);
    
    // Frontend ko batao: "Kaam Ho Gaya!"
    io.emit('job-completed', { 
        jobId, 
        output: returnvalue 
    });
});

// 3. Socket Connection (Jab koi User website par aayega)
io.on('connection', (socket) => {
    console.log('👤 A user connected:', socket.id);
});
// HTML file serve karne ke liye
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
// API Routes
app.post('/run', async (req, res) => {
    const { code } = req.body;
    const job = await codeQueue.add('python-job', { code });
    res.json({ jobId: job.id });
});

// Start Server (app.listen ki jagah server.listen)
server.listen(3000, () => {
    console.log("🚀 Server + Sockets running on http://localhost:3000");
});