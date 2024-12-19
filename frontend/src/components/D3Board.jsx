import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { getPlayerAvatar } from "./avatarUtils"; // Import the utility function

const D3Board = ({ gameState }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const columns = 5;
    const rows = 4;
    const cellSize = 120;
    const width = columns * cellSize;
    const height = rows * cellSize;

    const colors = {
      background: "#2a2a40",
      grid: "#5c5c7d",
      highlightGrid: "#ff4d4d",
      text: "#f5e242",
    };

    svg
      .attr("width", width)
      .attr("height", height)
      .style("background", colors.background);

    svg
      .append("g")
      .selectAll("rect")
      .data(d3.range(columns * rows))
      .enter()
      .append("rect")
      .attr("x", (d) => (d % columns) * cellSize)
      .attr("y", (d) => Math.floor(d / columns) * cellSize)
      .attr("width", cellSize - 2)
      .attr("height", cellSize - 2)
      .attr("fill", (d) => (d % 5 === 0 ? colors.highlightGrid : colors.grid))
      .attr("stroke", colors.text);

    if (gameState) {
      Object.values(gameState.players).forEach((player) => {
        const playerAvatar = getPlayerAvatar(player.username); // Use the same avatar logic
        svg
          .append("text")
          .attr("x", (player.position % columns) * cellSize + cellSize / 2)
          .attr("y", Math.floor(player.position / columns) * cellSize + cellSize / 2)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "central")
          .text(playerAvatar)
          .attr("font-size", "32px")
          .attr("fill", "#ffdd57");
      });
    }
  }, [gameState]);

  return <svg ref={svgRef}></svg>;
};

export default D3Board;
