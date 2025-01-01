/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useRef } from "react";

const GameLog = ({ logs }) => {
  const logContainerRef = useRef(null);

  useEffect(() => {
    // Auto-scroll to bottom when new logs are added
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="p-2 sm:p-4 bg-gray-800 rounded-lg">
      <h2 className="text-xl font-bold text-yellow-400 mb-2 text-center sm:text-2xl">Game Log</h2>
      <div 
        ref={logContainerRef}
        className="text-sm text-white space-y-1 max-h-40  custom-scrollbar sm:text-base"
      >
        {logs.map((log, index) => (
          <div 
            key={index} 
            className={`py-1 px-2 rounded ${
              log.includes("played") ? "text-green-400" :
              log.includes("swapped") ? "text-yellow-400" :
              log.includes("stole") ? "text-red-400" :
              log.includes("skipped") ? "text-purple-400" :
              log.includes("won") ? "text-pink-400" :
              "text-gray-300"
            }`}
          >
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameLog;