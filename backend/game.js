class SurvivalPathGame {
    constructor() {
      this.rooms = {};
      this.defaultCards = [
        { type: "Move", value: 1 },
        { type: "Move", value: 2 },
        { type: "Move", value: 3 },
        { type: "Penalty", value: -2 },
        { type: "Bonus", value: 5 },
        { type: "Penalty", value: -3 },
      ];
    }
  
    createRoom(roomId) {
      if (!this.rooms[roomId]) {
        this.rooms[roomId] = {
          players: {},
          board: Array(20).fill(null),
        };
      }
    }
  
    addPlayerToRoom(roomId, playerId, username) {
        if (this.rooms[roomId] && !this.rooms[roomId].players[playerId]) {
          this.rooms[roomId].players[playerId] = {
            username: username || `Player ${Object.keys(this.rooms[roomId].players).length + 1}`,
            position: 0,
            points: 0,
            hand: [this.drawCard(), this.drawCard()], // Assign 2 random cards
          };
        }
      }
      
      drawCard() {
        return this.defaultCards[Math.floor(Math.random() * this.defaultCards.length)];
      }
      
  
    playCard(roomId, playerId, card) {
      const player = this.rooms[roomId].players[playerId];
      if (player) {
        if (card.type === "Move") {
          player.position = Math.min(player.position + card.value, 20);
        } else if (card.type === "Penalty") {
          player.position = Math.max(player.position + card.value, 0);
        } else if (card.type === "Bonus") {
          player.points += card.value;
        }
        player.hand = player.hand.filter((c) => c !== card);
        player.hand.push(this.drawCard());
  
        if (player.position === 20) {
          return `${player.username} wins!`;
        }
      }
    }
  
    getGameState(roomId) {
      return this.rooms[roomId];
    }
  }
  
  module.exports = SurvivalPathGame;
  