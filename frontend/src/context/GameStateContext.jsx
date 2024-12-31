import React, { createContext, useState, useEffect, useCallback } from "react";
import socket from "../socket";

export const GameStateContext = createContext();

export const GameStateProvider = ({ children }) => {
  const [gameState, setGameState] = useState(null);
  const [playerHand, setPlayerHand] = useState([]);
  const [turnPlayer, setTurnPlayer] = useState(null);
  const [timer, setTimer] = useState(30);
  const [gameLog, setGameLog] = useState([]);
  const [intervalId, setIntervalId] = useState(null);

  const addGameLog = (message) => {
    setGameLog((prevLog) => [...prevLog, message]);
  };

  const startTimer = useCallback(() => {
    let countdown = 30;
    const id = setInterval(() => {
      if (countdown <= 0) {
        clearInterval(id);
        setTimer(30);
        if (turnPlayer === socket.id) {
          socket.emit("endTurn", { roomId: gameState?.roomId });
        }
      } else {
        setTimer(countdown);
        countdown--;
      }
    }, 1000);
    setIntervalId(id);
  }, [turnPlayer, gameState?.roomId]);

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
          const playerName = state?.players?.[state.gameState.currentTurn]?.username || "Another player";
          addGameLog(`${playerName}'s turn.`);
        }
      }
      if (state.lastAction) {
        addGameLog(state.lastAction);
      }
    };

    const handleGameOver = (data) => {
      clearInterval(intervalId);
      const message = `Game Over: ${data.message}`;
      addGameLog(message);
      alert(message);
    };

    const handlePlayCardEvent = (eventDetails) => {
      addGameLog(eventDetails);
    };

    const handlePlayerJoined = ({ username }) => {
      addGameLog(`${username} joined the game.`);
    };

    const handlePlayerLeft = ({ username }) => {
      addGameLog(`${username} left the game.`);
    };

    const handleRoundComplete = (data) => {
      addGameLog(`Round ${data.round} complete! ${data.winner} wins with ${data.score} points!`);
    };

    const handleGameComplete = (data) => {
      const message = `Game complete! ${data.winner} wins with ${data.score} points and ${data.roundWins} round wins!`;
      addGameLog(message);
    };

    socket.on("gameState", handleGameState);
    socket.on("gameOver", handleGameOver);
    socket.on("playCardEvent", handlePlayCardEvent);
    socket.on("playerJoined", handlePlayerJoined);
    socket.on("playerLeft", handlePlayerLeft);
    socket.on("roundComplete", handleRoundComplete);
    socket.on("gameComplete", handleGameComplete);

    return () => {
      socket.off("gameState", handleGameState);
      socket.off("gameOver", handleGameOver);
      socket.off("playCardEvent", handlePlayCardEvent);
      socket.off("playerJoined", handlePlayerJoined);
      socket.off("playerLeft", handlePlayerLeft);
      socket.off("roundComplete", handleRoundComplete);
      socket.off("gameComplete", handleGameComplete);
      clearInterval(intervalId);
    };
  }, [turnPlayer, intervalId, startTimer]);

  return (
    <GameStateContext.Provider
      value={{ gameState, playerHand, timer, turnPlayer, gameLog, addGameLog }}
    >
      {children}
    </GameStateContext.Provider>
  );
};
