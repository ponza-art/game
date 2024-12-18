import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import socket from "../socket";

const GameBoard = ({ roomId }) => {
  const [gameState, setGameState] = useState(null);
  const [playerHand, setPlayerHand] = useState([]);
  const [timer, setTimer] = useState(30);
  const [turnPlayer, setTurnPlayer] = useState(null);

  useEffect(() => {
    // Update game state
    socket.on("gameState", (state) => {
      setGameState(state);
      if (state.players[socket.id]) {
        setPlayerHand(state.players[socket.id].hand);
      }
    });

    // Highlight turn start
    socket.on("turnStart", (playerId) => {
      setTurnPlayer(playerId);
      startTimer();
    });

    socket.on("gameOver", (data) => alert(data.message));

    return () => {
      socket.off("gameState");
      socket.off("turnStart");
      socket.off("gameOver");
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

  const playCard = (card, targetId) => {
    socket.emit("playCard", { roomId, card, targetId });
    setPlayerHand((prevHand) => prevHand.filter((c) => c !== card));
  };

  const renderSquare = (index) => {
    const isBonus = index % 5 === 0;
    const isPenalty = index % 7 === 0;

    return (
      <motion.div
        key={index}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`relative flex items-center justify-center rounded-lg border shadow-lg p-2 ${
          isBonus
            ? " border-green-500 neon-glow"
            : isPenalty
            ? " border-red-500 neon-glow"
            : " border-gray-600"
        }`}
      >
        <span className="text-white font-bold text-sm">{index + 1}</span>
        {/* Player Tokens */}
        {gameState &&
          Object.entries(gameState.players).map(([playerId, player]) =>
            player.position === index + 1 ? (
              <motion.div
                key={playerId}
                className="absolute w-8 h-8 rounded-full bg-yellow-400 text-center flex items-center justify-center text-xs font-bold text-black shadow-md"
                whileHover={{ scale: 1.1 }}
              >
                {player.username.charAt(0).toUpperCase()}
              </motion.div>
            ) : null
          )}
      </motion.div>
    );
  };

  const renderAvatars = () => (
    <div className="flex flex-col space-y-4">
      {Object.entries(gameState?.players || {}).map(([playerId, player]) => (
        <div key={playerId} className="flex items-center space-x-4">
          <div
            className={`relative w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg ${
              turnPlayer === playerId ? "ring-4 ring-pink-400" : "bg-gray-600"
            }`}
          >
            <img
              src={
                player.avatar ||
                "https://via.placeholder.com/150/1f1f1f/FFFFFF?text=Avatar"
              }
              alt={player.username}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div className="flex flex-col text-white">
            <span className="font-semibold text-lg">{player.username}</span>
            {turnPlayer === playerId && (
              <span className="text-pink-400 font-bold">{timer}s</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderScores = () => (
    <div className="mt-4">
      <h2 className="text-xl font-bold text-center text-white">Scores</h2>
      <table className="w-full mt-2 table-auto text-center text-white border-separate border-spacing-2">
        <thead>
          <tr>
            <th className="border px-4 py-2 bg-gray-800">Player</th>
            <th className="border px-4 py-2 bg-gray-800">Score</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(gameState?.players || {}).map(([playerId, player]) => (
            <tr key={playerId}>
              <td className="border px-4 py-2 bg-gray-700">{player.username}</td>
              <td className="border px-4 py-2 bg-gray-700">{player.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-4 grid grid-cols-1 lg:grid-cols-5 gap-6   text-white">
      {/* Left Panel - Avatars */}
      <div className="lg:col-span-1">{renderAvatars()}</div>

      {/* Center - Board */}
      <div className="lg:col-span-3  ">
        <h1 className="text-3xl font-bold text-center mb-4 neon-glow">
          Room: {roomId}
        </h1>
        <div className="grid grid-cols-5 gap-2 aspect-square w-96 mx-auto">
          {Array.from({ length: 20 }).map((_, index) => renderSquare(index))}
        </div>

        {/* Cards */}
        <h2 className="text-2xl text-center  mt-4 mb-2 neon-glow" >Your Cards</h2>
        <div className="  w-full ">
        <div className=" flex flex-wrap gap-3 justify-center">
          {playerHand.map((card, index) => (
            <motion.div
              key={index}
              className={`p-4 w-32 h-48 rounded-lg  flex flex-col  justify-between shadow-xl ${
                card.type === "Bonus"
                  ? "bg-zinc-800 text-neonGreen"
                  : card.type === "Penalty"
                  ? "bg-zinc-800 text-neonPink"
                  : "bg-zinc-800 text-neonBlue"
              } neon-glow`}
              whileHover={{ scale: 1.05 }}
              onClick={() => playCard(card)}
            >
              <div className="font-bold text-center text-xl">{card.type}</div>
              <div className="text-xl text-center">{card.value || card.effect}</div>
              <div className="text-sm text-right italic opacity-70">Play</div>
            </motion.div>
          ))}
          {playerHand.length === 0 && <div>No cards available</div>}
        </div>
        </div>
      </div>

      {/* Right Panel - Scores */}
      <div className="lg:col-span-1">{renderScores()}</div>
    </div>
  );
};

export default GameBoard;
