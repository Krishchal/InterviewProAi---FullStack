import ExpertiseSelector from "./ExpertiseSelector";

const GraphicDesign = () => {
	const topics = {
		Beginner: ["typography", "color theory", "CMYK and RGB", "2D and 3D","logo","symmetry","contrast","line spacing","focal point","storytelling","color-palette","file format","alignment","vector graphics"],
		Intermediate: ["platforms","mobile devices", "images", "motion graphics", "UI and UX","collaboration","branding","social media","multi-lingual","visual hierarchy","illustration","file organization","touch points","screen size"],
		Expert: ["virtual reality", "Cutting-edge trends", "AI workflows", "brand", "3D","adaptive design","empathy","gamification","marketing","copyright","workflow","methodology"],
	  };

	return <ExpertiseSelector topics={topics} title="Graphic Design" redirectPath="/dashboard/questions" />;
};

export default GraphicDesign;
