import express from "express";
import { loginValidation,signupValidation} from "../middlewares/authValidation.js";
import { login, signup } from "../controllers/authController.js";

const route = express.Router();

route.post("/login",loginValidation,login);
route.post("/signup",signupValidation,signup);

export default route;