import ExpertiseSelector from "./ExpertiseSelector"; // Reusable expertise selection component

const SystemDesign = () => {
	// Define the topics for System Design
	const topics = {
		Beginner: ["load banancer", "vertical scaling", "caching", "role","database","API gateway","message queue","statelessness","microservices","ORM","bottleneck","stateless","asynchronous","service registry","stack"],
		Intermediate: ["URL shortening","recommendation", "low latency", "CAP theorem", "session management","API rate","social media","billing system","invoice system","subscription platform","distributed system","CDN"],
		Expert: ["web-scale", "fault tolerance", "real-time analytics", "multi-cloud", "deployment pipeline","IoT","industrial equipment","blockchain","event-driven","high frequency trading","high throughput"],
	  };

	return <ExpertiseSelector topics={topics} title="System Design" redirectPath="/dashboard/questions" />;
};

export default SystemDesign;
