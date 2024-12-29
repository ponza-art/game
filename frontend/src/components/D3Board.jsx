/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useRef, useContext, useEffect } from "react";
import * as d3 from "d3";
import { GameStateContext } from "../context/GameStateContext";

const D3Board = () => {
  const { gameState } = useContext(GameStateContext);
  const svgRef = useRef();
  const borderColorsRef = useRef([]);

  useEffect(() => {
    console.log("Updated gameState:", gameState);

    const board = gameState?.gameState?.board || [];
    const players = gameState?.players || {};
    const columns = 9;
    const rows = Math.ceil(board.length / columns);
    const cellSize = 80;
    const width = columns * cellSize;
    const height = rows * cellSize;

    const playerColors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#FFC300"];

    // Generate random colors for the borders only once
    if (borderColorsRef.current.length !== board.length) {
      borderColorsRef.current = board.map(
        () => `#${Math.floor(Math.random() * 16777215).toString(16)}`
      );
    }

    const borderColors = borderColorsRef.current;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("background", "#2a2a40");

    const gridGroup = svg.append("g");

    gridGroup
      .selectAll("rect")
      .data(board)
      .enter()
      .append("rect")
      .attr("x", (_, i) => (i % columns) * cellSize)
      .attr("y", (_, i) => Math.floor(i / columns) * cellSize)
      .attr("width", cellSize - 2)
      .attr("height", cellSize - 2)
      .attr("fill", (d) => d === 45 ? "rgba(255, 215, 0, 0.2)" : "none") // Highlight the cell containing 45
      .attr("stroke", (d, i) => d === 45 ? "#FFD700" : borderColors[i]) // Added index parameter 'i'
      .attr("stroke-width", (d) => d === 45 ? 4 : 2)
      .on("mouseover", function () {
        d3.select(this).attr("fill", "rgba(255, 255, 255, 0.1)");
      })
      .on("mouseout", function () {
        d3.select(this).attr("fill", "none");
      });

    gridGroup
      .selectAll("text.cell-number")
      .data(board)
      .enter()
      .append("text")
      .attr("class", "cell-number")
      .attr("x", (_, i) => (i % columns) * cellSize + cellSize / 2)
      .attr("y", (_, i) => Math.floor(i / columns) * cellSize + cellSize / 2)
      .attr("dy", 4)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("font-size", 14)
      .attr("fill", "#fff")
      .text((d) => d); // Use the value from the board array

    Object.entries(players).forEach(([playerId, player], index) => {
      const playerColor = playerColors[index % playerColors.length];
      
      // Find the index of the player's position value in the board array
      const boardIndex = board.indexOf(player.position);
      
      // Calculate position on board using the found index
      const x = (boardIndex % columns) * cellSize + cellSize / 2;
      const y = Math.floor(boardIndex / columns) * cellSize + cellSize / 2;

      // Add player marker
      gridGroup
        .append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", cellSize / 3)
        .attr("fill", "none")
        .attr("stroke", playerColor)
        .attr("stroke-width", 4)
        .attr("class", "pulsing-circle");

      // Add moves counter
      gridGroup
        .append("text")
        .attr("x", x)
        .attr("y", y + 5)
        .attr("text-anchor", "middle")
        .attr("fill", playerColor)
        .attr("font-size", "12px")
        .text(`${player.moves}`);
    });
  }, [gameState]);

  return <svg ref={svgRef} className="w-full h-auto"></svg>;
};

export default D3Board;
