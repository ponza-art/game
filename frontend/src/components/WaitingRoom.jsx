/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import { toast } from 'react-hot-toast';
import socket from "../socket";

const WaitingRoom = ({ roomId, players, isHost }) => {
  const startGame = () => {
    if (players.length < 2) {
      toast.error("Need at least 2 players to start");
      return;
    }
    if (players.length > 6) {
      toast.error("Maximum 6 players allowed");
      return;
    }
    socket.emit("startGame", roomId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
      <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl shadow-2xl max-w-md w-full border border-gray-700">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500 mb-6 text-center">
          Waiting Room
        </h2>
        
        <div className="space-y-4 mb-8">
          <p className="text-yellow-400 text-center font-medium">Room ID: {roomId}</p>
          <p className="text-green-400 text-center font-medium">
            Players ({players.length}/6)
          </p>
          <div className="bg-gray-900/50 p-4 rounded-lg backdrop-blur-sm">
            {players.map((player) => (
              <div key={player.id} className="flex items-center space-x-3 py-2 px-3 rounded-md hover:bg-gray-800/30 transition-colors">
                <span>{player.isAI ? '🤖' : '👤'}</span>
                <span className={`flex-1 ${player.isAI ? 'text-blue-400' : 'text-white'}`}>
                  {player.username}
                </span>
                {player.isHost && (
                  <span className="text-yellow-400 text-sm font-medium px-2 py-1 rounded-full bg-yellow-400/10">
                    Host
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {isHost ? (
          <button
            onClick={startGame}
            className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium hover:from-green-600 hover:to-emerald-700 transition-colors transform hover:scale-105 duration-200"
          >
            Start Game
          </button>
        ) : (
          <p className="text-gray-400 text-center text-sm">
            Waiting for host to start the game...
          </p>
        )}
      </div>
    </div>
  );
};

export default WaitingRoom; 