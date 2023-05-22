import React from "react";
import { sourceCodePro } from "../styles/fonts";

const PromptBox = ({
  prompt,
  handlePromptChange,
  handleSubmit,
  placeHolderText,
  buttonText,
  error,
  disableButton,
  labelText,
}) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };
  return (
    <>
      <div className="flex items-center mb-4">
        {labelText && (
          <label htmlFor="" className="mr-4">
            {labelText}
          </label>
        )}

        <input
          type="text"
          value={prompt}
          onChange={handlePromptChange}
          onKeyDown={handleKeyDown}
          placeholder={placeHolderText || "Enter your prompt"}
          className="w-full mr-4 py-2 px-4 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded shadow"
        />

        {!disableButton && (
          <button
            onClick={handleSubmit}
            className={`py-6 px-6 bg-white shadow text-gray-900 font-semibold rounded-full hover:shadow-xl transition-colors duration-200 uppercase ${sourceCodePro.className}`}
          >
            {buttonText || "Enter"}
          </button>
        )}
      </div>
      <p className={`text-red-500 ${error ? "block" : "hidden"}`}>{error}</p>
    </>
  );
};

export default PromptBox;
