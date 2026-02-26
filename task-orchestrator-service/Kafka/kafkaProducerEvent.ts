import {kafka} from './kafkaClient'

const producer = kafka.producer();

export async function sendTaskToRunner(task) {
  await producer.connect();

  await producer.send({
    topic: "task.execute",
    messages: [
      {
        key: task.taskId,
        value: JSON.stringify(task),
      },
    ],
  });
}