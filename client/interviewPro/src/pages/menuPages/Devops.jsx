import ExpertiseSelector from "./ExpertiseSelector";

const DevOps = () => {
	const topics = {
		Beginner: ["Agile", "CI CD", "Version control", "automated testing","cloud computing","logging","Docker","Deployment","SaaS","Virtual Machines","scaling","DevOps culture","blue-green deployment","Microservices"],
		Intermediate: ["Kubernetes","Infrastructure as Code", "services mesh", "Serverless", "roll back","","optimization","IaaS","Chaos Engineering","Serverless","orchestration","cloud","security"],
		Expert: ["Redis", "CI/CD", "disaster recovery", "Network management", "Zero-downtime","cloud native","Microservices","multi-cloud","High scaling","self-healing","cost optimization","security standard"],
	  };

	return <ExpertiseSelector topics={topics} title="DevOps" redirectPath="/dashboard/questions" />;
};

export default DevOps;
