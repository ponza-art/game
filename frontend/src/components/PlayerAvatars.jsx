/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { getPlayerAvatar } from "./avatarUtils"; // Import the utility function

const PlayerAvatars = ({ gameState, timer, turnPlayer }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    setProgress(Math.abs((timer / 30) * 100));
  }, [timer]);

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-center text-xl text-pink-400 font-bold">
        Time Left: {timer}s
      </div>

      <div className="flex flex-wrap gap-6 justify-center">
        {Object.entries(gameState?.players || {}).map(([playerId, player]) => {
          const isCurrentTurn = turnPlayer === playerId;
          const strokeDasharray = 251.2;
          const strokeDashoffset = strokeDasharray - (progress / 100) * strokeDasharray;

          return (
            <div key={playerId} className="relative flex flex-col items-center space-y-2">
              <div className="relative">
                <svg className="w-20 h-20">
                  <circle cx="50%" cy="50%" r="40%" fill="none" stroke="#ddd" strokeWidth="8" />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="40%"
                    fill="none"
                    stroke={isCurrentTurn ? "#ff4081" : "#aaa"}
                    strokeWidth="8"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    style={{ transition: "stroke-dashoffset 0.1s linear" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-2xl">
                  {getPlayerAvatar(player.username)}
                </div>
              </div>

              <div className="text-white text-center">
                <span className="font-semibold">{player.username}</span>
                {isCurrentTurn && <div className="text-pink-400 font-bold">Your Turn!</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlayerAvatars;
