/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import socket from "../socket";

const RoomManager = ({ setRoomId, setView }) => {
  const [roomInput, setRoomInput] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const createRoom = () => {
    if (!roomInput.trim() || !username.trim()) {
      setError("Both Room ID and Username are required to create a room.");
      return;
    }
    setError("");
    socket.emit("createRoom", roomInput.trim());
    socket.emit("joinRoom", { 
        roomId: roomInput.trim(), 
        username: username.trim() 
    });
    setRoomId(roomInput.trim());
    setView("game");
  };

  const joinRoom = () => {
    if (!roomInput.trim() || !username.trim()) {
      setError("Both Room ID and Username are required to join a room.");
      return;
    }
    setError("");
    socket.emit("joinRoom", { 
        roomId: roomInput.trim(), 
        username: username.trim() 
    });
    setRoomId(roomInput.trim());
    setView("game");
  };

  useEffect(() => {
    socket.on("actionError", ({ message }) => {
        setError(message);
    });

    return () => {
        socket.off("actionError");
    };
  }, []);

  return (
    <div className="p-6 flex flex-col items-center space-y-6 text-center bg-gray-900 text-white w-full sm:px-8 lg:max-w-4xl">
      <h1 className="text-4xl font-bold text-yellow-400 neon-glow mb-4 sm:text-5xl">
        Welcome to <span className="text-pink-500">Survival Path</span>
      </h1>
      <div className="w-full grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomInput}
          onChange={(e) => setRoomInput(e.target.value)}
          className="input input-bordered input-yellow-400 bg-gray-800 text-pink-500 w-full"
        />
        <input
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input input-bordered input-yellow-400 bg-gray-800 text-blue-400 w-full"
        />
      </div>
      {error && <div className="text-red-500">{error}</div>}
      <div className="space-y-4 mt-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row w-full">
        <button
          onClick={createRoom}
          className="btn btn-primary  hover:text-white hover:bg-transparent bg-transparent text-neonPink w-full sm:w-auto"
        >
          Create Room
        </button>
        <button
          onClick={joinRoom}
          className="btn btn-accent   hover:text-white hover:bg-transparent shadow-neonBlue hover:border-neonBlue bg-transparent text-neonBlue w-full sm:w-auto"
        >
          Join Room
        </button>
      </div>
      <div className="mt-8 w-full">
        <h2 className="text-2xl font-bold text-yellow-400 neon-glow mb-2">
          Game Rules
        </h2>
        <ul className="list-disc text-left ml-6 space-y-2 text-green-400 text-sm sm:text-base">
          <li>Players take turns playing cards to move forward or gain points.</li>
          <li>The first player to reach square 20 wins the game.</li>
          <li>Cards have effects: Move, Bonus, Penalty, Event, and Mind Play.</li>
          <li>Use strategy to move forward or hinder opponents.</li>
          <li>Play ends when a player reaches square 20 or the last card is drawn.</li>
        </ul>
      </div>
    </div>
  );
};

export default RoomManager;