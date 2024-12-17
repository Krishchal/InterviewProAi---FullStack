import express from "express";
import { createUserExpertise } from "../controllers/userExpertiseController.js";
import { getRecommendedQuestions } from "../controllers/recommendationController.js";

const route = express.Router();

route.post("/createUserExpertise", createUserExpertise);
route.post("/recommemend-question/:id", getRecommendedQuestions);


export { route };
