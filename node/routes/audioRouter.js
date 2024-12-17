import express from "express";
import multer from "multer";
import { AudioController } from "../controllers/audioController.js";

const upload = multer({ storage: multer.memoryStorage() });

const route = express.Router();

route.post("/stream", upload.single("audio"), AudioController);

export default route;
