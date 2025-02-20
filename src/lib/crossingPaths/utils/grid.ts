// src/lib/sketches/utils/grid.ts

import type { Point, Line } from './geometry';

/**
 * Generates a set of points for a grid of given size
 * @param gridSize The size of the grid (number of cells)
 * @returns Array of all points in the grid
 */
export function getSetOfPoints(gridSize: number): Point[] {
    const points: Point[] = [];

    for (let x = 0; x <= gridSize; x++) {
        for (let y = 0; y <= gridSize; y++) {
            points.push({ x, y });
        }
    }

    return points;
}

/**
 * Generates all possible line segments between points in the grid
 * @param points Array of points to generate lines between
 * @returns Array of all possible lines between the points
 */
export function getSetOfLineSegments(points: Point[]): Line[] {
    const lines: Line[] = [];

    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            lines.push({
                head: points[i],
                tail: points[j]
            });
        }
    }

    return lines;
}