import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import socket from "../socket";
import PlayerAvatars from "./PlayerAvatars";
import GameLog from "./GameLog";
import D3Board from "./D3Board";
import ScoreTable from "./ScoreTable";

const GameBoard = ({ roomId }) => {
  const [gameState, setGameState] = useState(null);
  const [playerHand, setPlayerHand] = useState([]);
  const [gameLog, setGameLog] = useState([]);
  const [timer, setTimer] = useState(30);
  const [turnPlayer, setTurnPlayer] = useState(null);
  const [playedCardIndex, setPlayedCardIndex] = useState(null);
  const [intervalId, setIntervalId] = useState(null);

  const startTimer = useCallback(() => {
    let countdown = 30;
    const id = setInterval(() => {
      if (countdown <= 0) {
        clearInterval(id);
        setTimer(30);
        if (turnPlayer === socket.id) {
          socket.emit("endTurn", { roomId });
        }
      } else {
        setTimer(countdown);
        countdown--;
      }
    }, 1000);

    setIntervalId(id);
  }, [turnPlayer, roomId]);

  const addGameLog = (message) => {
    setGameLog((prevLog) => [...prevLog, message]);
  };

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
      setPlayerHand((prevHand) => prevHand.filter((_, index) => index !== cardIndex));
      setPlayedCardIndex(null);
    }, 500);

    socket.emit("playCard", { roomId, cardIndex });
  };

  useEffect(() => {
    const handleGameState = (state) => {
      setGameState(state);
      if (state?.players?.[socket.id]?.hand) {
        setPlayerHand(state.players[socket.id].hand || []);
      }

      if (state?.gameState?.currentTurn !== turnPlayer) {
        setTurnPlayer(state.gameState.currentTurn);
        clearInterval(intervalId);
        setTimer(30);

        if (state.gameState.currentTurn === socket.id) {
          startTimer();
          addGameLog("It's your turn!");
        } else {
          const playerName =
            state?.players?.[state.gameState.currentTurn]?.username || "Another player";
          addGameLog(`${playerName}'s turn.`);
        }
      }
    };

    const handleGameOver = (data) => {
      clearInterval(intervalId);
      addGameLog(`Game Over: ${data.message}`);
      alert(data.message);
    };

    const handleCardPlayed = ({ playerId, card }) => {
      const playerName = gameState?.players[playerId]?.username || "Player";
      addGameLog(
        `${playerName} played ${card?.type || "Unknown"} (${card?.effect || card?.value || "No Effect"}).`
      );
    };

    socket.on("gameState", handleGameState);
    socket.on("gameOver", handleGameOver);
    socket.on("cardPlayed", handleCardPlayed);

    return () => {
      socket.off("gameState", handleGameState);
      socket.off("gameOver", handleGameOver);
      socket.off("cardPlayed", handleCardPlayed);
      clearInterval(intervalId);
    };
  }, [gameState?.players, turnPlayer, intervalId, startTimer]);

  return (
    <div className="p-4 grid grid-cols-1 lg:grid-cols-5 gap-6  text-white">
      <div className="lg:col-span-1 ">
        <PlayerAvatars gameState={gameState} timer={timer} turnPlayer={turnPlayer} />
        <GameLog logs={gameLog} />
      </div>

      <div className="lg:col-span-3 mx-auto">
        <h1 className="text-3xl font-bold text-center mb-4 neon-glow">
          Room: {roomId}
        </h1>
        <D3Board gameState={gameState} />
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
              className={`p-4 w-40 h-60 rounded-lg flex flex-col justify-between shadow-xl bg-gradient-to-br from-purple-600 to-indigo-700 neon-glow ${
                index === playedCardIndex ? "opacity-50" : ""
              } ${
                turnPlayer !== socket.id ? "cursor-not-allowed opacity-50" : "cursor-pointer"
              }`}
              onClick={() => playCard(card, index)}
              initial={{ rotateY: 0 }}
              animate={{ rotateY: index === playedCardIndex ? 180 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="font-bold text-center text-xl mt-2">{card.type || "Unknown"}</div>
              <motion.svg
                className="w-full h-32"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
              >
                <motion.path
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  d="M10 10 H 90 V 90 H 10 Z"
                  animate={{
                    d: index === playedCardIndex ? "M20 20 H 80 V 80 H 20 Z" : "M10 10 H 90 V 90 H 10 Z",
                  }}
                  transition={{ duration: 0.5 }}
                />
              </motion.svg>
              <div className="text-xl text-center mb-2">{card.value || card.effect || "No Effect"}</div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-1">
        <ScoreTable players={gameState?.players} />
      </div>
    </div>
  );
};

export default GameBoard;
