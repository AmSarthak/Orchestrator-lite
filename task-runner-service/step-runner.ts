import {
    Step
} from "./types";
import {
    executeStep
} from "./step-executer";
import http from 'http';
import ws from 'ws';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

const server = http.createServer(app);
const wss = new ws.Server({
    server
});

function broadcast(data) {
    const payload = JSON.stringify(data);

    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
        }
    });
}

export function startWebsocket(){
    wss.on("connection", (ws) => {
        console.log("Client connected");
        ws.send(JSON.stringify({
            type: "WORKFLOW STARTED",
            data: [],
            timestamp: Date.now(),
        }));

        ws.on("close", () => {
            console.log("Client disconnected");
        });
    });

    server.listen(3002, () => {
        console.log("Websocket running on port 3002");
    });

}


export async function executeWorkflow(steps: Step[]) {
    const events: any[] = [];
    for (const step of steps) {

        events.push({
            type: "Step Started",
            title: step,
            startTime: new Date().toLocaleTimeString()
        })
        broadcast({
            type: "Step Started",
            title: step,
            startTime: new Date().toLocaleTimeString()
        });

        let attempt = 0;
        let successFlag = false;
        const maxRetries = step.retryCount ?? 0;
        while (attempt <= maxRetries) {
            try {
                await executeStep(step);
                events.push({
                    type: "Step Completed",
                    title: step,
                    startTime: new Date().toLocaleTimeString()
                })
                broadcast({
                    type: "Step Completed",
                    title: step,
                    startTime: new Date().toLocaleTimeString()
                });
                successFlag = true;
                break;
            } catch (error) {
                events.push({
                    type: "Step Failed",
                    title: step,
                    attempt: attempt + 1,
                    startTime: new Date().toLocaleTimeString()
                });
                broadcast({
                    type: "Step Failed",
                    title: step,
                    attempt: attempt + 1,
                    startTime: new Date().toLocaleTimeString()
                });
                if (attempt == maxRetries) {
                     broadcast({
                        type: "Retry failed",
                        title: step,
                        attempt: attempt + 1,
                        startTime: new Date().toLocaleTimeString()
                    });
                    successFlag = false;
                     broadcast({
                        type: "Workflow Failed",
                        endTime: new Date().toLocaleTimeString()
                    });
                    return;
                }
            }
            attempt++;
        }
        if (!successFlag) break;

    }
    broadcast({
        type: "Workflow Complete",
        startTime: new Date().toLocaleTimeString()
    });
    
}