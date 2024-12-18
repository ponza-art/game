import { useState } from "react";
import RoomManager from "./components/RoomManager";
import GameBoard from "./components/GameBoard";

const App = () => {
  const [roomId, setRoomId] = useState(null);
  const [view, setView] = useState("home");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-900 via-black to-blue-900 text-neon">
      {view === "home" ? (
        <RoomManager setRoomId={setRoomId} setView={setView} />
      ) : (
        <GameBoard roomId={roomId} />
      )}
    </div>
  );
};

export default App;
