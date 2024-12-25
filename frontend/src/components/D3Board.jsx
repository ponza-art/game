

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
      .attr("fill", "none") // No fill
      .attr("stroke", (_, i) => borderColors[i]) // Persist border colors
      .attr("stroke-width", 2)
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
      gridGroup
        .append("circle")
        .attr("cx", (player.position % columns) * cellSize + cellSize / 2)
        .attr("cy", Math.floor(player.position / columns) * cellSize + cellSize / 2)
        .attr("r", cellSize / 3)
        .attr("fill", "none")
        .attr("stroke", playerColor)
        .attr("stroke-width", 4)
        .attr("class", "pulsing-circle");
    });
  }, [gameState]);

  return <svg ref={svgRef} className="w-full h-auto"></svg>;
};

export default D3Board;
