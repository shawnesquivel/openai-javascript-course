import React from "react";

const Button = ({ color, handleSubmit, endpoint, buttonText }) => {
  const colorClasses = {
    red: "bg-red-500 hover:bg-red-600",
    blue: "bg-blue-500 hover:bg-blue-600",
    green: "bg-green-500 hover:bg-green-600",
    pink: "bg-pink-500 hover:bg-pink-600",
    // Add more colors as needed
  };

  const colorClass = colorClasses[color] || "bg-white hover:bg-white"; // Default to blue if color prop not recognized

  return (
    <button
      onClick={endpoint ? () => handleSubmit(`/${endpoint}`) : handleSubmit}
      className={`py-2 px-6 mb-4 rounded-full border border-gray-500 shadow hover:shadow-lg ${colorClass}`}
    >
      {buttonText}
    </button>
  );
};

export default Button;
