/* eslint-disable no-unused-vars */
import React from 'react'

function PlayerDashboard( player, isCurrentPlayer ) {
    return (
        <div className={`p-4 bg-gray-800 text-white rounded-lg shadow-md ${isCurrentPlayer ? 'border-4 border-yellow-500' : ''}`}>
          <h3 className="text-lg font-bold">{player.name}</h3>
          <p>Position: {player.tokenPosition}</p>
          <p>Score: {player.score}</p>
          <div className="mt-4">
            <h4 className="text-sm font-bold">Cards:</h4>
            <div className="grid grid-cols-3 gap-2">
              {player.cards.length > 0 ? (
                player.cards.map((card, index) => (
                  <div key={index} className="bg-gray-700 rounded p-2 text-xs">
                    {card.type}
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-xs">No cards</p>
              )}
            </div>
          </div>
        </div>
      );
}

export default PlayerDashboard

