import ExpertiseSelector from "./ExpertiseSelector";

const QA = () => {
	const topics = {
		Beginner: ["Testing", "Unit Testing", "Manual Testing", "Test Automation", "Bug Reporting"],
		Intermediate: ["Selenium", "Jest", "Mocha", "API Testing", "Regression Testing", "CI/CD", "Docker for Testing"],
		Expert: ["Test-Driven Development", "Performance Testing", "Load Testing", "Security Testing", "Test Automation Frameworks"],
	};

	return <ExpertiseSelector topics={topics} title="QA" redirectPath="/dashboard/questions" />;
};

export default QA;
