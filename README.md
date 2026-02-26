# Orchestrator-lite

<img width="1879" height="927" alt="Screenshot 2026-02-26 at 2 40 55 PM" src="https://github.com/user-attachments/assets/b781e18b-0278-46bf-a8d5-2ded85f5a012" />


<img width="1214" height="735" alt="Screenshot 2026-02-26 at 5 53 17 PM" src="https://github.com/user-attachments/assets/c53eab2d-25c3-4191-af6f-11cb29f64c18" />





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

# Architecture

<img width="416" height="232" alt="Screenshot 2026-02-26 at 6 00 28 PM" src="https://github.com/user-attachments/assets/be7187fb-5efe-4c73-aecf-19db08f59cad" />


### 🚦 Quick Start

# Frontend

Download Docker Desktop

In Frontend folder, run **docker-compose up --build**

# Backend

In folder task-executor-service npm run dev

In folder task-orchestrator-service npm run dev

# Kafka

Run kafka container on Docker named kafka-local. Change broker name as required in kafkaClient.ts



