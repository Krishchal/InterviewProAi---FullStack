// Temporary in-memory storage for processed messages
let processedMessages = [];

// Consumer logic to store messages in the array
export function addMessageToProcessedList(message) {
  processedMessages.push(message);
}

// Controller to return processed messages
export function getProcessedMessages(req, res) {
  try {
    res.status(200).json({ success: true, messages: processedMessages });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error fetching messages" });
  }
}
