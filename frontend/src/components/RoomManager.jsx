// RoomManager.jsx
import React, { useState } from "react";
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
    setError(""); // Clear any previous error
    socket.emit("createRoom", roomInput.trim());
    joinRoom(); // Immediately join the created room
  };

  const joinRoom = () => {
    if (!roomInput.trim() || !username.trim()) {
      setError("Both Room ID and Username are required to join a room.");
      return;
    }
    setError(""); // Clear any previous error
    socket.emit("joinRoom", { roomId: roomInput.trim(), username: username.trim() });
    setRoomId(roomInput.trim());
    setView("game");
  };

  return (
    <div className="p-6 flex flex-col items-center space-y-6 text-center bg-gray-900 text-white">
      <h1 className="text-4xl font-bold text-yellow-400 neon-glow mb-4">
        Welcome to <span className="text-pink-500">Survival Path</span>
      </h1>
      <div className="w-full space-y-4">
        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomInput}
          onChange={(e) => setRoomInput(e.target.value)}
          className="input input-bordered input-yellow-400 w-full max-w-sm bg-gray-800 text-pink-500"
        />
        <input
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input input-bordered input-yellow-400 w-full max-w-sm bg-gray-800 text-blue-400"
        />
      </div>
      {error && <div className="text-red-500">{error}</div>}
      <div className="space-x-4 mt-4">
        <button onClick={createRoom} className="btn btn-primary btn-wide  shadow-neon shadow-neonPink hover:text-white hover:shadow-neonGreen  hover:bg-transparent bg-transparent text-neonPink">
          Create Room
        </button>
        <button onClick={joinRoom} className="btn btn-accent btn-wide shadow-neon hover:text-white hover:shadow-neonGreen hover:bg-transparent shadow-neonBlue hover:border-neonBlue bg-transparent text-neonBlue">
          Join Room
        </button>
      </div>
      <div className="mt-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-yellow-400 neon-glow mb-2">Game Rules</h2>
        <ul className="list-disc text-left ml-6 space-y-2 text-green-400">
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
