import { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import ProgressBar from "@ramonak/react-progress-bar";
import { jsPDF } from "jspdf"; // Import jsPDF
import "./Reports.css";

const Report = () => {
	const [allMessages, setAllMessages] = useState([]);
	const [sessions, setSessions] = useState([]);
	const [selectedSessionIndex, setSelectedSessionIndex] = useState(0);
	const [accuracyLevels, setAccuracyLevels] = useState([]);
	const [averageAccuracy, setAverageAccuracy] = useState(0);

	useEffect(() => {
		fetchMessages();
	}, []);

	const fetchMessages = async () => {
    const VITE_NODE_ENDPOINT = import.meta.env.VITE_NODE_ENDPOINT;
		const email = localStorage.getItem("loggedInEmail");
		try {
			const response = await fetch(`${VITE_NODE_ENDPOINT}/messages/processed-messages?email=${email}`);
			const data = await response.json();
			if (data.success) {
				setAllMessages(data.messages);
				groupMessagesIntoSessions(data.messages);
				updateAccuracyLevels(data.messages);
				storeSession(data.messages); // Store session in localStorage
			} else {
				console.error("Failed to fetch messages");
			}
		} catch (err) {
			console.error("Error fetching messages:", err.message);
		}
	};

	const storeSession = (messages) => {
		const sessionData = {
			messages,
			timestamp: new Date().getTime(),
		};
		localStorage.setItem("sessionData", JSON.stringify(sessionData));
	};

	const loadSession = () => {
		const sessionData = JSON.parse(localStorage.getItem("sessionData"));
		if (sessionData) {
			const currentTime = new Date().getTime();
			if (currentTime - sessionData.timestamp <= 10 * 60 * 1000) {
				setAllMessages(sessionData.messages);
				groupMessagesIntoSessions(sessionData.messages);
				updateAccuracyLevels(sessionData.messages);
			} else {
				localStorage.removeItem("sessionData");
			}
		}
	};

	const groupMessagesIntoSessions = (messages) => {
		const grouped = [];
		for (let i = 0; i < messages.length; i += 5) {
			grouped.push(messages.slice(i, i + 5));
		}
		setSessions(grouped);
	};

	const updateAccuracyLevels = (messages) => {
		const accuracies = messages.map((msg) => parseFloat(msg.report["Accuracy"].toFixed(2)));
		setAccuracyLevels(accuracies);

		const average = (accuracies.reduce((sum, val) => sum + val, 0) / accuracies.length).toFixed(2);
		setAverageAccuracy(average);
	};

	const getBarColor = (value) => {
		if (value <= 20) return "red";
		if (value <= 40) return "orange";
		if (value <= 60) return "lightblue";
		if (value <= 80) return "#91ff0084";
		return "#00ff37";
	};

	const downloadPDF = () => {
		const pdf = new jsPDF();
		const sessionData = sessions[selectedSessionIndex];
		const pageWidth = pdf.internal.pageSize.getWidth(); // Get the page width
	
		if (sessionData) {
			let currentY = 20; // Starting Y position for text
			pdf.setFontSize(14);
			pdf.text(`Session ${selectedSessionIndex + 1} Report`, 10, 10);
	
			sessionData.forEach((message, index) => {
				pdf.setFontSize(12);
	
				// Wrap question text
				const question = `Q${index + 1}: ${message.question}`;
				const wrappedQuestion = pdf.splitTextToSize(question, pageWidth - 20);
				pdf.text(wrappedQuestion, 10, currentY);
				currentY += wrappedQuestion.length * 6; // Add vertical space for wrapped text
	
				// Wrap answer text
				const answer = `A${index + 1}: ${message.transcribed_text}`;
				const wrappedAnswer = pdf.splitTextToSize(answer, pageWidth - 20);
				pdf.text(wrappedAnswer, 10, currentY);
				currentY += wrappedAnswer.length * 6;
	
				// Add accuracy
				const accuracyText = `Accuracy: ${accuracyLevels[selectedSessionIndex * 5 + index]}%`;
				pdf.text(accuracyText, 10, currentY);
				currentY += 10; // Add space for the next question
	
				// Handle page breaks if the content exceeds the page height
				if (currentY > pdf.internal.pageSize.getHeight() - 20) {
					pdf.addPage(); // Add a new page
					currentY = 20; // Reset Y position for the new page
				}
			});
	
			// Add average accuracy at the end
			pdf.setFontSize(14);
			currentY += 10; // Add some extra space
			const averageAccuracyText = `Average Accuracy: ${averageAccuracy}%`;
			pdf.text(averageAccuracyText, 10, currentY);
	
			pdf.save(`Session_${selectedSessionIndex + 1}_Report.pdf`);
		}
	};
	

	return (
		<div className="reports-container">
			<h1 className="header">Processed Messages</h1>

			<div className="session-selector">
				<label htmlFor="session-select" className="label">
					Select Session:
				</label>
				<select
					id="session-select"
					onChange={(e) => setSelectedSessionIndex(Number(e.target.value))}
					className="dropdown"
					style={{
            position: "relative",
						marginTop: "0px",
						top: "-28px",
						left: "122px",
					}}>
					{sessions.map((_, index) => (
						<option key={index} value={index}>
							Session {index + 1}
						</option>
					))}
				</select>
			</div>

			<div className="main-section">
				<div className="progress-section">
					{accuracyLevels.slice(selectedSessionIndex * 5, selectedSessionIndex * 5 + 5).map((level, index) => (
						<div key={index} className="progress-container">
							<p>Result for Qn {index + 1}</p>
							<ProgressBar completed={level} bgColor={getBarColor(level)} labelColor="#000" customLabel={`${level}%`} />
						</div>
					))}
				</div>
				<div className="circular-progress-container">
					<CircularProgressbar
						value={averageAccuracy}
						text={`${averageAccuracy}%`}
						styles={buildStyles({
							textColor: getBarColor(averageAccuracy),
							pathColor: getBarColor(averageAccuracy),
							trailColor: "#d6d6d6",
						})}
					/>
				</div>
			</div>

			<div className="qa-section">
				<h2>Questions and Answers</h2>
				{sessions.length > 0 && sessions[selectedSessionIndex] ? (
					sessions[selectedSessionIndex].map((message, index) => (
						<div key={index} className="qa-item">
							<p>
								<strong>Question {index + 1}:</strong> {message.question}
							</p>
							<p>
								<strong>Answer:</strong> {message.transcribed_text}
							</p>
							<p>
								<strong>Matrix:</strong> {`[${message.report.tfidf_matrix.join(", ")}]`}
							</p>
						</div>
					))
				) : (
					<p className="no-data">No data available for this session</p>
				)}
			</div>

			<button className="download-button" onClick={downloadPDF}>
				Download PDF
			</button>
		</div>
	);
};

export default Report;
