// src/lib/crossingPaths/utils/polygonSolver.ts

import { Polygon } from './polygon';
import { type Point, type Line, Orientation, getOrientation, isPointOnLine, isPointInGrid } from './geometry';
import { distance, evalLineAtX, evalLineAtY, perpendicularThroughPoint, getLatticePointsAlongLine } from './geometry';
import { getSetOfPoints } from './grid';

export class PolygonSolver {
    static getBoundaryPosition(p: Point, gridSize: number): number {
        if (p.x === 0) { // Left edge
            return p.y / gridSize;
        } else if (p.y === gridSize) { // Top edge
            return 1 + (p.x / gridSize);
        } else if (p.x === gridSize) { // Right edge
            return 2 + (1 - p.y / gridSize);
        } else { // Bottom edge (p.y === 0)
            return 3 + (1 - p.x / gridSize);
        }
    }

    static getHPoints(orientation: Orientation, start: Point, end: Point, gridSize: number): Point[] {
        // Create points including corners of grid
        const points: Point[] = [
            { x: 0, y: 0 },
            { x: 0, y: gridSize },
            { x: gridSize, y: gridSize },
            { x: gridSize, y: 0 },
            start,
            end
        ];

        // Sort points by their boundary position
        points.sort((a, b) => 
            PolygonSolver.getBoundaryPosition(a, gridSize) - 
            PolygonSolver.getBoundaryPosition(b, gridSize)
        );

        const hs: Point[] = [];
        let currentIdx = points.findIndex(p => 
            p.x === start.x && p.y === start.y
        );

        while (!(points[currentIdx].x === end.x && points[currentIdx].y === end.y)) {
            hs.push(points[currentIdx]);
            currentIdx = (currentIdx + orientation) % points.length;
            if (currentIdx < 0) currentIdx += points.length; // Handle negative indices
        }

        return hs;
    }

    static findGridIntersectionPoints(line: Line, gridSize: number): [Point, Point] {
        const pointsOnGridEdge = new Set<string>();
        
        // Check intersections with each grid boundary
        const points: Point[] = [
            { x: 0, y: evalLineAtX(line, 0) },
            { x: gridSize, y: evalLineAtX(line, gridSize) },
            { x: evalLineAtY(line, 0), y: 0 },
            { x: evalLineAtY(line, gridSize), y: gridSize }
        ];

        for (const point of points) {
            if (isPointInGrid(point, gridSize)) {
                pointsOnGridEdge.add(JSON.stringify(point));
            }
        }

        if (pointsOnGridEdge.size !== 2) {
            throw new Error('Line must intersect grid boundary at exactly two points');
        }

        const [p1, p2] = Array.from(pointsOnGridEdge).map(p => JSON.parse(p));
        return [p1, p2];
    }

    static findLatticePointsForCollinearSP(
        selectedPoint: Point,
        selectedLineSegment: Line,
        gridSize: number
    ): Point[] {
        const gridPoints = new Set(getSetOfPoints(gridSize).map(p => JSON.stringify(p)));
        
        // If selected point is either endpoint
        if ((selectedPoint.x === selectedLineSegment.head.x && selectedPoint.y === selectedLineSegment.head.y) ||
            (selectedPoint.x === selectedLineSegment.tail.x && selectedPoint.y === selectedLineSegment.tail.y)) {
            const endpoints = new Set([
                JSON.stringify(selectedLineSegment.head),
                JSON.stringify(selectedLineSegment.tail)
            ]);
            return Array.from(gridPoints)
                .filter(p => !endpoints.has(p))
                .map(p => JSON.parse(p));
        }

        // If selected point is on the line segment
        if (isPointOnLine(selectedLineSegment, selectedPoint)) {
            const selectedPointStr = JSON.stringify(selectedPoint);
            return Array.from(gridPoints)
                .filter(p => p !== selectedPointStr)
                .map(p => JSON.parse(p));
        }

        // When selected point is not on the line segment
        const allPoints = getLatticePointsAlongLine(selectedLineSegment, gridSize);
        
        // Find closest endpoint to determine orientation
        const distanceToHead = distance(selectedPoint, selectedLineSegment.head);
        const distanceToTail = distance(selectedPoint, selectedLineSegment.tail);
        const closest = distanceToHead < distanceToTail ? 
            selectedLineSegment.head : selectedLineSegment.tail;

        // Keep points with different orientation relative to perpendicular line
        const perpendicularLine = perpendicularThroughPoint(selectedLineSegment, closest);
        const baseOrientation = getOrientation(perpendicularLine, selectedPoint);
        
        return Array.from(allPoints)
            .filter(p => getOrientation(perpendicularLine, p) !== baseOrientation);
    }

