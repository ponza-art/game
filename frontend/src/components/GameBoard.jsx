/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
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
  const [targetPlayerId, setTargetPlayerId] = useState("");

  const playCard = (card, cardIndex) => {
    if (!card || !card.type) {
      alert("Invalid card selected.");
      return;
    }

    if (turnPlayer !== socket.id) {
      alert("It's not your turn!");
      return;
    }

    if (card.type === "Mind Play" && !targetPlayerId) {
      alert("Please select a target player.");
      return;
    }

    setPlayedCardIndex(cardIndex);

    setTimeout(() => {
      setPlayedCardIndex(null);
    }, 500);

    socket.emit("playCard", { roomId, cardIndex, targetPlayerId });
    setTargetPlayerId(""); // Reset the target player selection
  };

  const handleTargetChange = (e) => {
    setTargetPlayerId(e.target.value);
  };

  useEffect(() => {
    // Add listener for timer expiration
    socket.on("timerExpired", () => {
      // Add to game log
      addGameLog("Turn timer expired - moving to next player");
      
      // Reset any selected card or target
      setPlayedCardIndex(null);
      setTargetPlayerId("");
    });

    return () => {
      socket.off("timerExpired");
    };
  }, [addGameLog]);

  if (!gameState?.gameState?.gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
        <h2 className="text-3xl font-bold mb-4 neon-glow">Waiting for players...</h2>
        <p className="text-xl">Need at least 2 players to start</p>
        <p className="mt-4">Current players: {Object.keys(gameState?.players || {}).length}</p>
      </div>
    );
  }

  return (
    <div className="p-6 grid grid-rows-[auto,1fr] gap-4 text-white">
      {/* Header */}
      <header className="text-center">
        <h1 className="text-4xl font-bold neon-glow">Room: {roomId}</h1>
        <div className="text-lg mt-2 font-semibold">
          <div>Round: {gameState.gameState.currentRound}/3</div>
          <div>Round Timer: {Math.floor(gameState.gameState.roundTimer / 60)}:{(gameState.gameState.roundTimer % 60).toString().padStart(2, '0')}</div>
          <div>Turn Timer: <span className="text-red-500">{timer}s</span></div>
        </div>
      </header>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Section */}
        <aside className="col-span-3 space-y-6">
          <PlayerAvatars gameState={gameState} timer={timer} turnPlayer={turnPlayer} />
          <GameLog logs={gameLog} />
        </aside>

        {/* Center Section */}
        <main className="col-span-6 flex flex-col items-center">
          <D3Board />
          <h2 className="text-2xl font-bold mt-6 neon-glow">Your Cards</h2>
          <div className="text-lg font-semibold mb-4">
            {turnPlayer === socket.id ? "It's your turn!" : "Waiting for others..."}
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            {playerHand.map((card, index) => (
              <motion.div
                key={card.id || `${card.type}-${index}`}
                className={`p-4 w-32 h-48 rounded-lg flex flex-col justify-between shadow-lg transform transition-transform ${
                  card.type === "Mind Play"
                    ? "bg-gradient-to-br from-green-400 to-blue-500 text-white"
                    : card.type === "Event"
                    ? "bg-gradient-to-br from-yellow-400 to-red-500 text-black"
                    : "bg-gradient-to-br from-purple-600 to-indigo-700 text-white"
                } ${index === playedCardIndex ? "scale-95" : ""} ${
                  turnPlayer !== socket.id ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                }`}
                onClick={() => playCard(card, index)}
                initial={{ rotateY: 0 }}
                animate={{ rotateY: index === playedCardIndex ? 180 : 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="font-bold text-center text-sm">{card.type || "Unknown"}</div>
                <div className="text-center text-xs flex-grow flex items-center justify-center">
                  {card.effect || card.value || "No Effect"}
                </div>
                {card.type === "Event" && (
                  <div className="text-center mt-2 italic text-xs">
                    {"(Event Card)"}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
          {playerHand.some((card) => card.type === "Mind Play") && (
            <div className="mt-4 flex items-center gap-4">
              <label htmlFor="target-player" className="text-lg font-semibold">
                Target Player:
              </label>
              <select
                id="target-player"
                value={targetPlayerId}
                onChange={handleTargetChange}
                className="bg-gray-700 text-white p-2 rounded-lg"
              >
                <option value="">Select a player</option>
                {Object.entries(gameState.players)
                  .filter(([id]) => id !== socket.id)
                  .map(([id, player]) => (
                    <option key={id} value={id}>
                      {player.username}
                    </option>
                  ))}
              </select>
            </div>
          )}
        </main>

        {/* Right Section */}
        <aside className="col-span-3">
          <ScoreTable players={gameState?.players} />
        </aside>
      </div>
    </div>
  );
};

export default GameBoard;
