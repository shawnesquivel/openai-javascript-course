import React from "react";

const ChatHistory = ({ chatHistory }) => {
  return (
    chatHistory && (
      <div className="flex flex-col items-start space-y-4 mb-8">
        {chatHistory.map((message, index) => (
          <div key={index} className="w-full flex flex-col">
            <div className={`text-right`}>
              <div
                className={`bg-blue-500 text-white rounded-lg p-2 max-w-xs inline-block`}
                style={{ float: "right" }}
              >
                <p>{message.human}</p>
              </div>
            </div>
            <div className={`text-left`}>
              <div
                className={`bg-gray-200 text-black rounded-lg p-2 max-w-xs inline-block`}
              >
                <p>{message.chatbot}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  );
};

export default ChatHistory;
