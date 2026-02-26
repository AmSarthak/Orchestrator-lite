import { Step } from "./types";
import http from "http";
import ws, { WebSocket } from "ws";
import express from "express";
import cors from "cors";
import { sendTaskToRunner } from "./Kafka/kafkaProducerEvent";
import { kafka } from "./Kafka/kafkaClient";

const app = express();
app.use(cors());

const server = http.createServer(app);
const wss = new ws.Server({ server });

const consumer = kafka.consumer({ groupId: "task-executor-group" });

const pendingSteps = new Map<
  string,
  { resolve: () => void; reject: (err: any) => void }
>();

function broadcast(data: any) {
  const payload = JSON.stringify(data);

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}


export async function startWebsocket() {
  await consumer.connect();

  await consumer.subscribe({
    topic: "task.result",
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const result = JSON.parse(message.value!.toString());

      const { taskId, status } = result;

      console.log("Result received:", result);

      const pending = pendingSteps.get(taskId);

      if (pending) {
        if (status === "SUCCESS") {
          pending.resolve();
        } else {
          pending.reject(new Error("Step failed"));
        }
        pendingSteps.delete(taskId);
      }

      broadcast(result);
    },
  });

  wss.on("connection", (socket) => {
    console.log("Client connected");

    socket.send(
      JSON.stringify({
        type: "WORKFLOW STARTED",
        timestamp: Date.now(),
      })
    );

    socket.on("close", () => {
      console.log("Client disconnected");
    });
  });

  server.listen(3002, () => {
    console.log("Websocket running on port 3002");
  });
}

function waitForStep(taskId: string) {
  return new Promise<void>((resolve, reject) => {
    pendingSteps.set(taskId, { resolve, reject });
  });
}



export async function executeWorkflow(steps: Step[]) {
  for (const step of steps) {
    const taskId = `${step.name}-${Date.now()}`;

    broadcast({
      type: "Step Started",
      title: step.name,
      time: new Date().toLocaleTimeString(),
    });

    const maxRetries = step.retryCount ?? 0;
    let attempt = 0;
    let completed = false;

    while (attempt <= maxRetries) {
      try {
        await sendTaskToRunner({
          ...step,
          taskId,
        });

        await waitForStep(taskId);

        broadcast({
          type: "Step Completed",
          title: step.name,
          attempt: attempt + 1,
          time: new Date().toLocaleTimeString(),
        });

        completed = true;
        break;

      } catch (err) {

        if (attempt < maxRetries) {
          broadcast({
            type: "Step Retry",
            title: step.name,
            attempt: attempt + 1,
            time: new Date().toLocaleTimeString(),
          });
        }

        attempt++;
      }
    }

    if (!completed) {
      broadcast({
        type: "Step Retry Limit Exhausted",
        title: step.name,
        maxRetries,
        time: new Date().toLocaleTimeString(),
      });

      broadcast({
        type: "Workflow Failed",
        failedStep: step.name,
        time: new Date().toLocaleTimeString(),
      });

      return; // stop entire workflow immediately
    }
  }

  broadcast({
    type: "Workflow Complete",
    time: new Date().toLocaleTimeString(),
  });
}