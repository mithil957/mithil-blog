// src/lib/crossingPaths/components/PolygonMethod/sketch.ts

import type { Point, Line } from "$lib/crossingPaths/utils/geometry";
import { getSetOfPoints } from "$lib/crossingPaths/utils/grid";
import {
  Orientation,
  getOrientation,
  findGridIntersectionPoints,
} from "$lib/crossingPaths/utils/geometry";
import { PolygonSolver } from "$lib/crossingPaths/utils/polygonSolver";
import p5 from "p5";

export const createPolygonMethodSketch = () => {
  let gridSize = 3;
  let lineSegment: Line | null = null;
  let selectedPoint: Point | null = null;
  let points: Point[] | null = null;

  const COLORS = {
    background: "#000000",
    grid: "#333333",
    lineSegment: "#FF7F50",
    clockwisePolygon: "rgba(255, 127, 80, 0.4)",
    counterClockwisePolygon: "rgba(65, 105, 225, 0.4)",
    points: "#ffffff",
    intersectionPoints: "#FFFF00",
    rays: "rgba(255, 255, 255, 1.0)",
  };

  return (p: p5) => {
    let width = 100;
    let height = 100;
    const padding = 20;

    const updateCanvasSize = () => {
      const element = p.canvas as HTMLCanvasElement;
      const parent = element.parentElement;
      if (parent) {
        const size = Math.min(parent.offsetWidth, parent.offsetHeight);
        width = size;
        height = size;
        p.resizeCanvas(width, height);
      }
    };

    const gridToCanvas = (point: Point): Point => {
      const gridSpacing = (width - 2 * padding) / gridSize;
      return {
        x: padding + point.x * gridSpacing,
        y: padding + point.y * gridSpacing,
      };
    };

    const canvasToGrid = (x: number, y: number): Point | null => {
      const gridSpacing = (width - 2 * padding) / gridSize;

      // Convert to grid coordinates
      const gridX = (x - padding) / gridSpacing;
      const gridY = (y - padding) / gridSpacing;

      // Check if we're within the grid boundaries (with some padding)
      if (
        gridX >= -0.5 &&
        gridX <= gridSize + 0.5 &&
        gridY >= -0.5 &&
        gridY <= gridSize + 0.5
      ) {
        // Round to nearest grid point
        const roundedX = Math.min(Math.max(Math.round(gridX), 0), gridSize);
        const roundedY = Math.min(Math.max(Math.round(gridY), 0), gridSize);

        return { x: roundedX, y: roundedY };
      }

      return null;
    };

    const setLatticePoints = () => {
      points = getSetOfPoints(gridSize);
    };

    function isLineOnGridEdge(line: Line): boolean {
      return (
        line.head.x === 0 ||
        line.head.x === gridSize ||
        line.head.y === 0 ||
        line.head.y === gridSize ||
        line.tail.x === 0 ||
        line.tail.x === gridSize ||
        line.tail.y === 0 ||
        line.tail.y === gridSize
      );
    }

    function generateRandomNonEdgeLine(): Line {
      // Generate inner grid points (grid size - 2)
      const innerGridSize = gridSize - 2;
      const innerPoints = getSetOfPoints(innerGridSize);

      // Create a copy of points array
      const availablePoints = [...innerPoints];

      // Pick first point randomly
      const index1 = Math.floor(Math.random() * availablePoints.length);
      const point1 = availablePoints[index1];
      availablePoints.splice(index1, 1);

      // Pick second point from remaining points
      const index2 = Math.floor(Math.random() * availablePoints.length);
      const point2 = availablePoints[index2];

      // Shift points by 1 to avoid edges
      return {
        head: { x: point1.x + 1, y: point1.y + 1 },
        tail: { x: point2.x + 1, y: point2.y + 1 },
      };
    }

    const drawGrid = () => {
      p.stroke(COLORS.grid);
      p.strokeWeight(1);

      const spacing = (width - 2 * padding) / gridSize;

      // Draw vertical lines
      for (let i = 0; i <= gridSize; i++) {
        const x = padding + i * spacing;
        p.line(x, padding, x, height - padding);
      }

      // Draw horizontal lines
      for (let i = 0; i <= gridSize; i++) {
        const y = padding + i * spacing;
        p.line(padding, y, width - padding, y);
      }
    };

    const drawPoints = () => {
      if (!points) return;

      p.fill(COLORS.points);
      p.noStroke();

      for (const point of points) {
        const canvasPoint = gridToCanvas(point);
        p.circle(canvasPoint.x, canvasPoint.y, 2);
      }

      // Highlight selected point if exists
      if (selectedPoint) {
        const canvasPoint = gridToCanvas(selectedPoint);
        p.fill(COLORS.lineSegment);
        p.circle(canvasPoint.x, canvasPoint.y, 8);
      }
    };

    const drawLineSegment = () => {
      if (!lineSegment) return;

      const start = gridToCanvas(lineSegment.head);
      const end = gridToCanvas(lineSegment.tail);

      // Draw line
      p.stroke(COLORS.lineSegment);
      p.strokeWeight(2);
      p.line(start.x, start.y, end.x, end.y);

      // Draw endpoints
      p.fill(COLORS.lineSegment);
      p.noStroke();
      p.circle(start.x, start.y, 8);
      p.circle(end.x, end.y, 8);
    };

    const drawPolygons = () => {
      if (!lineSegment) return;

      // Find intersection points with grid
      const [f, g] = findGridIntersectionPoints(lineSegment, gridSize);

      // Get points for clockwise polygon
      const hsClockwise = PolygonSolver.getHPoints(
        Orientation.CLOCKWISE,
        f,
        g,
        gridSize
      );

      // Get points for counterclockwise polygon
      const hsCounterClockwise = PolygonSolver.getHPoints(
        Orientation.COUNTERCLOCKWISE,
        f,
        g,
        gridSize
      );

      // Draw clockwise polygon
      p.fill(COLORS.clockwisePolygon);
      p.noStroke();
      p.beginShape();
      for (const point of [f, ...hsClockwise, g]) {
        const canvasPoint = gridToCanvas(point);
        p.vertex(canvasPoint.x, canvasPoint.y);
      }
      p.endShape(p.CLOSE);

      // Draw counterclockwise polygon
      p.fill(COLORS.counterClockwisePolygon);
      p.noStroke();
      p.beginShape();
      for (const point of [f, ...hsCounterClockwise, g]) {
        const canvasPoint = gridToCanvas(point);
        p.vertex(canvasPoint.x, canvasPoint.y);
      }
      p.endShape(p.CLOSE);
    };

    const drawSelectedPointVisualization = () => {
      if (!lineSegment || !selectedPoint) return;

      if (
        (selectedPoint.x === lineSegment.head.x &&
          selectedPoint.y === lineSegment.head.y) ||
        (selectedPoint.x === lineSegment.tail.x &&
          selectedPoint.y === lineSegment.tail.y)
      )
        return;

      const intersectingPoints = PolygonSolver.findTailOfIntersectingLines(
        selectedPoint,
        lineSegment,
        gridSize
      );

      // Draw rays first (so points appear on top)
      // Ray through head
      const rayThroughHead: Line = {
        head: selectedPoint,
        tail: lineSegment.head,
      };
      const [b1, b2] = findGridIntersectionPoints(rayThroughHead, gridSize);
      // Select point further in direction of head from selected point
      const dir1 = {
        x: lineSegment.head.x - selectedPoint.x,
        y: lineSegment.head.y - selectedPoint.y,
      };
      const boundaryPoint1 =
        (b1.x - selectedPoint.x) * dir1.x + (b1.y - selectedPoint.y) * dir1.y >
        0
          ? b1
          : b2;

      p.stroke(COLORS.rays);
      p.strokeWeight(1);
      const startPoint = gridToCanvas(selectedPoint);
      const headPoint = gridToCanvas(lineSegment.head);
      const boundaryPoint1Canvas = gridToCanvas(boundaryPoint1);
      p.line(startPoint.x, startPoint.y, headPoint.x, headPoint.y);
      p.line(
        headPoint.x,
        headPoint.y,
        boundaryPoint1Canvas.x,
        boundaryPoint1Canvas.y
      );

      // Ray through tail
      const rayThroughTail: Line = {
        head: selectedPoint,
        tail: lineSegment.tail,
      };
      const [b3, b4] = findGridIntersectionPoints(rayThroughTail, gridSize);
      const dir2 = {
        x: lineSegment.tail.x - selectedPoint.x,
        y: lineSegment.tail.y - selectedPoint.y,
      };
      const boundaryPoint2 =
        (b3.x - selectedPoint.x) * dir2.x + (b3.y - selectedPoint.y) * dir2.y >
        0
          ? b3
          : b4;

      const tailPoint = gridToCanvas(lineSegment.tail);
      const boundaryPoint2Canvas = gridToCanvas(boundaryPoint2);
      p.line(startPoint.x, startPoint.y, tailPoint.x, tailPoint.y);
      p.line(
        tailPoint.x,
        tailPoint.y,
        boundaryPoint2Canvas.x,
        boundaryPoint2Canvas.y
      );

      // Draw intersecting points
      p.fill(COLORS.intersectionPoints);
      p.noStroke();
      for (const point of intersectingPoints) {
        const canvasPoint = gridToCanvas(point);
        p.circle(canvasPoint.x, canvasPoint.y, 4);
      }
    };

    p.setup = () => {
      p.createCanvas(100, 100);
      setLatticePoints();
      updateCanvasSize();
      generateNewLine();
    };

    p.windowResized = () => {
      updateCanvasSize();
    };

    p.draw = () => {
      p.background(COLORS.background);
      drawGrid();
      drawPoints();
      if (lineSegment) {
        drawPolygons();
        if (selectedPoint) {
          drawSelectedPointVisualization();
        }
        drawLineSegment();
      }
    };

    p.mouseMoved = () => {
      if (!points) return;

      const gridPoint = canvasToGrid(p.mouseX, p.mouseY);
      if (
        gridPoint &&
        gridPoint.x >= 0 &&
        gridPoint.x <= gridSize &&
        gridPoint.y >= 0 &&
        gridPoint.y <= gridSize
      ) {
        selectedPoint = gridPoint;
      } else {
        selectedPoint = null;
      }
    };

    const generateNewLine = () => {
      lineSegment = generateRandomNonEdgeLine();
      selectedPoint = null;
    };

    const increaseGridSize = () => {
      if (gridSize < 30) {
        gridSize++;
        setLatticePoints();
        lineSegment = null;
        selectedPoint = null;
        generateNewLine();
      }
    };

    const decreaseGridSize = () => {
      if (gridSize >= 5) {
        gridSize--;
        setLatticePoints();
        lineSegment = null;
        selectedPoint = null;
        generateNewLine();
      }
    };

    return {
      generateNewLine,
      increaseGridSize,
      decreaseGridSize,
    };
  };
};
