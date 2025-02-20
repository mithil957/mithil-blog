// src/lib/sketches/components/GridPaths/sketch.ts
import { BruteForceSolver } from "$lib/crossingPaths/utils/bruteForceSolver";
import type { Point, Line } from "$lib/crossingPaths/utils/geometry";
import {
  getSetOfLineSegments,
  getSetOfPoints,
} from "$lib/crossingPaths/utils/grid";
import p5 from "p5";

type IntersectionGrid = boolean[][];

export const createPathIntersectionsSketch = () => {
  let gridSize = 1;
  let uPath: Line | null = null;
  let suPath: Line | null = null;
  let points: Point[] | null = null;
  let lines: Line[] = [];
  let intersectionGrid: IntersectionGrid | null = null;
  let hoveredCell: {i: number, j: number} | null = null;

  const COLORS = {
    background: "#000000",
    grid: "#333333",
    u: "#FF7F50",
    su: "#4169E1",
  };

  return (p: p5) => {
    let width = 100;
    let height = 100;
    const padding = {
      top: 30,
      bottom: 30,
      left: 30,
      right: 30,
    };

    const calculateIntersections = () => {
      lines = getSetOfLineSegments(points || []);
      intersectionGrid = BruteForceSolver.calculateIntersectionGrid(lines);
    };

    const updateCanvasSize = () => {
      const element = p.canvas as HTMLCanvasElement;
      const parent = element.parentElement;
      if (parent) {
        width = parent.offsetWidth;
        height = parent.offsetHeight; // Use full parent height
        p.resizeCanvas(width, height);
      }
    };

    const gridToCanvas = (point: Point): Point => {
      const gridSpacing = (width - (padding.left + padding.right)) / gridSize;
      return {
        x: padding.left + point.x * gridSpacing,
        y: padding.top + point.y * gridSpacing,
      };
    };

    const setLatticePoints = () => {
      points = getSetOfPoints(gridSize);
    };

    const isMouseOverIntersectionGrid = () => {
        if (!intersectionGrid) return false;
        const gridSize = intersectionGrid.length;
        const cellSize = (width - (padding.left + padding.right)) / gridSize;
        const startY = height / 2 + padding.top;
        const gridWidth = gridSize * cellSize;
  
        return p.mouseX >= padding.left && 
               p.mouseX <= padding.left + gridWidth &&
               p.mouseY >= startY && 
               p.mouseY <= startY + gridWidth;
      };

      const getHoveredCell = () => {
        if (!intersectionGrid || !isMouseOverIntersectionGrid()) return null;
  
        const gridSize = intersectionGrid.length;
        const cellSize = (width - (padding.left + padding.right)) / gridSize;
        const startY = height / 2 + padding.top;
  
        const i = Math.floor((p.mouseX - padding.left) / cellSize);
        const j = Math.floor((p.mouseY - (startY)) / cellSize);
  
        return { i, j };
      };
  
      const drawHighlightedPaths = () => {
        if (!hoveredCell || !lines) return;
        const { i, j } = hoveredCell;
        
        // Draw first line
        const line1 = lines[i];
        drawPath(line1, COLORS.u, "U");
  
        // Draw second line
        const line2 = lines[j];
        drawPath(line2, COLORS.su, "SU");
      };

    const drawGrid = () => {
      p.stroke(COLORS.grid);
      p.strokeWeight(1);

      const spacing = (width - (padding.left + padding.right)) / gridSize;

      // Vertical lines
      for (let i = 0; i <= gridSize; i++) {
        const x = padding.left + i * spacing;
        p.line(x, padding.top, x, padding.top + spacing * gridSize);
      }

      // Horizontal lines
      for (let i = 0; i <= gridSize; i++) {
        const y = padding.top + i * spacing;
        p.line(padding.left, y, padding.left + spacing * gridSize, y);
      }
    };

    const drawPath = (path: Line, color: string, label: string) => {
      const start = gridToCanvas(path.head);
      const end = gridToCanvas(path.tail);

      // Draw line
      p.stroke(color);
      p.strokeWeight(2);
      p.line(start.x, start.y, end.x, end.y);

      // Draw points
      p.fill(color);
      p.noStroke();
      p.circle(start.x, start.y, 8);
      p.circle(end.x, end.y, 8);

      // Draw labels
      p.fill(255);
      p.noStroke();
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(14);
      p.text(label, start.x, start.y - 15);
      p.text(label, end.x, end.y - 15);
    };

    const drawIntersectionGrid = () => {
      if (!intersectionGrid) return;

      const gridSize = intersectionGrid.length;
      const cellSize = (width - (padding.left + padding.right)) / gridSize;
      const startY = height / 2 + padding.top;

      // Intersections
      p.noStroke();
      p.fill(255);
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          if (intersectionGrid[i][j]) {
            p.rect(
              padding.left + i * cellSize,
              startY + j * cellSize,
              cellSize,
              cellSize
            );
          }
        }
      }

      // Grid lines
      p.stroke(COLORS.grid);
      p.strokeWeight(1);
      // Vertical and horizontal lines
      for (let i = 0; i <= gridSize; i++) {
        const x = padding.left + i * cellSize;
        const y = startY + i * cellSize;
        p.line(x, startY, x, startY + gridSize * cellSize);
        p.line(padding.left, y, padding.left + gridSize * cellSize, y);
      }
    };

    p.setup = () => {
        p.createCanvas(400, 800);
        setLatticePoints();
        calculateIntersections();
        updateCanvasSize();
    };

    p.windowResized = () => {
      updateCanvasSize();
    };

    p.draw = () => {
        p.background(COLORS.background);
        drawGrid();
        drawIntersectionGrid();
        
        hoveredCell = getHoveredCell();
        if (hoveredCell) {
          drawHighlightedPaths();
        } else {
          if (uPath) drawPath(uPath, COLORS.u, "U");
          if (suPath) drawPath(suPath, COLORS.su, "SU");
        }
      };

    const increaseGridSize = () => {
      if (gridSize < 3) {
        gridSize++;
        setLatticePoints();
        calculateIntersections();
      }
    };

    const decreaseGridSize = () => {
      if (gridSize > 1) {
        gridSize--;
        setLatticePoints();
        calculateIntersections();
      }
    };

    return {
      increaseGridSize,
      decreaseGridSize,
    };
  };
};
