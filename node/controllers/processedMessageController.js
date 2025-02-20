import Data from "../models/DataSchema.js";

export async function addMessageToProcessedList(message) {
	try {
		const { session_id, loggedInEmail, id, question, transcribed_text, report } = message;

		if (!loggedInEmail) {
			console.log("Email is required");
			return;
		}

		// Process the single message
		const processedData = {
			id,
			question,
			transcribed_text,
			loggedInEmail,
			session_id,
			report: {
				CosineSimilarity: Number(report.CosineSimilarity).toFixed(7),
				TechnicalWordConcurrency: Number(report.TechnicalWordConcurrency).toFixed(7),
				RepeatedWords: Number(report.RepeatedWords).toFixed(7),
				Precision: Number(report.Precision).toFixed(7),
				PredefinedTechnicalWordsCount: report.PredefinedTechnicalWordsCount,
				InputTechnicalWordsCount: report.InputTechnicalWordsCount,
				Accuracy: Number(report.Accuracy).toFixed(7),
				tfidf_matrix: report.tfidf_matrix,
			},
		};

		const newData = new Data(processedData);
		await newData.save();
		console.log("Data saved successfully", newData);
		return newData;
	} catch (error) {
		console.log("Error saving data", error.message);
		throw error;
	}
}

// Controller to return processed messages
export const getProcessedMessages = async (req, res) => {
	try {
		const { email } = req.param; // Get the ID from the request params

		// Find the document by ID
		const data = await Data.find({ email });

		if (!data) {
			return res.status(404).json({ message: "Data not found" });
		}

		// Send the found data as the response
		res.status(200).json({ success: true, messages: data });
	} catch (error) {
		// Handle errors
		res.status(500).json({ message: "Error retrieving data", error: error.message });
	}
};
// export const getProcessedMessages = async (req, res) => {
// 	console.log("GETTING PROCESSED MESSAGES");
// 	try {
// 		const { email } = req.param; // Get the ID from the request params
// 		console.log(email);
// 		if (!email) {
// 			return res.status(400).json({ message: "Email is required" });
// 		}
// 		console.log(email);
// 		try {
// 			// Step 1: Find the highest session_id for the given email
// 			const maxSession = await Data.findOne({ email })
// 				.sort({ session_id: -1 }) // Sort by session_id in descending order
// 				.select("session_id") // Only select the session_id
// 				.exec();
// 		} catch (err) {
// 			console.log(err);
// 		}
// 		console.log(maxSession);
// 		if (!maxSession) {
// 			return res.status(404).json({ message: "No data found for the given email" });
// 		}

// 		const maxSessionId = maxSession.session_id;

// 		// Step 2: Find all documents with the highest session_id for the given email
// 		const data = await Data.find({ email, session_id: maxSessionId });

// 		if (data.length === 0) {
// 			return res.status(404).json({ message: "No data found for the highest session" });
// 		}

// 		// Send the filtered data as the response
// 		res.status(200).json({ success: true, messages: data });
// 	} catch (error) {
// 		// Handle errors
// 		console.error("Error retrieving data:", error);
// 		res.status(500).json({ message: "Error retrieving data", error: error.message });
// 	}
// };

// Function to get all data (optional, can be useful for debugging)
export const getAllData = async (req, res) => {
	try {
		// Find all documents
		const data = await Data.find();

		// Send the list of data as the response
		res.status(200).json({ message: "All data retrieved", data });
	} catch (error) {
		// Handle errors
		res.status(500).json({ message: "Error retrieving data", error: error.message });
	}
};

export const getSessionId = async (req, res) => {
	try {
		const { loggedInEmail } = req.body;

		// Validate request
		if (!loggedInEmail) {
			return res.status(400).json({ error: "Email is required" });
		}

		// Find the highest session_id for the given user email
		const userSession = await Data.findOne({ loggedInEmail  }).sort({ session_id: -1 }).exec();
		console.log(userSession);
		// If no session exists for the user, return session_id as 0
		const lastSessionId = userSession ? userSession.session_id : 0;

		// Respond with the last session_id
		return res.status(200).json({ session_id: lastSessionId });
	} catch (error) {
		console.error("Error fetching session ID:", error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
};
