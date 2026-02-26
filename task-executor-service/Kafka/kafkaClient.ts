import { Kafka } from "kafkajs";

export const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || "kafka-local",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
});