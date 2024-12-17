import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
// import { initializeRabbitMQ } from "./utils/queueProducer.js";

import authRouter from "./routes/authRouter.js";
import audioRouter from "./routes/audioRouter.js";
import { route as processedMessageRoute } from "./routes/processedMessageRoute.js";
import { startConsumer } from "./utils/consumer.js";

const app = express();
dotenv.config();
app.use(bodyParser.json());
app.use(cors());

app.use(
	cors({
		origin: process.env.CORS_ORIGIN,
		credentials: true,
	})
);

app.use("/api/auth", authRouter);
app.use("/api/audio", audioRouter);
app.use("/api/messages", processedMessageRoute); // New route

// Endpoint to process messages received from RabbitMQ
app.post("/exchange", (req, res) => {
	const { message } = req.body;
	// console.log(`[*] Message received: ${message}`);
	res.json({ status: "Message processed", message });
});

const PORT = process.env.PORT || 8002;
const URL = process.env.MONGOURL;

mongoose
	.connect(URL)
	.then(() => {
		console.log("DB connected successfully.");
		app.listen(PORT, () => {
			console.log(`Listening to Port: ${PORT}`);
			startConsumer();
		});
	})
	.catch((error) => console.log(error));
