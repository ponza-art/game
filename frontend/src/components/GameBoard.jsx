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
import toast from 'react-hot-toast';
import WaitingRoom from "./WaitingRoom";

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
  const [moveDirection, setMoveDirection] = useState('forward');

  const playCard = (card, cardIndex) => {
    if (!card || !card.type) {
      toast.error("Invalid card selected");
      return;
    }

    const currentPosition = gameState?.players[socket.id]?.position;
    if (currentPosition >= 45) {
      toast.error("You've already reached the end!");
      return;
    }

    if (turnPlayer !== socket.id) {
      toast.error("It's not your turn!");
      return;
    }

    if ((card.type === "Mind Play" || (card.type === "Event" && card.effect === "Swap Places")) && !targetPlayerId) {
      toast.error("Please select a target player");
      return;
    }

    setPlayedCardIndex(cardIndex);

    setTimeout(() => {
      setPlayedCardIndex(null);
    }, 500);

    socket.emit("playCard", { 
      roomId, 
      cardIndex, 
      targetPlayerId,
      direction: card.type === "Move" ? moveDirection : undefined 
    });
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

  // Add direction selector for Move cards and target selector for Mind Play cards
  const renderCardControls = (card) => {
    if (card.type === "Move") {
      return (
        <select
          value={moveDirection}
          onChange={(e) => setMoveDirection(e.target.value)}
          className="mt-1 sm:mt-2 bg-gray-700 text-white p-1 text-xs rounded-lg w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <option value="forward">Forward</option>
          <option value="backward">Backward</option>
        </select>
      );
    } else if (card.type === "Mind Play" || (card.type === "Event" && card.effect === "Swap Places")) {
      return (
        <select
          value={targetPlayerId}
          onChange={handleTargetChange}
          className="mt-1 sm:mt-2 bg-gray-700 text-white p-1 text-xs rounded-lg w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <option value="">Select Target</option>
          {Object.entries(gameState.players)
            .filter(([id]) => id !== socket.id)
            .map(([id, player]) => (
              <option key={id} value={id}>
                {player.username || id}
              </option>
            ))}
        </select>
      );
    }
    return null;
  };

  if (!gameState?.gameState?.gameStarted) {
    return (
      <WaitingRoom 
        roomId={roomId} 
        players={Object.entries(gameState?.players || {}).map(([id, player]) => ({
          id,
          username: player.username,
          isHost: player.isHost,
          isAI: player.isAI
        }))}
        isHost={gameState?.players?.[socket.id]?.isHost}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-2 sm:p-4 md:p-6">
      {/* Header - Made more compact on mobile */}
      <header className="text-center mb-4">
        <h1 className="text-xl sm:text-2xl md:text-4xl font-bold neon-glow">Room: {roomId}</h1>
        <div className="text-xs sm:text-sm md:text-base mt-2 font-semibold flex justify-center space-x-4">
          <div>Round: {gameState.gameState.currentRound}/3</div>
          <div>Round Timer: {Math.floor(gameState.gameState.roundTimer / 60)}:{(gameState.gameState.roundTimer % 60).toString().padStart(2, '0')}</div>
          <div>Turn Timer: <span className="text-red-500">{timer}s</span></div>
        </div>
      </header>

      {/* Main Content - Reordered for mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
        {/* Game Board - Full width on mobile */}
        <main className="order-1 md:order-2 lg:col-span-6 flex flex-col items-center">
          <div className="w-full max-w-2xl mx-auto">
            <D3Board />
          </div>
        </main>

        {/* Left Section - Reordered for mobile */}
        <aside className="order-2 md:order-1 lg:col-span-3 space-y-4">
          <div className="bg-gray-800 p-3 rounded-lg">
            <PlayerAvatars gameState={gameState} timer={timer} turnPlayer={turnPlayer} />
            {gameState?.players && gameState.players[socket.id] && (
              <div className="text-center mt-2 text-sm">
                Your Moves: {gameState.players[socket.id].moves}
              </div>
            )}
          </div>
          <div className="bg-gray-800 p-3 rounded-lg max-h-48 overflow-y-auto">
            <GameLog logs={gameLog} />
          </div>
        </aside>

        {/* Right Section - Score Table */}
        <aside className="order-3 lg:col-span-3">
          <div className="bg-gray-800 p-3 rounded-lg">
            <ScoreTable players={gameState?.players} />
          </div>
        </aside>

        {/* Cards Section - Full width at bottom */}
        <div className="order-4 lg:col-span-12">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 text-center neon-glow">Your Cards</h2>
          <div className="text-sm sm:text-base md:text-lg font-semibold mb-2 text-center">
            {turnPlayer === socket.id ? "It's your turn!" : "Waiting for others..."}
          </div>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4">
            {playerHand.map((card, index) => (
              <motion.div
                key={card.id || `${card.type}-${index}`}
                className={`
                  p-2 sm:p-3 md:p-4 
                  w-20 sm:w-24 md:w-32 
                  h-32 sm:h-36 md:h-48 
                  rounded-lg flex flex-col justify-between 
                  shadow-lg transform transition-transform
                  ${card.type === "Mind Play"
                    ? "bg-gradient-to-br from-green-400 to-blue-500 text-white"
                    : card.type === "Event"
                    ? "bg-gradient-to-br from-yellow-400 to-red-500 text-black"
                    : "bg-gradient-to-br from-purple-600 to-indigo-700 text-white"
                  } 
                  ${index === playedCardIndex ? "scale-95" : ""} 
                  ${turnPlayer !== socket.id ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
                `}
                onClick={() => playCard(card, index)}
                initial={{ rotateY: 0 }}
                animate={{ rotateY: index === playedCardIndex ? 180 : 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="font-bold text-center text-xs sm:text-sm">{card.type || "Unknown"}</div>
                <div className="text-center text-xs sm:text-sm flex-grow flex items-center justify-center px-1">
                  {card.effect || card.value || "No Effect"}
                </div>
                {renderCardControls(card)}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;