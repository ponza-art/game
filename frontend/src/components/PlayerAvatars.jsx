/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { getPlayerAvatar } from "./avatarUtils";

const PlayerAvatars = ({ gameState, timer, turnPlayer }) => {
  const progress = Math.abs((timer / 30) * 100);

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Timer Display for All Players */}
      <div className="w-full bg-gray-800 rounded-lg p-4 text-center">
        <div className="text-xl font-bold">
          {gameState?.players[turnPlayer]?.username}'s Turn
        </div>
        <div className="text-3xl text-pink-400 font-bold">
          {timer}s
        </div>
        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
          <div
            className="bg-pink-400 h-2 rounded-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Player Avatars */}
      <div className="flex flex-wrap gap-6 justify-center">
        {Object.entries(gameState?.players || {}).map(([playerId, player]) => {
          const isCurrentTurn = turnPlayer === playerId;
          const strokeDasharray = 251.2;
          const strokeDashoffset = strokeDasharray - (isCurrentTurn ? (progress / 100) * strokeDasharray : 0);

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
                    strokeDashoffset={isCurrentTurn ? strokeDashoffset : 0}
                    style={{ transition: "stroke-dashoffset 0.1s linear" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-2xl">
                  {getPlayerAvatar(player.username)}
                </div>
              </div>

              <div className="text-white text-center">
                <span className="font-semibold">{player.username}</span>
                {isCurrentTurn && <div className="text-pink-400 font-bold">Current Turn</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlayerAvatars;