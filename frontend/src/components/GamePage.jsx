/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import GameBoard from '../components/GameBoard';
import PlayerDashboard from '../components/PlayerDashboard';

function GamePage() {
  const [board] = useState(
    Array.from({ length: 20 }, (_, i) => ({
      position: i + 1,
      effect: i % 5 === 0 ? 'Bonus' : 'Neutral',
    }))
  );

  const [players, setPlayers] = useState([
    { name: 'Player 1', tokenPosition: 1, score: 0, cards: [] },
    { name: 'Player 2', tokenPosition: 1, score: 0, cards: [] },
  ]);

  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

  const movePlayer = (steps) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player, index) =>
        index === currentPlayerIndex
          ? {
              ...player,
              tokenPosition: Math.min(player.tokenPosition + steps, 20),
            }
          : player
      )
    );
    setCurrentPlayerIndex((prevIndex) => (prevIndex + 1) % players.length);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-900 text-white">
      <h1 className="text-3xl font-bold my-6">Survival Path</h1>
      <GameBoard board={board} players={players} />
      <div className="flex space-x-4 mt-6">
        {players.map((player, index) => (
          <PlayerDashboard
            key={index}
            player={player}
            isCurrentPlayer={currentPlayerIndex === index}
          />
        ))}
      </div>
      <button
        className="mt-6 bg-blue-500 px-4 py-2 rounded text-white"
        onClick={() => movePlayer(3)}
      >
        Move Player
      </button>
    </div>
  );
}

export default GamePage;