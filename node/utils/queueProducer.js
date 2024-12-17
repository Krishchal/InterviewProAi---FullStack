import amqp from "amqplib";
const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";
const QUEUE_NAME = "audio-stream";

let rabbitMqConnection = null;
let rabbitMqChannel = null;

// Reuse RabbitMQ connection and channel
export const initializeRabbitMQ = async () => {
	if (!rabbitMqConnection) {
		rabbitMqConnection = await amqp.connect(RABBITMQ_URL);
		rabbitMqChannel = await rabbitMqConnection.createChannel();
		await rabbitMqChannel.assertQueue(QUEUE_NAME, { durable: true });
		console.log("Connected to RabbitMQ");
	}
};

// Produce message to RabbitMQ
export const produceToQueue = async (message) => {
	if (!rabbitMqChannel) {
		await initializeRabbitMQ();
	}
	rabbitMqChannel.sendToQueue(QUEUE_NAME, Buffer.from(message), { persistent: true });
	console.log(`Message sent to RabbitMQ: ${message}`);
};
