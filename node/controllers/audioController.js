import { produceToQueue } from "../utils/index.js";

export const AudioController = async (req, res) => {
	const audioChunk = req.file;
	const metadata = JSON.parse(req.body.metadata);

	if (!audioChunk) {
		return res.status(400).send("No audio data received");
	}

	try {
		// Prepare message with metadata and chunk data
		const message = {
			userId: metadata.userId,
			chunkNumber: metadata.chunkNumber,
			timestamp: metadata.timestamp,
			audioId: metadata.audioId,
			isLastChunk: metadata.isLastChunk || false, // Default to false if not provided
			audioData: audioChunk.buffer.toString("base64"), // Encode audio chunk as base64
		};

		// Convert message to JSON string
		const messageString = JSON.stringify(message);

		console.log(`\n-- Chunk received for Audio ID ${metadata.audioId}, Chunk Number: ${metadata.chunkNumber}, Size: ${audioChunk.size} bytes --\n`);
		console.log(`-- Metadata: ${JSON.stringify(metadata)} --\n`);

		// Send message to RabbitMQ
		await produceToQueue(messageString);
		res.status(200).send("Chunk received and sent to RabbitMQ");
	} catch (error) {
		console.error("Error sending audio chunk to RabbitMQ:", error);
		res.status(500).send("Error sending audio chunk to RabbitMQ");
	}
};
