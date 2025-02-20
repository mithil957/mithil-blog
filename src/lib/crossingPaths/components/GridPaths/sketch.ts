// src/lib/sketches/components/GridPaths/sketch.ts
import type { Point, Line } from '$lib/crossingPaths/utils/geometry';
import { getSetOfPoints } from '$lib/crossingPaths/utils/grid';
import p5 from 'p5';



export const createGridPathsSketch = () => {
    let gridSize = 3;
    let uPath: Line | null = null;
    let suPath: Line | null = null;
    
    const COLORS = {
        background: '#000000',
        grid: '#333333',
        u: '#FF7F50',
        su: '#4169E1'
    };

    return (p: p5) => {
        let width = 100;
        let height = 100;
        const padding = 60;
        let points: Point[] | null = null;

        const updateCanvasSize = () => {
            const element = p.canvas as HTMLCanvasElement;
            const parent = element.parentElement;
            if (parent) {
                // Get the smaller of parent's width or height
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

        function shufflePoints() {
            if (points == null) {
                return;
            }

            let currentIndex = points.length;
            while (currentIndex != 0) {
                let randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex--;

                [points[currentIndex], points[randomIndex]] = [points[randomIndex], points[currentIndex]];
            }
        }

        const generateRandomPath = (): Line | null => {
            if (points == null) {
                return null;
            } 
            
            shufflePoints();

            return {head: points[0], tail: points[1]}
        };

        const generatePaths = () => {
            uPath = generateRandomPath();
            suPath = generateRandomPath();
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
            
            // Draw horizontal lines
            for (let i = 0; i <= gridSize; i++) {
                const y = padding + i * spacing;
                p.line(padding, y, width - padding, y);
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

        p.setup = () => {
            p.createCanvas(100, 100);
            setLatticePoints();
            updateCanvasSize();
            generatePaths();
        };

        p.windowResized = () => {
            updateCanvasSize();
        };

        p.draw = () => {
            p.background(COLORS.background);
            drawGrid();
            
            if (uPath) drawPath(uPath, COLORS.u, 'U');
            if (suPath) drawPath(suPath, COLORS.su, 'SU');
        };

        const increaseGridSize = () => {
            if (gridSize < 5) {
                gridSize++;
                setLatticePoints();
                generatePaths();
            }
        };

        const decreaseGridSize = () => {
            if (gridSize > 1) {
                gridSize--;
                setLatticePoints();
                generatePaths();
            }
        };

        const regeneratePaths = () => {
            generatePaths();
        };

        return {
            increaseGridSize,
            decreaseGridSize,
            regeneratePaths
        };
    };
};