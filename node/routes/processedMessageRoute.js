import express from "express";
import { getProcessedMessages, getAllData, getSessionId } from "../controllers/processedMessageController.js";

const route = express.Router();

// GET endpoint to fetch processed messages
route.get("/processed-messages", getProcessedMessages);
route.get("/all-processed-data", getAllData);
route.post("/get-session-id",getSessionId)
export { route };
