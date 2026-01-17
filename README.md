# ⚡ Remote Code Execution (RCE) Engine

A scalable, secure code execution engine capable of running untrusted user code in an isolated environment. Built using **Microservices Architecture**.

## 🚀 Key Features
- **Sandboxed Execution:** Uses **Docker Containers** to isolate user code from the host system, ensuring 100% security against malicious attacks.
- **Asynchronous Processing:** Implements **BullMQ (Redis)** for job queuing to handle high concurrency traffic.
- **Real-time Output:** Streams execution logs instantly to the frontend using **WebSockets (Socket.io)**.
- **Security Protocols:** Includes automatic **Timeouts (5s)** and memory limits to prevent infinite loops and fork bombs.

## 🛠️ Tech Stack
- **Frontend:** HTML5, CSS (Dark Mode Terminal UI)
- **Backend:** Node.js, Express.js
- **Orchestration:** Docker, Dockerode
- **Database/Queue:** Redis, BullMQ
- **Communication:** HTTP (REST), WebSockets

## ⚙️ Architecture Flow
1. User submits code → **API Server** pushes job to **Redis Queue**.
2. **Worker Service** pulls the job asynchronously.
3. Worker spins up a fresh **Docker Container (Alpine Linux)**.
4. Code executes safely inside the container.
5. Output is streamed back to the user via **WebSockets**.
6. Container is destroyed immediately (Cleanup).

## 🏃‍♂️ How to Run Locally

### Prerequisites
- Node.js
- Docker Desktop (Running)
