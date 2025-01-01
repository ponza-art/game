/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useCallback } from "react";
import socket from "../socket";
import { toast } from "react-hot-toast";

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

    const handleRoundEnd = (data) => {
      const winnerName = data.winnerName || "A player";
      addGameLog(`Round ended! ${winnerName} reached the end of the board!`);
      toast.success(`${winnerName} won the round!`);
    };

    const handlePlayerDisconnect = (playerId) => {
      addGameLog(`${gameState?.players[playerId]?.username || 'A player'} disconnected. AI will take over.`);
      toast.info("AI player has joined the game");
    };

    socket.on("gameState", handleGameState);
    socket.on("gameOver", handleGameOver);
    socket.on("playCardEvent", handlePlayCardEvent);
    socket.on("roundEnd", handleRoundEnd);
    socket.on("playerDisconnected", handlePlayerDisconnect);

    return () => {
      socket.off("gameState", handleGameState);
      socket.off("gameOver", handleGameOver);
      socket.off("playCardEvent", handlePlayCardEvent);
      socket.off("roundEnd", handleRoundEnd);
      socket.off("playerDisconnected", handlePlayerDisconnect);
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