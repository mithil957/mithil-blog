export interface Point {
    x: number;
    y: number;
}

export interface Line {
    head: Point;
    tail: Point;
}

export enum Orientation {
    COLLINEAR = 0,
    CLOCKWISE = 1,
    COUNTERCLOCKWISE = -1
}

export function getOrientation(line: Line, point: Point): Orientation {
    const val = (line.tail.y - line.head.y) * (point.x - line.tail.x) -
                (line.tail.x - line.head.x) * (point.y - line.tail.y);
    
    if (val === 0) return Orientation.COLLINEAR;
    return val > 0 ? Orientation.CLOCKWISE : Orientation.COUNTERCLOCKWISE;
}

export function isPointOnLine(line: Line, point: Point): boolean {
    const minX = Math.min(line.head.x, line.tail.x);
    const maxX = Math.max(line.head.x, line.tail.x);
    const minY = Math.min(line.head.y, line.tail.y);
    const maxY = Math.max(line.head.y, line.tail.y);

    return (minX <= point.x && point.x <= maxX) && 
           (minY <= point.y && point.y <= maxY);
}

export function doLinesIntersect(line1: Line, line2: Line): boolean {
    const o1 = getOrientation(line1, line2.head);
    const o2 = getOrientation(line1, line2.tail);
    const o3 = getOrientation(line2, line1.head);
    const o4 = getOrientation(line2, line1.tail);

    // General case
    if (o1 !== o2 && o3 !== o4) return true;

    // Special Cases - Points are collinear
    if (o1 === Orientation.COLLINEAR && isPointOnLine(line1, line2.head)) return true;
    if (o2 === Orientation.COLLINEAR && isPointOnLine(line1, line2.tail)) return true;
    if (o3 === Orientation.COLLINEAR && isPointOnLine(line2, line1.head)) return true;
    if (o4 === Orientation.COLLINEAR && isPointOnLine(line2, line1.tail)) return true;

    return false;
}

export function isPointInGrid(point: Point, gridSize: number): boolean {
    return 0 <= point.x && point.x <= gridSize && 
           0 <= point.y && point.y <= gridSize;
}

export function distance(p1: Point, p2: Point): number {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

export function lineLength(line: Line): number {
    const dx = Math.abs(line.head.x - line.tail.x);
    const dy = Math.abs(line.head.y - line.tail.y);
    return Math.sqrt(dx * dx + dy * dy);
}

export function isVertical(line: Line): boolean {
    return line.head.x === line.tail.x;
}

export function isHorizontal(line: Line): boolean {
    return line.head.y === line.tail.y;
}

export function evalLineAtX(line: Line, x: number): number {
    if (line.head.x === line.tail.x) return Infinity;
    
    // Using similar triangles: (y - y1)/(x - x1) = (y2 - y1)/(x2 - x1)
    return line.head.y + (line.tail.y - line.head.y) * 
           (x - line.head.x) / (line.tail.x - line.head.x);
}

export function evalLineAtY(line: Line, y: number): number {
    if (line.head.y === line.tail.y) return Infinity;
    
    // Using similar triangles: (x - x1)/(y - y1) = (x2 - x1)/(y2 - y1)
    return line.head.x + (line.tail.x - line.head.x) * 
           (y - line.head.y) / (line.tail.y - line.head.y);
}

export function findGridIntersectionPoints(line: Line, gridSize: number): [Point, Point] {
    const pointsOnGridEdge = new Set<string>();
    
    const points: Point[] = [
        { x: 0, y: evalLineAtX(line, 0) },
        { x: gridSize, y: evalLineAtX(line, gridSize) },
        { x: evalLineAtY(line, 0), y: 0 },
        { x: evalLineAtY(line, gridSize), y: gridSize }
    ];

    const uniquePoints: Point[] = [];
    points.forEach(point => {
        if (isPointInGrid(point, gridSize)) {
            const pointStr = `${point.x},${point.y}`;
            if (!pointsOnGridEdge.has(pointStr)) {
                pointsOnGridEdge.add(pointStr);
                uniquePoints.push(point);
            }
        }
    });

    if (uniquePoints.length !== 2) {
        console.log(line);
        console.log('-------');
        console.log(pointsOnGridEdge);
        throw new Error('Line must intersect grid boundary at exactly two points');
    }

    return [uniquePoints[0], uniquePoints[1]];
}

function gcd(a: number, b: number): number {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
        [a, b] = [b, a % b];
    }
    return a;
}

function getSmallestIntegerVector(line: Line): [number, number] {
    const dx = line.tail.x - line.head.x;
    const dy = line.tail.y - line.head.y;
    const divisor = dx !== 0 && dy !== 0 ? gcd(Math.abs(dx), Math.abs(dy)) : Math.max(Math.abs(dx), Math.abs(dy));
    return [dx / divisor, dy / divisor];
}

export function getLatticePointsAlongLine(line: Line, gridSize: number): Set<Point> {
    const [dx, dy] = getSmallestIntegerVector(line);
    const points = new Set<Point>();

    // Start from head, go backwards until grid edge
    let current = { x: line.head.x, y: line.head.y };
    while (isPointInGrid(current, gridSize)) {
        points.add({ ...current });
        current = { x: current.x - dx, y: current.y - dy };
    }

    // Start from head, go forwards until grid edge
    current = { x: line.head.x, y: line.head.y };
    while (isPointInGrid(current, gridSize)) {
        points.add({ ...current });
        current = { x: current.x + dx, y: current.y + dy };
    }

    return points;
}

export function findIntersectionPoint(line1: Line, line2: Line, checkedIntersection: boolean = false): Point | null {
    // First check if lines intersect
    if (!checkedIntersection && !doLinesIntersect(line1, line2)) return null;

    // Get line coefficients (ax + by = c)
    const a1 = line1.tail.y - line1.head.y;
    const b1 = line1.head.x - line1.tail.x;
    const c1 = a1 * line1.head.x + b1 * line1.head.y;

    const a2 = line2.tail.y - line2.head.y;
    const b2 = line2.head.x - line2.tail.x;
    const c2 = a2 * line2.head.x + b2 * line2.head.y;

    // Calculate determinant
    const determinant = a1 * b2 - a2 * b1;
    
    // If determinant is 0, lines are parallel or coincident
    if (determinant === 0) {
        // For collinear segments that overlap, return midpoint of overlap
        if (isPointOnLine(line1, line2.head)) return line2.head;
        if (isPointOnLine(line1, line2.tail)) return line2.tail;
        if (isPointOnLine(line2, line1.head)) return line1.head;
        if (isPointOnLine(line2, line1.tail)) return line1.tail;
        return null;
    }

    // Calculate intersection point
    const x = (b2 * c1 - b1 * c2) / determinant;
    const y = (a1 * c2 - a2 * c1) / determinant;

    return { x, y };
}

export function perpendicularThroughPoint(line: Line, point: Point): Line {
    const vecX = line.tail.x - line.head.x;
    const vecY = line.tail.y - line.head.y;
    
    // Perpendicular vector is (-y, x)
    const perpVecX = -vecY;
    const perpVecY = vecX;
    
    return {
        head: point,
        tail: {
            x: point.x + perpVecX,
            y: point.y + perpVecY
        }
    };
}

// Function to make points hashable (for Set operations)
export function pointToString(p: Point): string {
    return `${p.x},${p.y}`;
}

// Function to convert string back to point
export function stringToPoint(s: string): Point {
    const [x, y] = s.split(',').map(Number);
    return { x, y };
}