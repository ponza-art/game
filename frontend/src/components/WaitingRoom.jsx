import React from 'react';
import { toast } from 'react-hot-toast';
import socket from "../socket";

const WaitingRoom = ({ roomId, players, isHost }) => {
  const startGame = () => {
    if (players.length < 2) {
      toast.error("Need at least 2 players to start");
      return;
    }
    socket.emit("startGame", roomId);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">
          Waiting Room
        </h2>
        
        <div className="space-y-2 mb-6">
          <p className="text-gray-300 text-center">Room ID: {roomId}</p>
          <p className="text-gray-300 text-center">
            Players ({players.length}/4):
          </p>
          <div className="bg-gray-700 p-3 rounded">
            {players.map((player) => (
              <div key={player.id} className="text-white flex items-center space-x-2">
                <span>👤</span>
                <span>{player.username}</span>
                {player.isHost && <span className="text-yellow-400">(Host)</span>}
              </div>
            ))}
          </div>
        </div>

        {isHost && (
          <button
            onClick={startGame}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Start Game
          </button>
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