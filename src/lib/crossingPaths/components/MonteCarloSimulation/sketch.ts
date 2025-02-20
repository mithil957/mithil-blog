import type { Point, Line } from '$lib/crossingPaths/utils/geometry';
import { getSetOfPoints } from '$lib/crossingPaths/utils/grid';
import { doLinesIntersect, findIntersectionPoint } from '$lib/crossingPaths/utils/geometry';
import p5 from 'p5';

export const createMonteCarloSketch = () => {
    let gridSize = 4;
    let totalSamples = 0;
    let intersectingPairs = 0;
    
    const COLORS = {
        background: '#000000',
        grid: '#333333',
        u: 'rgba(255, 127, 80, 0.05)', // Faint coral
        su: 'rgba(65, 105, 225, 0.05)' // Faint blue
    };

    return (p: p5) => {
        let width = 100;
        let height = 100;
        const padding = 40;
        let points: Point[] | null = null;

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
                y: padding + point.y * gridSpacing
            };
        };

        const setLatticePoints = () => {
            points = getSetOfPoints(gridSize);
        };

        function generateRandomPath(): Line {
            if (!points || points.length < 2) throw new Error('Points not initialized');
            
            // Create a copy of points array
            const availablePoints = [...points];
            
            // Pick first point randomly
            const index1 = Math.floor(Math.random() * availablePoints.length);
            const point1 = availablePoints[index1];
            availablePoints.splice(index1, 1);
            
            // Pick second point from remaining points
            const index2 = Math.floor(Math.random() * availablePoints.length);
            const point2 = availablePoints[index2];
            
            return { head: point1, tail: point2 };
        }

        const drawPath = (path: Line, color: string) => {
            const start = gridToCanvas(path.head);
            const end = gridToCanvas(path.tail);
            
            // Draw line
            p.stroke(color);
            p.strokeWeight(2);
            p.line(start.x, start.y, end.x, end.y);
            
            // Draw endpoints
            p.fill(color);
            p.noStroke();
            p.circle(start.x, start.y, 4);
            p.circle(end.x, end.y, 4);
        };

        const drawGrid = () => {
            p.stroke(COLORS.grid);
            p.strokeWeight(1);
            
            const spacing = (width - 2 * padding) / gridSize;
            
            // Draw vertical lines
            for (let i = 0; i <= gridSize; i++) {
                const x = padding + i * spacing;
                p.line(x, padding, x, height - padding);
            }
            
            // Horizontal lines
            for (let i = 0; i <= gridSize; i++) {
                const y = padding + i * spacing;
                p.line(padding, y, width - padding, y);
            }
        };

        const addSamples = (numSamples: number = 100) => {
            // Set background with alpha for trail effect
            p.background(0, 0, 0, 5);
            drawGrid();

            for (let i = 0; i < numSamples; i++) {
                const path1 = generateRandomPath();
                const path2 = generateRandomPath();
                
                const intersects = doLinesIntersect(path1, path2);
                
                if (intersects) {
                    drawPath(path1, COLORS.u);
                    drawPath(path2, COLORS.su);
                    
                    // Draw intersection point
                    const intersectionPoint = findIntersectionPoint(path1, path2, true);
                    if (intersectionPoint) {
                        const canvasPoint = gridToCanvas(intersectionPoint);
                        p.fill(255, 255, 255, 100);
                        p.noStroke();
                        p.circle(canvasPoint.x, canvasPoint.y, 8 * gridSize / (gridSize * gridSize * 1/2));
                    }
                    
                    intersectingPairs++;
                }
                
                totalSamples++;
            }
        };

        const reset = () => {
            totalSamples = 0;
            intersectingPairs = 0;
            p.background(COLORS.background);
            drawGrid();
        };

        p.setup = () => {
            p.createCanvas(100, 100);
            setLatticePoints();
            updateCanvasSize();
            p.background(COLORS.background);
            drawGrid();
        };

        p.windowResized = () => {
            updateCanvasSize();
        };

        p.draw = () => {
            // No continuous drawing needed
        };

        const getProbability = () => {
            if (totalSamples === 0) return 0;
            return intersectingPairs / totalSamples;
        };

        const getStats = () => {
            return {
                totalSamples,
                intersectingPairs,
                probability: getProbability()
            };
        };

        const increaseGridSize = () => {
            if (gridSize < 50) {
                gridSize++;
                setLatticePoints();
                reset();
            }
        };

        const decreaseGridSize = () => {
            if (gridSize > 2) {
                gridSize--;
                setLatticePoints();
                reset();
            }
        };

        const getGridSize = () => gridSize;

        return {
            addSamples,
            reset,
            getStats,
            increaseGridSize,
            decreaseGridSize,
            getGridSize
        };
    };
};