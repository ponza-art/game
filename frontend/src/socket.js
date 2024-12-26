import { io } from "socket.io-client";

const socket = io("https://deployed-game-backend-production.up.railway.app/"); // Replace with your server URL

export default socket;
