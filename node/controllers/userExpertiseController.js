//dbSchema
import UserExpertise from "../models/userExpertiseModel.js";

export const createUserExpertise = async (req, res) => {
	try {
		const userExpertise = new UserExpertise(req.body);
		if (!userExpertise) {
			return res.status(404).json({ msg: "No expertise selected or Available" });
		}
		const savedExpertise = await userExpertise.save();
		return res.status(201).json({ msg: "Successfully added user expertise", savedExpertise });
	} catch (error) {
		res.status(500).json({ error: error });
	}
};
