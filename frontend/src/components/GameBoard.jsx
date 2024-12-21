/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useContext } from "react";
import { GameStateContext } from "../context/GameStateContext";
import PlayerAvatars from "./PlayerAvatars";
import GameLog from "./GameLog";
import D3Board from "./D3Board";
import ScoreTable from "./ScoreTable";
import socket from "../socket";

const GameBoard = ({ roomId }) => {
  const {
    gameState,
    playerHand,
    timer,
    turnPlayer,
    gameLog,
    addGameLog,
  } = useContext(GameStateContext);

  const [playedCardIndex, setPlayedCardIndex] = useState(null);

  const playCard = (card, cardIndex) => {
    if (!card || !card.type) {
      alert("Invalid card selected.");
      return;
    }

    if (turnPlayer !== socket.id) {
      alert("It's not your turn!");
      return;
    }

    setPlayedCardIndex(cardIndex);

    setTimeout(() => {
      setPlayedCardIndex(null);
    }, 500);

    socket.emit("playCard", { roomId, cardIndex });
  };

  return (
    <div className="p-4 grid grid-cols-1 lg:grid-cols-5 gap-6 text-white">
      {/* Player Avatars and Game Log */}
      <div className="lg:col-span-1 space-y-4">
        <PlayerAvatars gameState={gameState} timer={timer} turnPlayer={turnPlayer} />
        <GameLog logs={gameLog} />
      </div>

      {/* Board and Player Hand */}
      <div className="lg:col-span-3 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-center mb-4 neon-glow">
          Room: {roomId}
        </h1>
        <D3Board />
        <h2 className="text-2xl text-center mt-4 mb-2 neon-glow">Your Cards</h2>
        <div className="text-center text-lg font-bold mb-2">
          {turnPlayer === socket.id ? "It's your turn!" : "Waiting for others..."}
        </div>
        <div className="text-center text-xl font-semibold text-red-500">
          Timer: {timer}s
        </div>
        <div className="flex flex-wrap gap-3 justify-center mt-4">
          {playerHand.map((card, index) => (
            <motion.div
              key={card.id || `${card.type}-${index}`}
              className={`p-4 w-32 h-48 rounded-lg flex flex-col justify-between shadow-xl ${
                card.type === "Event"
                  ? "bg-gradient-to-br from-yellow-400 to-red-500 text-black"
                  : "bg-gradient-to-br from-purple-600 to-indigo-700 text-white"
              } ${index === playedCardIndex ? "opacity-50" : ""} ${
                turnPlayer !== socket.id ? "cursor-not-allowed opacity-50" : "cursor-pointer"
              }`}
              onClick={() => playCard(card, index)}
              initial={{ rotateY: 0 }}
              animate={{ rotateY: index === playedCardIndex ? 180 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="font-bold text-center text-sm mt-2">{card.type || "Unknown"}</div>
              <div className="text-center text-xs">{card.effect || card.value || "No Effect"}</div>
              {card.type === "Event" && (
                <div className="text-center mt-2 italic text-xs">
                  {"(Event Card)"}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Score Table */}
      <div className="lg:col-span-1">
        <ScoreTable players={gameState?.players} />
      </div>
    </div>
  );
};

export default GameBoard;
