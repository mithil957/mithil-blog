import type { Line } from './geometry';
import { doLinesIntersect } from './geometry';

export class BruteForceSolver {
    /**
     * Calculates intersection matrix for a set of lines
     * @param lines Array of lines to check for intersections
     * @returns 2D boolean array where true indicates intersection
     */
    static calculateIntersectionGrid(lines: Line[]): boolean[][] {
        const n = lines.length;
        // Initialize empty matrix with false values
        const matrix: boolean[][] = Array(n).fill(null).map(() => Array(n).fill(false));
        
        // Fill upper triangle of matrix with intersection results
        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                matrix[i][j] = doLinesIntersect(lines[i], lines[j]);
                matrix[j][i] = matrix[i][j];
            }
        }
        
        return matrix;
    }
}