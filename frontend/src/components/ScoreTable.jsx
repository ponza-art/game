/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";

const ScoreTable = ({ players }) => {
  if (!players || Object.keys(players).length === 0) {
    return (
      <div className="p-2 sm:p-4 bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-lg sm:text-xl font-bold text-yellow-400 mb-2 text-center">Score Table</h2>
        <p className="text-white text-center text-sm sm:text-base">No players available. Add players to see the scores.</p>
      </div>
    );
  }

  const sortedPlayers = Object.values(players).sort(
    (a, b) => (b.score || 0) - (a.score || 0)
  );

  return (
    <div className="p-2 sm:p-4 bg-gray-800 rounded-lg shadow-md overflow-x-auto">
      <h2 className="text-lg sm:text-xl font-bold text-yellow-400 mb-2 sm:mb-4 text-center">
        Score Table
      </h2>
      <div className="min-w-full inline-block align-middle">
        <table className="min-w-full divide-y divide-gray-700" aria-label="Score Table">
          <thead>
            <tr className="bg-gray-900">
              <th className="px-2 py-1 sm:px-4 sm:py-2 text-left text-xs sm:text-sm font-semibold text-yellow-400">
                Rank
              </th>
              <th className="px-2 py-1 sm:px-4 sm:py-2 text-left text-xs sm:text-sm font-semibold text-yellow-400">
                Player
              </th>
              <th className="px-2 py-1 sm:px-4 sm:py-2 text-left text-xs sm:text-sm font-semibold text-yellow-400">
                Score
              </th>
              <th className="px-2 py-1 sm:px-4 sm:py-2 text-left text-xs sm:text-sm font-semibold text-yellow-400">
                Position
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {sortedPlayers.map((player, index) => (
              <tr
                key={player.id || `player-${index}`}
                className={`${
                  index % 2 === 0 ? "bg-gray-700" : "bg-gray-600"
                } hover:bg-gray-500 transition-colors`}
              >
                <td className="px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm whitespace-nowrap text-white">
                  {index + 1}
                </td>
                <td className="px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm whitespace-nowrap text-white">
                  {player.username || "Unknown"}
                </td>
                <td className="px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm whitespace-nowrap text-white">
                  {player.score ?? 0}
                </td>
                <td className="px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm whitespace-nowrap text-white">
                  {player.position || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScoreTable;