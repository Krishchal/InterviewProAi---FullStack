//import bcrypt from "bcrypt";
import bcrypt from "bcryptjs"
import UserModel from "../models/User.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
	try {
		const { name, email, password } = req.body;
		const user = await UserModel.findOne({ email });
		if (user) {
			return res.status(409).json({ message: "User is already exists, Please login", success: false });
		}
		const userModel = new UserModel({ name, email, password });
		userModel.password = await bcrypt.hash(password, 10);
		await userModel.save();

		res.status(201).json({ message: "Signup Successfully", success: true });
	} catch (error) {
		res.status(500).json({ message: "Internal server error", success: false });
	}
};

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await UserModel.findOne({ email });
		console.log(user);
		if (!user) {
			return res.status(403).json({ message: "Authentication Failed, Wrong Email or Password !", success: false });
		}
		const isPassEqual = await bcrypt.compare(password, user.password);
		if (!isPassEqual) {
			return res.status(403).json({ message: "Wrong Email or Password !", success: false });
		}
		const jwtToken = await jwt.sign({ email: user.email, _id: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" });
		res.status(200).json({ message: "Login Successfully", success: true, jwtToken, email, name: user.name });
	} catch (error) {
		res.status(500).json({ message: error.message, success: false });
	}
};
