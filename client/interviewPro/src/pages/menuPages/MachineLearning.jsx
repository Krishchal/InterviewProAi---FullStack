import ExpertiseSelector from "./ExpertiseSelector"; // Reusable component for expertise selection

const MachineLearning = () => {
	// Define topics for Machine Learning
	const topics = {
		Beginner: ["supervised learning", "overfitting", "regression", "decision tree","KNN","bagging","random forest","confusion matrix","K-means","libraries","outlier","neural network","ROC curve","activation-function"],
		Intermediate: ["learning rate","data normalization", "SVM", "CNN and RNN", "bias-varience","feature engineering","DBSCAN","deep learning","autoregressive model","learning curve","Neural network","hyperparameters","cross validation"],
		Expert: ["deep learning", "generative model", "reinforcement learning", "Bayesian network", "Transformer model","LSTM","Markov model","backpropagation","training challenges","optimization","VAEs"],
	  };

	return <ExpertiseSelector topics={topics} title="Machine Learning" redirectPath="/dashboard/questions" />;
};

export default MachineLearning;
