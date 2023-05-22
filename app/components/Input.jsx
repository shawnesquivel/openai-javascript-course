import React from "react";

const Input = ({
  label,
  inputValue,
  onChange,
  placeHolderText,
  inputWidth,
  labelWidth,
}) => {
  return (
    <div className="flex items-center mb-4">
      <label
        className={`mb-2 text-gray-700 font-semibold mr-2 w-${inputWidth}`}
      >
        {label}
      </label>
      <input
        type="text"
        value={inputValue}
        onChange={onChange}
        placeholder={placeHolderText || "Input"}
        className={`py-2 px-4 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded w-${labelWidth}`} // Adjust the width as per your preference
      />
    </div>
  );
};

export default Input;
