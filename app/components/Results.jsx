import React from "react";

/**
 * For an array of objects,
 * [ {}, {}, {}]
 *
 * We can return a line for each result
 *
 */
const Results = ({ data }) => {
  return (
    <div className="bg-gray-100 p-6 rounded shadow mb-4">
      {data?.map((dataObj, index) => (
        <p key={index} className="text-black-500 mb-8">
          {dataObj.summary}
        </p>
      ))}
    </div>
  );
};

export default Results;
