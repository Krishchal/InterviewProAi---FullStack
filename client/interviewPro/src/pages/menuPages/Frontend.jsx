import ExpertiseSelector from "./ExpertiseSelector";

const Frontend = () => {
	const topics = {
		Beginner: ["HTML", "CSS", "JavaScript", "responsive", "box model", "meta", "versions", "tags", "margin", "ordered list", "link", "embed", "pseudo-class", "display"],
		Intermediate: ["class", "variables", "grid", "DOM", "validation", "reusability", "optimization", "events", "asynchronous", "API", "viewport", "testing", "transitions"],
		Expert: ["React", "SSR", "context API", "state management", "JSX", "custom hooks", "error handeling", "methodology", "routing", "optimization", "Automatic Design"],
	};

	return <ExpertiseSelector topics={topics} title="Frontend" redirectPath="/dashboard/questions" />;
};

export default Frontend; 
