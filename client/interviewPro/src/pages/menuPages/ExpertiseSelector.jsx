// ExpertiseSelector.js
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CSS/menuPage.css";

const ExpertiseSelector = ({ topics, title, redirectPath }) => {
	const VITE_FLASK_URL = import.meta.env.VITE_FLASK_URL;
	const [selectedExpertise, setSelectedExpertise] = useState([]);
	const [level, setLevel] = useState("Beginner");
	const [isButtonDisabled, setButtonDisabled] = useState(true);
	const navigate = useNavigate();

	const handleButtonClick = (topic) => {
		setSelectedExpertise((prev) => (prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]));
	};

	const handleSubmit = async () => {
		if (selectedExpertise.length === 0) {
			alert("You must select at least one topic.");
			return;
		}

		const payload = {
			expertise: selectedExpertise,
			level,
		};

		try {
			const response = await axios.post(`${VITE_FLASK_URL}/recommend-questions`, payload);
			if (response.status === 200) {
				navigate(redirectPath, { state: { questions: response.data } });
				console.log(response.data); // test
			}
		} catch (error) {
			console.error("Error fetching recommendations:", error);
			alert("Failed to fetch recommendations. Please try again.");
		}
	};

	useEffect(() => {
		const isButtonDisabled = selectedExpertise.length === 0;
		setButtonDisabled(isButtonDisabled);
	}, [selectedExpertise]);

	const totalTopics = topics[level].length;
	const selectedCount = selectedExpertise.length;
	const progressPercentage = Math.round((selectedCount / totalTopics) * 100);

	return (
		<div className="frontend-container">
			<h1 className="header-text">{title}</h1>
			<p className="subheader-text">Select the topic you are best at</p>

			<div className="dropdown-container">
				<label htmlFor="level-dropdown">Select your level:</label>
				<select id="level-dropdown" value={level} onChange={(e) => setLevel(e.target.value)}>
					<option value="Beginner">Beginner</option>
					<option value="Intermediate">Intermediate</option>
					<option value="Expert">Expert</option>
				</select>
			</div>

			<div className="topics-container">
				{topics[level].map((topic, index) => (
					<button key={index} className={`topic-button ${selectedExpertise.includes(topic) ? "selected" : ""}`} onClick={() => handleButtonClick(topic)}>
						{topic}
					</button>
				))}
			</div>

			<div className="next-button-container">
				<button className={`next-btn ${isButtonDisabled ? "disabled" : ""}`} onClick={handleSubmit} disabled={isButtonDisabled}>
					Next
				</button>
			</div>

			<div className="progress-bar-container">
				<div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
			</div>
		</div>
	);
};

export default ExpertiseSelector;
