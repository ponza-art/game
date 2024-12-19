// avatarUtils.js
export const getPlayerAvatar = (username) => {
    const emojis = ["😀", "🐱", "🚀", "🍕", "🐉", "🌈", "⚡", "🎵"];
    const hash = username.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return emojis[hash % emojis.length];
  };
  