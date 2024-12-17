import axios from "axios";
import UserExpertise from "../models/userExpertiseModel.js";

export const getRecommendedQuestions = async (req, res) => {
	try {
		const { id } = req.params;

        // get user from jwt token
		const userExpertise = await UserExpertise.findById(id);

		if (!userExpertise) {
			return res.status(404).json({ error: "User expertise not found" });
		}

		//  payload for the recommendation API
		const payload = {
			expertise: userExpertise.expertise,
			level: userExpertise.level,
		};

		const response = await axios.post("http://localhost:5001/recommend-questions", payload);

		res.status(200).json({ recommended_questions: response.data.recommended_questions });
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch recommended questions" });
		console.error("Error fetching recommended questions:", error.message);
	}
};