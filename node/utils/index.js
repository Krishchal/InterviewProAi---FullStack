import { sendEmail } from "./mailService.js";
import { initializeRabbitMQ, produceToQueue } from "./queueProducer.js";

export { initializeRabbitMQ, sendEmail, produceToQueue };