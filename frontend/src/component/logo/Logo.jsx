import React from "react";
import "./logo.css";

function Logo() {
  return (
    <div className="logo-container">
      <svg
        width="90"
        height="88"
        viewBox="0 0 186 184"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <g id="part1">
          <path
            d="M186 183.5L10 183.5C4.47715 183.5 0 179.023 0 173.5L0 0L75.1046 0C80.965 0 85.5693 5.01655 85.068 10.8554L77.5 99L186 183.5Z"
            fill="url(#paint0_linear_0_1)"
          />
        </g>
        <g id="part2">
          <path
            d="M0 0H166C177.046 0 186 8.95431 186 20V183.5H100L114.5 82L0 0Z"
            fill="url(#paint1_linear_0_1)"
          />
        </g>
        <defs>
          <linearGradient
            id="paint0_linear_0_1"
            x1="93"
            y1="183.5"
            x2="93"
            y2="0"
            gradientUnits="userSpaceOnUse">
            <stop stop-color="#0E5C94" stop-opacity="0.29" />
            <stop offset="1" stop-color="#164B71" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_0_1"
            x1="93"
            y1="0"
            x2="93"
            y2="183.5"
            gradientUnits="userSpaceOnUse">
            <stop stop-color="#88A1B4" stop-opacity="0.61" />
            <stop offset="1" stop-color="#0F8EEA" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export default Logo;
