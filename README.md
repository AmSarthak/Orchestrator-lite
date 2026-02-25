# Orchestrator-lite

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

### 🚦 Quick Start
