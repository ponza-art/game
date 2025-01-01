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

  const addAI = () => {
    if (players.length >= 6) {
      toast.error("Room is full");
      return;
    }
    socket.emit("addAI", roomId);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4 text-center neon-glow">
          Waiting Room
        </h2>
        
        <div className="space-y-2 mb-6">
          <p className="text-yellow-400 text-center">Room ID: {roomId}</p>
          <p className="text-green-400 text-center">
            Players ({players.length}/6):
          </p>
          <div className="bg-gray-700 p-3 rounded">
            {players.map((player) => (
              <div key={player.id} className="text-white flex items-center space-x-2">
                <span>{player.isAI ? '🤖' : '👤'}</span>
                <span className={player.isAI ? 'text-blue-400' : 'text-white'}>
                  {player.username}
                </span>
                {player.isHost && <span className="text-yellow-400">(Host)</span>}
              </div>
            ))}
          </div>
        </div>

        {isHost && (
          <div className="space-y-2">
            <button
              onClick={startGame}
              className="w-full btn btn-primary hover:text-white hover:bg-transparent bg-transparent text-neonGreen"
            >
              Start Game
            </button>
            <button
              onClick={addAI}
              className="w-full btn btn-secondary hover:text-white hover:bg-transparent bg-transparent text-neonPink"
            >
              Add AI Player
            </button>
          </div>
        )}
        {!isHost && (
          <p className="text-gray-400 text-center">
            Waiting for host to start the game...
          </p>
        )}
      </div>
    </div>
  );
};

export default WaitingRoom; 