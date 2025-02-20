import pkg from 'joi';
const { required } = pkg;
import mongoose from "mongoose";

// Define the schema for your data
const dataSchema = new mongoose.Schema({
	id: { type: String, required: true },
	question: { type: String, required: true },
	transcribed_text: { type: String, required: true },
	loggedInEmail: { type: String, required: true },
	session_id:{type:Number},
	report: {
		CosineSimilarity: { type: Number },
		TechnicalWordConcurrency: { type: Number },
		RepeatedWords: { type: Number },
		Precision: { type: Number },
		PredefinedTechnicalWordsCount: { type: Number },
		InputTechnicalWordsCount: { type: Number },
		Accuracy: { type: Number },
		tfidf_matrix: { type: [String] },
	},
});

// Create the model
const Data = mongoose.model("Data", dataSchema);
export default Data;
