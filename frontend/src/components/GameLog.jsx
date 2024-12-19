import React from "react";

const GameLog = ({ logs }) => (
  <div className="mt-4 p-2 bg-gray-800 rounded-lg">
    <h2 className="text-xl font-bold text-yellow-400 mb-2">Game Log</h2>
    <div className="text-sm text-white space-y-1 max-h-40 overflow-auto">
      {logs.map((log, index) => (
        <div key={index}>{log}</div>
      ))}
    </div>
  </div>
);

export default GameLog;
