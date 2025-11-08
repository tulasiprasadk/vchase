import React from "react";
import Lottie from "lottie-react";

interface LottieAnimationProps {
  animationPath: string;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
  width?: number;
  height?: number;
}

const LottieAnimation: React.FC<LottieAnimationProps> = ({
  animationPath,
  className = "",
  loop = true,
  autoplay = true,
  width,
  height,
}) => {
  const [animationData, setAnimationData] = React.useState(null);

  React.useEffect(() => {
    const loadAnimation = async () => {
      try {
        const response = await fetch(animationPath);
        const data = await response.json();
        setAnimationData(data);
      } catch (error) {
        console.error("Error loading Lottie animation:", error);
      }
    };

    loadAnimation();
  }, [animationPath]);

  if (!animationData) {
    return (
      <div
        className={`flex items-center justify-center bg-slate-100 rounded-lg ${className}`}
        style={{ width, height }}
      >
        <div className="animate-pulse text-slate-400">Loading animation...</div>
      </div>
    );
  }

  return (
    <div className={className} style={{ width, height }}>
      <Lottie
        animationData={animationData}
        loop={loop}
        autoPlay={autoplay}
        className="w-full h-full"
      />
    </div>
  );
};

export default LottieAnimation;
