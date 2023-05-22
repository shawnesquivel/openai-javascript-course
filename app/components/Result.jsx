import React from "react";

const Result = ({ data }) => {
  return (
    <div className="bg-gray-100 p-6 rounded shadow mb-4">
      {/* If data is a string */}
      {typeof data === "string" && (
        <p className="text-black-500 mb-4">{data}</p>
      )}
      {/* If data is an object */}
      {data && <p className="text-black-500 mb-4">{data?.output}</p>}

      {/* If data has source documents (e.g. when querying from a VectorDBQAChain and returnSourceDocuments is true) */}
      {data &&
        data.sourceDocuments &&
        data.sourceDocuments.map((doc, index) => (
          <div key={index} className="bg-grey-100 p-1 rounded shadow mb-2">
            <p>
              Source {index}: {doc.pageContent}
            </p>
            <p className="text-gray-700">From: {doc.metadata.source}</p>
          </div>
        ))}
    </div>
  );
};

export default Result;
