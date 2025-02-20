// src/lib/crossingPaths/utils/polygon.ts

import type { Point, Line } from './geometry';
import { evalLineAtX, isVertical } from './geometry';
import { pointToString, stringToPoint } from './geometry';

export class Polygon {
    private edges: Line[] = [];
    private points: Point[];

    constructor(points: Point[]) {
        this.points = [...points]; // Make a copy
        this.initializeEdges();
    }

    private initializeEdges(): void {
        for (let i = 0; i < this.points.length; i++) {
            const nextIdx = (i + 1) % this.points.length;
            this.edges.push({
                head: this.points[i],
                tail: this.points[nextIdx]
            });
        }
    }

    getIntersectionsAtX(x: number): Point[] {
        const intersections: Point[] = [];
        const EPSILON = 1e-10;

        for (const edge of this.edges) {
            const xMin = Math.min(edge.head.x, edge.tail.x);
            const xMax = Math.max(edge.head.x, edge.tail.x);

            // Check if x is within the edge's x-range (including tolerance)
            if (xMin - EPSILON <= x && x <= xMax + EPSILON) {
                if (isVertical(edge)) {
                    // For vertical edges, include both endpoints
                    intersections.push(edge.head);
                    intersections.push(edge.tail);
                } else {
                    // For non-vertical edges, calculate intersection
                    const y = evalLineAtX(edge, x);
                    intersections.push({ x, y });
                }
            }
        }

        return intersections;
    }

    getLatticePointsInside(): Point[] {
        const latticePoints: Point[] = [];
        const EPSILON = 1e-10;
        const pointSet = new Set<string>();

        // Find x-range of polygon
        const xCoords = this.points.map(p => p.x);
        const xMin = Math.ceil(Math.min(...xCoords));
        const xMax = Math.floor(Math.max(...xCoords));

        // Scan each vertical line
        for (let x = xMin; x <= xMax; x++) {
            const intersections = this.getIntersectionsAtX(x);
            
            if (intersections.length < 2) continue;

            // Get y-range from intersections
            const yCoords = intersections.map(p => p.y);
            const yMin = Math.ceil(Math.min(...yCoords) - EPSILON);
            const yMax = Math.floor(Math.max(...yCoords) + EPSILON);

            // Add all lattice points in the y-range
            for (let y = yMin; y <= yMax; y++) {
                const pointStr = pointToString({ x, y });
                if (!pointSet.has(pointStr)) {
                    pointSet.add(pointStr);
                    latticePoints.push({ x, y });
                }
            }
        }

        return latticePoints;
    }

    // Helper method to get edges if needed
    getEdges(): Line[] {
        return [...this.edges];
    }

    // Helper method to get points if needed
    getPoints(): Point[] {
        return [...this.points];
    }
}