    static findTailOfIntersectingLines(
        selectedPoint: Point,
        selectedLineSegment: Line,
        gridSize: number
    ): Point[] {
        const baseOrientation = getOrientation(selectedLineSegment, selectedPoint);

        if (baseOrientation === Orientation.COLLINEAR) {
            return this.findLatticePointsForCollinearSP(
                selectedPoint,
                selectedLineSegment,
                gridSize
            );
        }

        const a = selectedPoint;
        const e = selectedLineSegment.head;
        const d = selectedLineSegment.tail;

        const ae: Line = { head: a, tail: e };
        const ad: Line = { head: a, tail: d };

        // Find intersection points with grid boundary
        const [c1, c2] = this.findGridIntersectionPoints(ae, gridSize);
        const c = getOrientation(selectedLineSegment, c1) !== baseOrientation ? c1 : c2;

        const [b1, b2] = this.findGridIntersectionPoints(ad, gridSize);
        const b = getOrientation(selectedLineSegment, b1) !== baseOrientation ? b1 : b2;

        // Create polygon
        const polygonOrientation = getOrientation({ head: b, tail: a }, c);
        const hs = this.getHPoints(polygonOrientation, c, b, gridSize);
        
        const polygon = new Polygon([c, ...hs, b, d, e]);
        return polygon.getLatticePointsInside();
    }

    static numberOfIntersectionsGivenLineSegment(
        selectedLineSegment: Line,
        gridSize: number
    ): number {
        const intersectingLines = new Set<string>();
        
        // Define grid edges
        const edges: Line[] = [
            { head: { x: 0, y: 0 }, tail: { x: 0, y: gridSize } },      // left
            { head: { x: 0, y: gridSize }, tail: { x: gridSize, y: gridSize } },  // top
            { head: { x: gridSize, y: gridSize }, tail: { x: gridSize, y: 0 } },  // right
            { head: { x: gridSize, y: 0 }, tail: { x: 0, y: 0 } }       // bottom
        ];

        // Check if line segment is on grid's edge
        for (const edge of edges) {
            if (getOrientation(edge, selectedLineSegment.head) === Orientation.COLLINEAR && 
                getOrientation(edge, selectedLineSegment.tail) === Orientation.COLLINEAR) {
                
                const lineSegmentPoints = new Set(
                    [...getLatticePointsAlongLine(selectedLineSegment, gridSize)]
                        .map(p => JSON.stringify(p))
                );

                for (const pointStr of lineSegmentPoints) {
                    const point = JSON.parse(pointStr);
                    const tails = this.findLatticePointsForCollinearSP(point, selectedLineSegment, gridSize);
                    
                    for (const tail of tails) {
                        const line = { head: point, tail };
                        intersectingLines.add(JSON.stringify([
                            JSON.stringify(line.head),
                            JSON.stringify(line.tail)
                        ].sort()));
                    }
                }

                return intersectingLines.size;
            }
        }

        // Handle non-edge case
        const [f, g] = this.findGridIntersectionPoints(selectedLineSegment, gridSize);
        
        const hsClockwise = this.getHPoints(Orientation.CLOCKWISE, f, g, gridSize);
        const hsCounterClockwise = this.getHPoints(Orientation.COUNTERCLOCKWISE, f, g, gridSize);
        
        const polygonClockwise = new Polygon([f, ...hsClockwise, g]);
        const polygonCounterClockwise = new Polygon([f, ...hsCounterClockwise, g]);
        
        const pointsClockwise = polygonClockwise.getLatticePointsInside();
        const pointsCounterClockwise = polygonCounterClockwise.getLatticePointsInside();
        
        const pointsSmallerPolygon = pointsClockwise.length < pointsCounterClockwise.length ?
            pointsClockwise : pointsCounterClockwise;

        for (const point of pointsSmallerPolygon) {
            const tails = this.findTailOfIntersectingLines(point, selectedLineSegment, gridSize);
            
            for (const tail of tails) {
                const line = { head: point, tail };
                intersectingLines.add(JSON.stringify([
                    JSON.stringify(line.head),
                    JSON.stringify(line.tail)
                ].sort()));
            }
        }

        return intersectingLines.size;
    }
}