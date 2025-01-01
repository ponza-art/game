/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import socket from "../socket";
import { toast } from "react-hot-toast";

const RoomManager = ({ setRoomId, setView }) => {
  const [roomInput, setRoomInput] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [error, setError] = useState("");
  const [publicRooms, setPublicRooms] = useState([]);

  useEffect(() => {
    socket.emit("getPublicRooms");

    socket.on("publicRoomsUpdate", (rooms) => {
      setPublicRooms(rooms);
    });

    socket.on("quickJoinRoom", (roomId) => {
      if (username.trim()) {
        joinRoom(roomId);
      } else {
        toast.error("Please enter a username first");
      }
    });

    socket.on("actionError", ({ message }) => {
      setError(message);
      toast.error(message);
    });

    return () => {
      socket.off("publicRoomsUpdate");
      socket.off("quickJoinRoom");
      socket.off("actionError");
    };
  }, [username]);

  const createRoom = () => {
    if (!roomInput.trim() || !username.trim()) {
      setError("Both Room ID and Username are required.");
      return;
    }
    setError("");
    
    socket.emit("createRoom", {
      roomId: roomInput.trim(),
      isPublic,
      password: password.trim() || null
    });

    joinRoom(roomInput.trim());
  };

  const joinRoom = (targetRoomId) => {
    if (!username.trim()) {
      setError("Username is required to join a room.");
      return;
    }
    setError("");
    
    socket.emit("joinRoom", {
      roomId: targetRoomId,
      username: username.trim(),
      password: password.trim() || null
    });
    
    setRoomId(targetRoomId);
    setView("game");
  };

  const quickJoin = () => {
    if (!username.trim()) {
      setError("Username is required for quick join.");
      return;
    }
    socket.emit("quickJoin");
  };

  return (
    <div className="p-6 flex flex-col items-center space-y-6 text-center bg-gray-900 text-white w-full sm:px-8 lg:max-w-4xl">
      <h1 className="text-4xl font-bold text-yellow-400 neon-glow mb-4 sm:text-5xl">
        Welcome to <span className="text-pink-500">Survival Path</span>
      </h1>

      {/* User Input Section */}
      <div className="w-full space-y-4">
        <input
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input input-bordered input-yellow-400 bg-gray-800 text-blue-400 w-full"
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomInput}
            onChange={(e) => setRoomInput(e.target.value)}
            className="input input-bordered input-yellow-400 bg-gray-800 text-pink-500"
          />
          
          <input
            type="password"
            placeholder="Room Password (Optional)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input input-bordered input-yellow-400 bg-gray-800 text-green-400"
          />
        </div>

        <div className="flex items-center justify-center space-x-4">
          <label className="cursor-pointer label">
            <span className="label-text text-yellow-400 mr-2">Public Room</span>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="checkbox checkbox-primary"
            />
          </label>
        </div>
      </div>

      {error && <div className="text-red-500">{error}</div>}

      {/* Action Buttons */}
      <div className="space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row w-full">
        <button
          onClick={createRoom}
          className="btn btn-primary hover:text-white hover:bg-transparent bg-transparent text-neonPink"
        >
          Create Room
        </button>
        <button
          onClick={quickJoin}
          className="btn btn-secondary hover:text-white hover:bg-transparent bg-transparent text-neonGreen"
        >
          Quick Join
        </button>
      </div>

      {/* Public Rooms List */}
      {publicRooms.length > 0 && (
        <div className="w-full mt-8">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">Available Rooms</h2>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            {publicRooms.map((room) => (
              <div
                key={room.roomId}
                className="bg-gray-800 p-4 rounded-lg flex justify-between items-center"
              >
                <div>
                  <p className="text-yellow-400">Room: {room.roomId}</p>
                  <p className="text-gray-400">
                    Players: {room.playerCount}/{room.maxPlayers}
                  </p>
                </div>
                <button
                  onClick={() => joinRoom(room.roomId)}
                  className="btn btn-accent btn-sm"
                >
                  Join
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Game Rules Section */}
      <div className="mt-8 w-full">
        <h2 className="text-2xl font-bold text-yellow-400 neon-glow mb-2">
          Game Rules
        </h2>
        <ul className="list-disc text-left ml-6 space-y-2 text-green-400 text-sm sm:text-base">
          <li>2-6 players can join a room</li>
          <li>Host must start the game manually</li>
          <li>Players take turns playing cards to move forward or gain points</li>
          <li>The first player to reach square 45 wins the round</li>
          <li>Cards have effects: Move, Bonus, Penalty, Event, and Mind Play</li>
          <li>Use strategy to move forward or hinder opponents</li>
          <li>If a player disconnects, an AI will take their place</li>
        </ul>
      </div>
    </div>
  );
};

export default RoomManager;