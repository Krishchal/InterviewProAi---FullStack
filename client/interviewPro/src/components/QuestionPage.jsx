import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./css/QuestionPage.css"; // Import the CSS file

const QuestionPage = () => {
	const VITE_FLASK_URL = import.meta.env.VITE_FLASK_URL;
	const VITE_NODE_ENDPOINT = import.meta.env.VITE_NODE_ENDPOINT;
	const location = useLocation();
	const navigate = useNavigate();

	const questions = location.state?.questions?.recommended_questions || [];
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isListening, setIsListening] = useState(false);
	const [femaleVoice, setFemaleVoice] = useState(null);

	const [isRecording, setIsRecording] = useState(false);
	const [sessionId, setSessionId] = useState(0); // State to manage session ID
	const mediaRecorderRef = useRef(null);
	const audioChunks = useRef([]);

	// Fetch session ID from local storage or server
	useEffect(() => {
		const loggedInEmail = localStorage.getItem("loggedInEmail");
		if (loggedInEmail) {
			// Simulate a call to fetch the last session ID for the user
			fetch(`${VITE_NODE_ENDPOINT}/messages/get-session-id`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ loggedInEmail }),
			})
				.then((response) => response.json())
				.then((data) => {
					// Increment the session ID for a new interview
					const lastSessionId = data.session_id || 0;
					setSessionId(lastSessionId + 1);
				})
				.catch((error) => {
					console.error("Error fetching session ID:", error);
				});
		}
	}, []);

	const setPreferredVoice = () => {
		const voices = window.speechSynthesis.getVoices();
		const preferredVoice = voices.find((voice) => voice.name.toLowerCase().includes("female")) || voices.find((voice) => voice.lang === "en-US");
		setFemaleVoice(preferredVoice);
	};

	useEffect(() => {
		if (window.speechSynthesis.onvoiceschanged !== undefined) {
			window.speechSynthesis.onvoiceschanged = setPreferredVoice;
		} else {
			setPreferredVoice();
		}
	}, []);

	const speakQuestion = (text) => {
		if (text.trim() !== "" && femaleVoice) {
			const utterance = new SpeechSynthesisUtterance(text);
			utterance.voice = femaleVoice;
			window.speechSynthesis.speak(utterance);
		}
	};

	useEffect(() => {
		if (questions.length > 0 && currentIndex === 0) {
			speakQuestion(questions[currentIndex]["question_text"]);
		}
	}, [questions, femaleVoice]);

	useEffect(() => {
		if (currentIndex > 0) {
			speakQuestion(questions[currentIndex]["question_text"]);
		}
	}, [currentIndex, questions]);

	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			mediaRecorderRef.current = new MediaRecorder(stream);

			mediaRecorderRef.current.ondataavailable = (event) => {
				audioChunks.current.push(event.data);
			};

			mediaRecorderRef.current.onstop = () => {
				const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
				audioChunks.current = [];
				sendAudioToServer(audioBlob);
			};

			mediaRecorderRef.current.start();
			setIsRecording(true);
			setIsListening(true);
		} catch (err) {
			console.error("Error accessing the microphone", err);
		}
	};

	const stopRecording = () => {
		if (mediaRecorderRef.current) {
			mediaRecorderRef.current.stop();
			setIsRecording(false);
			setIsListening(false);
		}
	};

	const sendAudioToServer = (audioBlob) => {
		const token = localStorage.getItem("token");
		const loggedInEmail = localStorage.getItem("loggedInEmail");

		const formData = new FormData();
		formData.append("file", audioBlob, "audio.wav");
		formData.append("question", questions[currentIndex]["question_text"]);
		formData.append("id", questions[currentIndex]["question_id"]);
		formData.append("token", token);
		formData.append("loggedInEmail", loggedInEmail);
		formData.append("session_id", sessionId); // Include session ID in the request

		fetch(`${VITE_FLASK_URL}/upload`, {
			method: "POST",
			body: formData,
		})
			.then((response) => response.json())
			.then((data) => {
				console.log("Audio sent successfully:", data);
			})
			.catch((error) => {
				console.error("Error sending audio:", error);
			});
	};

	const handleNext = () => {
		if (currentIndex < questions.length - 1) {
			setCurrentIndex(currentIndex + 1);
		} else {
			alert("No more questions!");
			navigate("/dashboard");
		}
	};

	return (
		<div className="question-page-container">
			<div className="main-box">
				<h1 className="question-page-title">Recommended Questions</h1>
				{questions.length > 0 ? <div className="question-text">{questions[currentIndex]["question_text"]}</div> : <p className="no-questions">No questions to display.</p>}

				<button className={`microphone-button ${isRecording ? "recording" : ""}`} onClick={isRecording ? stopRecording : startRecording}>
					{isRecording ? "Stop Recording" : "Start Recording"}
				</button>
				<div className="button-row">
					<button className="quit-button" onClick={() => navigate("/dashboard")}>
						Quit Interview
					</button>
					<button className="next-button" onClick={handleNext}>
						Next Question
					</button>
				</div>
			</div>
		</div>
	);
};

export default QuestionPage;
