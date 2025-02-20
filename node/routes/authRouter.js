import express from "express";
import passport from "passport";
import { loginValidation, signupValidation } from "../middlewares/authValidation.js";
import { login, signup, googleLogin } from "../controllers/authController.js";

const route = express.Router();

// Traditional email/password login
route.post("/login", loginValidation, login);

// Traditional email/password signup
route.post("/signup", signupValidation, signup);

// Google OAuth login
route.post("/google/login", googleLogin); // New endpoint for handling Google login

export default route;
