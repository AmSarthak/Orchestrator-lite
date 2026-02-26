import {kafka} from './kafkaClient'
import { executeStep } from '../step-executer';

const consumer = kafka.consumer({ groupId: "task-runner-group" });
const producer = kafka.producer();

export async function startRunner() {
  await consumer.connect();
  await producer.connect();

  await consumer.subscribe({
    topic: "task.execute",
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const task = JSON.parse(message.value!.toString());

      try {
        await executeStep(task);

        await producer.send({
          topic: "task.result",
          messages: [
            {
              key: task.taskId,
              value: JSON.stringify({ ...task, status: "SUCCESS" }),
            },
          ],
        });

      } catch (err) {

        await producer.send({
          topic: "task.result",
          messages: [
            {
              key: task.taskId,
              value: JSON.stringify({ ...task, status: "FAILED" }),
            },
          ],
        });
      }
    }
  });
}