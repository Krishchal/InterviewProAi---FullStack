import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import authRouter from "./routes/authRouter.js";
import audioRouter from "./routes/audioRouter.js";
import { route as processedMessageRoute } from "./routes/processedMessageRoute.js";
import { startConsumer } from "./utils/consumer.js";
import "./utils/passport.js"; // Make sure this line is importing your passport.js file

const app = express();
dotenv.config();

app.use(express.json());
app.use(bodyParser.json());
app.use((req, res, next) => {
	res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
	res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
	res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

	next();
});
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: true,
	})
);

app.use(
	cors({
		origin: "http://localhost:5173", // Replace with your frontend's URL
		methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
		credentials: true, // Allow credentials (if needed)
	})
);
app.use(passport.initialize());
app.use(passport.session());

// app.use("/auth", authRouter);
app.use("/api/auth", authRouter);
app.use("/api/audio", audioRouter);
app.use("/api/messages", processedMessageRoute); // New route

// Endpoint to process messages received from RabbitMQ
app.post("/exchange", (req, res) => {
	const { message } = req.body;
	// console.log(`[*] Message received: ${message}`);
	res.json({ status: "Message processed", message });
});

const PORT = process.env.PORT || 8010;
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
