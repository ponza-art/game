/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      
      colors: {
        neonPink: "#ff007f",
        neonBlue: "#00e0ff",
        neonGreen: "#00ff7f",
        darkBg: "#1a1a2e",
        darkAccent: "#16213e",
        gold:"#FFD700"
      },
      fontFamily: {
        cyber: ["Orbitron", "sans-serif"], // Example of a cyberpunk-style font
      },
      boxShadow: {
        neon: "0 0 10px #ff007f, 0 0 20px #ff007f, 0 0 30px #00e0ff",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        cyberpunk: {
          primary: "#ff007f",
          secondary: "#00e0ff",
          accent: "#00ff7f",
          neutral: "#1a1a2e",
          "base-100": "#0d0d19",
          info: "#1e90ff",
          success: "#00ff7f",
          warning: "#ffcc00",
          error: "#ff4500",
        },
      },
    ],
  },
};
