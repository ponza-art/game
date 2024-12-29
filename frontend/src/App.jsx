import React,{useState} from "react";
import { GameStateProvider } from "./context/GameStateContext";
import RoomManager from "./components/RoomManager";
import GameBoard from "./components/GameBoard";
import { Toaster } from 'react-hot-toast';

const App = () => {
  const [roomId, setRoomId] = useState(null);
  const [view, setView] = useState("home");

  return (
    <>
      <Toaster position="bottom-right" />
      <GameStateProvider>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-neon">
          {view === "home" ? (
            <RoomManager setRoomId={setRoomId} setView={setView} />
          ) : (
            <GameBoard roomId={roomId} />
          )}
        </div>
      </GameStateProvider>
    </>
  );
};

export default App;
