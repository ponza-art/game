import React from "react";

const ScoreTable = ({ players }) => {
  // Handle cases where there are no players
  if (!players || Object.keys(players).length === 0) {
    return (
      <div className="p-4 bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-yellow-400 mb-2">Score Table</h2>
        <p className="text-white text-center">No players available. Add players to see the scores.</p>
      </div>
    );
  }

  // Safely sort players by score (defaulting score to 0 if undefined)
  const sortedPlayers = Object.values(players).sort(
    (a, b) => (b.score || 0) - (a.score || 0)
  );

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-yellow-400 mb-4 text-center">
        Score Table
      </h2>
      <table
        className="table-auto w-full text-white border-collapse"
        aria-label="Score Table"
      >
        <thead>
          <tr className="bg-gray-900">
            <th className="px-4 py-2 text-left font-semibold">Rank</th>
            <th className="px-4 py-2 text-left font-semibold">Player</th>
            <th className="px-4 py-2 text-left font-semibold">Score</th>
            <th className="px-4 py-2 text-left font-semibold">Position</th>
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
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">{player.username || "Unknown"}</td>
              <td className="px-4 py-2">{player.score ?? 0}</td>
              <td className="px-4 py-2">{player.position || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScoreTable;
