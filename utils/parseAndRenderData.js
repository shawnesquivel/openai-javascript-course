import React from "react";
const CodeBlock = ({ code }) => (
  <pre className="bg-red-100 text-gray-800 p-2 rounded-md overflow-x-auto">
    <code>{code}</code>
  </pre>
);

const parseAndRenderData = (data) => {
  const parts = data.split(/(```[\s\S]*?```)/g);
  const jsxParts = parts.map((part, index) => {
    if (part.startsWith("```") && part.endsWith("```")) {
      return <CodeBlock key={index} code={part.slice(3, -3)} />;
    } else {
      const lines = part.split("\n");
      return (
        <React.Fragment key={index}>
          {lines.map((line, lineIndex) => (
            <React.Fragment key={lineIndex}>
              {lineIndex > 0 && <br />}
              <span>{line}</span>
            </React.Fragment>
          ))}
        </React.Fragment>
      );
    }
  });

  return <>{jsxParts}</>;
};
export default parseAndRenderData;
