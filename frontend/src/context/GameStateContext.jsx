import React, { createContext, useState, useEffect, useCallback } from "react";
import socket from "../socket";

export const GameStateContext = createContext();

export const GameStateProvider = ({ children }) => {
  const [gameState, setGameState] = useState(null);
  const [playerHand, setPlayerHand] = useState([]);
  const [turnPlayer, setTurnPlayer] = useState(null);
  const [timer, setTimer] = useState(30);
  const [gameLog, setGameLog] = useState([]);

  const addGameLog = (message) => {
    setGameLog((prevLog) => [...prevLog, message]);
  };

  useEffect(() => {
    const handleGameState = (state) => {
      setGameState(state);
      
      if (state?.players?.[socket.id]?.hand) {
        setPlayerHand(state.players[socket.id].hand || []);
      }

      if (state.timer !== undefined) {
        setTimer(state.timer);
      }

      if (state?.gameState?.currentTurn !== turnPlayer) {
        setTurnPlayer(state.gameState.currentTurn);
        
        if (state.gameState.currentTurn === socket.id) {
          addGameLog("It's your turn!");
        } else {
          const playerName =
            state?.players?.[state.gameState.currentTurn]?.username || "Another player";
          addGameLog(`${playerName}'s turn.`);
        }
      }
    };

    const handleGameOver = (data) => {
      addGameLog(`Game Over: ${data.message}`);
      alert(data.message);
    };

    const handlePlayCardEvent = (eventDetails) => {
      addGameLog(eventDetails);
    };

    socket.on("gameState", handleGameState);
    socket.on("gameOver", handleGameOver);
    socket.on("playCardEvent", handlePlayCardEvent);

    return () => {
      socket.off("gameState", handleGameState);
      socket.off("gameOver", handleGameOver);
      socket.off("playCardEvent", handlePlayCardEvent);
    };
  }, [turnPlayer]);

  return (
    <GameStateContext.Provider
      value={{ gameState, playerHand, timer, turnPlayer, gameLog, addGameLog }}
    >
      {children}
    </GameStateContext.Provider>
  );
};