import ExpertiseSelector from "./ExpertiseSelector";

const Backend = () => {
	const topics = {
		Beginner: ["server", "database", "API", "SQL and NoSQL", "RESTful", "ORM", "cookies", "token", "PHP", "Node js", "Django", "CDN", "connection pool", "load balancer", "microservices", "web sockets", "CORS"],
		Intermediate: ["JWT", "MVC", "reverse proxy", "relational database", "caching", "role-based", "optimization", " API endpoints", "GraphQL", "transaction", "pagination", "association", "architecture"],
		Expert: ["scalability", "microservices", "RabbitMQ", "cloud", "distributed transaction", "API versioning", "security", "downtime", "deployment", "Redis", "serverless function", "performance"],
	};

	return <ExpertiseSelector topics={topics} title="Backend" redirectPath="/dashboard/questions" />;
};

export default Backend;
