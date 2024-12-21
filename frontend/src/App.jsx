/* eslint-disable no-unused-vars */
import React,{useState} from "react";
import { GameStateProvider } from "./context/GameStateContext";
import RoomManager from "./components/RoomManager";
import GameBoard from "./components/GameBoard";

const App = () => {
  const [roomId, setRoomId] = useState(null);
  const [view, setView] = useState("home");

  return (
    <GameStateProvider>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-neon">
        {view === "home" ? (
          <RoomManager setRoomId={setRoomId} setView={setView} />
        ) : (
          <GameBoard roomId={roomId} />
        )}
      </div>
    </GameStateProvider>
  );
};

export default App;
