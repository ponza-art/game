const express = require("express");
const router = express.Router();
const Player = require("../models/Player");

// Start a new game
router.post("/start", async (req, res) => {
  try {
    await Player.deleteMany();
    const players = req.body.players.map((name) => ({ name }));
    const result = await Player.insertMany(players);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Move player
router.post("/move", async (req, res) => {
  const { playerId, moveBy } = req.body;
  try {
    const player = await Player.findById(playerId);
    if (!player) return res.status(404).json({ error: "Player not found" });

    player.position += moveBy;
    if (player.position >= 20) {
      player.position = 20;
      player.points += 50;
    }
    await player.save();

    res.json(player);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
