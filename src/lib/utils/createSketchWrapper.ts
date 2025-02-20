// src/lib/sketches/utils/createSketchWrapper.ts
import p5 from 'p5';

type SketchConfig = {
    maxWidth?: number;
    minHeight?: number;
}

type SketchMethods = Record<string, (...args: any[]) => void>;
type SketchInstance = p5 & SketchMethods;

export const createSketchWrapper = (
    sketch: (p: p5) => SketchMethods, 
    config: SketchConfig
) => {
    let instance: SketchInstance | null = null;
    
    const calculateDimensions = (container: HTMLElement) => {
        // Get the container's width and apply maxWidth constraint
        let width = Math.min(container.clientWidth, config.maxWidth || Infinity);
        
        // Make height equal to width for a square canvas
        let height = width;
        
        // Ensure minimum height
        height = Math.max(height, config.minHeight || 300);
        
        return { width, height };
    };

    const mount = (container: HTMLElement) => {
        if (instance) return instance;

        const sketchFn = (p: p5) => {
            p.setup = () => {
                const { width, height } = calculateDimensions(container);
                const canvas = p.createCanvas(width, height);
                
                // Center the canvas in the container
                canvas.parent(container);
                
                p.windowResized = () => {
                    const newDims = calculateDimensions(container);
                    p.resizeCanvas(newDims.width, newDims.height);
                };
            };

            // Get the sketch methods
            const sketchMethods = sketch(p);
            
            // Add methods to the p5 instance
            Object.assign(p, sketchMethods);
        };

        instance = new p5(sketchFn, container) as SketchInstance;
        return instance;
    };

    const unmount = () => {
        if (instance) {
            instance.remove();
            instance = null;
        }
    };

    return {
        mount,
        unmount
    };
};