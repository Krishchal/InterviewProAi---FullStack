import express from "express";
import { getProcessedMessages } from "../controllers/processedMessageController.js";

const route = express.Router();

// GET endpoint to fetch processed messages
route.get("/processed-messages", getProcessedMessages);

export { route };
