import React, { useState, useEffect } from "react";
import "./tasksSection.css"; // Adjust path to CSS

function LogoWithAnimation() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 3000); // Start the animation after 3 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <svg
      className={animate ? "animate" : ""}
      xmlns="http://www.w3.org/2000/svg"
      width="90"
      height="88"
      viewBox="0 0 90 88"
      fill="none">
      {/* ... Rest of your SVG content ... */}
    </svg>
  );
}

export default LogoWithAnimation;
