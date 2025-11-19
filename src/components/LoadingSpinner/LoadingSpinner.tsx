import { useEffect, useState } from "react";

interface LoadingSpinnerProps {
  size?: number;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 40,
  text = "",
}) => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const dotArray = ["", ".", "..", "..."];
    let index = 0;

    const interval = setInterval(() => {
      setDots(dotArray[index]);
      index = (index + 1) % dotArray.length;
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <div
        className="border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"
        style={{ width: size, height: size }}
      ></div>
      {text && (
        <div className="mt-3 text-lg font-semibold text-white text-center">
          {text}
          {dots}
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;