# Orchestrator-lite

<img width="1753" height="889" alt="Screenshot 2026-02-26 at 2 43 24 PM" src="https://github.com/user-attachments/assets/81b951ee-bbea-4706-ba17-f938fbb1f4cd" />
<img width="1753" height="889" alt="Screenshot 2026-02-26 at 2 43 24 PM" src="https://github.com/user-attachments/assets/1cad36a1-77f8-4663-837e-9beda0a2a6bb" />


**Distributed Workflow Engine | Kafka-Native | Real-Time UI**

A high-performance demonstration of the Orchestrator-Worker pattern. This project showcases how to handle long-running distributed tasks with zero-loss reliability.

### ⚡ Key Features
- **Event-Driven Orchestration:** Decoupled execution via Kafka.
- **Reactive UX:** Microfrontend architecture with WebSocket-powered live telemetry.
- **Fault Tolerance:** Built-in retry logic with jittered exponential backoff.


### 🏗️ System Design
1. **Frontend (React/Vite):** Streams live execution logs via `ws://`.
2. **Gateway:** REST/Socket entry point for workflow triggers.
3. **Kafka Bus:** The backbone for task distribution and state signaling.
4. **Workers:** Horizontally scalable consumers executing discrete workflow steps.

### 🏗️ Architechture
1. The Microfrontend (MFE) Layer

The UI is designed as a standalone, federated module that can be embedded into any host platform.

Reactive Telemetry: Utilizes a persistent WebSocket connection to "live-tail" the Kafka event stream.

Optimistic UI: Provides immediate feedback on workflow triggers while awaiting asynchronous confirmation from the backend.

State Projection: Instead of polling a database, the MFE builds its local state incrementally by listening to incoming event packets.

2. The Messaging & Coordination Layer (Kafka)

Kafka acts as the central nervous system, ensuring that state transitions are durable and traceable.

Workflow Log: Every step, retry, and failure is recorded as an immutable event in the workflow-events topic.

The WebSocket Bridge: A specialized gateway service acts as a Kafka Consumer, translating internal binary streams into JSON payloads for the Microfrontend.



### 🚦 Quick Start

# Frontend

npm run build on both workflow-app and monitor-app

On workflow app: npm run preview -- --port 5001

On monitor app: npm run preview -- --port 5002

Run npm run dev on Shell app.

# Backend

