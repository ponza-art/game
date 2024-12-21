/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";

const ScoreTable = ({ players }) => {
    if (!players || Object.keys(players).length === 0) {
      return (
        <div className="p-4 bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-yellow-400 mb-2 text-center sm:text-2xl">Score Table</h2>
          <p className="text-white text-center">No players available. Add players to see the scores.</p>
        </div>
      );
    }
  
    const sortedPlayers = Object.values(players).sort(
      (a, b) => (b.score || 0) - (a.score || 0)
    );
  
    return (
      <div className="p-4 bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-yellow-400 mb-4 text-center sm:text-2xl">
          Score Table
        </h2>
        <table className="table-auto w-full text-white border-collapse text-sm sm:text-base" aria-label="Score Table">
          <thead>
            <tr className="bg-gray-900">
              <th className="px-2 py-1 sm:px-4 sm:py-2 text-left font-semibold">Rank</th>
              <th className="px-2 py-1 sm:px-4 sm:py-2 text-left font-semibold">Player</th>
              <th className="px-2 py-1 sm:px-4 sm:py-2 text-left font-semibold">Score</th>
              <th className="px-2 py-1 sm:px-4 sm:py-2 text-left font-semibold">Position</th>
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.map((player, index) => (
              <tr
                key={player.id || `player-${index}`}
                className={`${
                  index % 2 === 0 ? "bg-gray-700" : "bg-gray-600"
                } hover:bg-gray-500 transition-colors`}
              >
                <td className="px-2 py-1 sm:px-4 sm:py-2">{index + 1}</td>
                <td className="px-2 py-1 sm:px-4 sm:py-2">{player.username || "Unknown"}</td>
                <td className="px-2 py-1 sm:px-4 sm:py-2">{player.score ?? 0}</td>
                <td className="px-2 py-1 sm:px-4 sm:py-2">{player.position || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
export default ScoreTable;
