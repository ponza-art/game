import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import socket from "../socket";

const GameBoard = ({ roomId }) => {
  const [gameState, setGameState] = useState(null);
  const [playerHand, setPlayerHand] = useState([]);
  const [timer, setTimer] = useState(30);
  const [turnPlayer, setTurnPlayer] = useState(null);

  useEffect(() => {
    socket.on("gameState", (state) => {
      setGameState(state);
      if (state.players[socket.id]) {
        setPlayerHand(state.players[socket.id].hand);
      }
    });

    socket.on("gameOver", (data) => alert(data.message));
    socket.on("turnStart", (playerId) => {
      setTurnPlayer(playerId);
      startTimer();
    });

    return () => {
      socket.off("gameState");
      socket.off("gameOver");
      socket.off("turnStart");
    };
  }, [roomId]);

  const startTimer = () => {
    let countdown = 30;
    const interval = setInterval(() => {
      if (countdown <= 0) {
        clearInterval(interval);
        setTimer(30);
        socket.emit("endTurn", { roomId });
      } else {
        setTimer(countdown);
        countdown--;
      }
    }, 1000);
  };

  const playCard = (card) => {
    socket.emit("playCard", { roomId, card });
    setPlayerHand((prevHand) => prevHand.filter((c) => c !== card));
  };

  const renderSquare = (index) => {
    const isBonus = index % 5 === 0;
    const isPenalty = index % 7 === 0;

    return (
      <motion.div
        key={index}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`relative w-full h-full rounded-md flex items-center justify-center border shadow-md
          ${isBonus ? "bg-cyber-green border-green-400" : isPenalty ? "bg-cyber-red border-red-400" : "bg-cyber-gray border-cyber-border"}`}
      >
        <span className="text-xs font-bold text-cyber-text">{index + 1}</span>
        {gameState &&
          Object.entries(gameState.players).map(([playerId, player]) =>
            player.position === index + 1 ? (
              <motion.div
                key={playerId}
                className="absolute w-8 h-8 bg-cyber-blue text-cyber-text rounded-full flex items-center justify-center text-xs shadow-lg"
                whileHover={{ scale: 1.2 }}
              >
                {player.username.substring(0, 2)}
              </motion.div>
            ) : null
          )}
      </motion.div>
    );
  };

  const renderAvatars = () => (
    <div className="flex flex-col space-y-4">
      {Object.entries(gameState?.players || {}).map(([playerId, player]) => (
        <motion.div
          key={playerId}
          whileHover={{ scale: 1.1 }}
          className="flex items-center space-x-4"
        >
          <div
            className={`relative w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg ${
              turnPlayer === playerId ? "ring-4 ring-cyber-yellow" : "bg-cyber-gray"
            }`}
          >
            <img
              src={player.avatar || "https://via.placeholder.com/150"}
              alt={player.username}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-cyber-text">{player.username}</span>
            {turnPlayer === playerId && (
              <span className="text-sm font-bold text-cyber-yellow">{timer}s</span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderScores = () => (
    <div className="flex flex-col">
      <h2 className="text-xl font-bold mb-4 text-center text-cyber-text">Scores</h2>
      <table className="min-w-full table-auto text-center">
        <thead>
          <tr>
            <th className="border px-4 py-2 text-cyber-text">Player</th>
            <th className="border px-4 py-2 text-cyber-text">Score</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(gameState?.players || {}).map(([playerId, player]) => (
            <tr key={playerId}>
              <td className="border px-4 py-2 text-cyber-text">{player.username}</td>
              <td className="border px-4 py-2 text-cyber-text">{player.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-5 gap-4 bg-cyber-dark text-cyber-text">
      {/* Left Side - Avatars */}
      <div className="lg:col-span-1">
        <h2 className="text-2xl font-bold mb-4 text-cyber-text">Players</h2>
        {renderAvatars()}
      </div>

      {/* Middle - Game Board */}
      <div className="lg:col-span-3">
        <h1 className="text-3xl font-bold mb-6 text-center text-cyber-text">Room: {roomId}</h1>
        <div className="grid grid-cols-5 gap-2 aspect-square">
          {Array.from({ length: 20 }).map((_, index) => renderSquare(index))}
        </div>
        <h2 className="text-xl font-bold mt-6 mb-4 text-center text-cyber-text">Your Cards</h2>
        <div className="flex space-x-4 justify-center">
          {playerHand.map((card, index) => (
            <motion.div
              key={index}
              onClick={() => playCard(card)}
              whileHover={{ scale: 1.1, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              className={`w-32 h-48 rounded-lg shadow-lg cursor-pointer p-4 flex flex-col justify-between ${
                card.type === "Bonus" ? "bg-cyber-green" : card.type === "Penalty" ? "bg-cyber-red" : "bg-cyber-gray"
              }`}
            >
              <div className="font-bold text-lg text-center text-cyber-text">{card.type}</div>
              <div className="text-3xl text-center font-semibold text-cyber-text">{card.value || card.effect}</div>
              <div className="text-sm text-right italic text-cyber-text">Play</div>
            </motion.div>
          ))}
          {playerHand.length === 0 && <div className="text-cyber-border">No cards left</div>}
        </div>
      </div>

      {/* Right Side - Scores */}
      <div className="lg:col-span-1">{renderScores()}</div>
    </div>
  );
};

export default GameBoard;
