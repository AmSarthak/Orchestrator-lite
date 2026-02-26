# Orchestrator-lite

<img width="1753" height="889" alt="Screenshot 2026-02-26 at 2 43 24 PM" src="https://github.com/user-attachments/assets/81b951ee-bbea-4706-ba17-f938fbb1f4cd" />


<img width="1920" height="1080" alt="Screenshot 2026-02-26 at 2 40 45 PM (2)" src="https://github.com/user-attachments/assets/adc94223-0d00-4c49-8447-a42718127062" />



**Distributed Workflow Engine | Kafka-Native | Real-Time UI**

A high-performance demonstration of the Orchestrator-Worker pattern. This project showcases how to handle long-running distributed tasks with zero-loss reliability.

### ⚡ Key Features
- **Event-Driven Orchestration:** Decoupled execution via Kafka.
- **Reactive UX:** Microfrontend architecture with WebSocket-powered live telemetry.
- **Containerized Delivery:** High-performance **Nginx** containers serving static MFEs with optimized caching and CORS-ready headers.
- **Fault Tolerance:** Built-in retry logic with jittered exponential backoff.


### 🏗️ System Design
1. **Frontend (React/Vite):** Streams live execution logs via `ws://`.
2. **Gateway:** REST/Socket entry point for workflow triggers.
3. **Kafka Bus:** The backbone for task distribution and state signaling.
4. **Workers:** Horizontally scalable consumers executing discrete workflow steps.

### 🏗️ Architechture

***1. The Microfrontend (MFE) Layer**

The UI is designed as a standalone, federated module that can be embedded into any host platform.

Reactive Telemetry: Utilizes a persistent WebSocket connection to "live-tail" the event stream.

Optimistic UI: Provides immediate feedback on workflow triggers while awaiting asynchronous confirmation from the backend.

State Projection: Instead of polling a database, the MFE builds its local state incrementally by listening to incoming event packets.

**2. The Messaging & Backend Layer (Kafka)**

The system follows a control-plane / data-plane separation:

**Task Executor (Control Plane)** – Manages workflow state, retry logic, and WebSocket updates.

**Task Runner (Data Plane)**– Executes individual tasks and publishes results.

**Kafka** – Provides durable, asynchronous communication between services.



### 🚦 Quick Start

# Frontend

Download Docker Desktop

In Frontend folder, run **docker-compose up --build**

# Backend

In folder task-executor-service npm run dev

In folder task-orchestrator-service npm run dev

# Kafka

Run kafka container on Docker named kafka-local. Change broker name as required in kafkaClient.ts

