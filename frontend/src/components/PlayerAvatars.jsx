/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { getPlayerAvatar } from "./avatarUtils";

const PlayerAvatars = ({ gameState, timer, turnPlayer }) => {
  const progress = Math.abs((timer / 30) * 100);

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Timer Display */}
      <div className="w-full bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">
          {gameState?.players[turnPlayer]?.username}'s Turn
          {gameState?.players[turnPlayer]?.isAI && ' 🤖'}
        </div>
        <div className="text-4xl font-bold text-pink-400 mt-2">
          {timer}s
        </div>
        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-3 mt-4">
          <div
            className="bg-gradient-to-r from-pink-500 to-purple-500 h-3 rounded-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Player Avatars Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
        {Object.entries(gameState?.players || {}).map(([playerId, player]) => {
          const isCurrentTurn = turnPlayer === playerId;
          
          return (
            <div key={playerId} 
              className={`relative p-4 rounded-xl backdrop-blur-sm border ${
                isCurrentTurn 
                  ? 'border-pink-500 bg-gray-800/70' 
                  : 'border-gray-700 bg-gray-800/30'
              }`}
            >
              <div className="flex flex-col items-center space-y-3">
                <div className="text-3xl">
                  {getPlayerAvatar(player.username)}
                  {player.isAI && <span className="ml-2">🤖</span>}
                </div>
                <div className="text-center">
                  <div className="font-medium text-white">
                    {player.username}
                  </div>
                  {isCurrentTurn && (
                    <div className="text-pink-400 text-sm font-medium mt-1">
                      Current Turn
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlayerAvatars;