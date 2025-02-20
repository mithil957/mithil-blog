<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    
    let sketchInstance: any = null;
    let container: HTMLElement;
    let gridSize = 3;

    onMount(async () => {
        if (browser && container) {
            const { createSketchWrapper } = await import('$lib/utils/createSketchWrapper');
            const { createPolygonMethodSketch } = await import('./sketch');
            
            const sketch = createPolygonMethodSketch();
            const wrapper = createSketchWrapper(sketch, {
                maxWidth: 600,
                minHeight: 400
            });
            
            sketchInstance = wrapper.mount(container);
        }
    });

    onDestroy(() => {
        if (sketchInstance) {
            sketchInstance.remove();
        }
    });

    const handleGenerateNewLine = () => {
        if (sketchInstance?.generateNewLine) {
            sketchInstance.generateNewLine();
        }
    };

    const handleIncreaseGrid = () => {
        if (sketchInstance?.increaseGridSize) {
            sketchInstance.increaseGridSize();
            gridSize++;
        }
    };

    const handleDecreaseGrid = () => {
        if (sketchInstance?.decreaseGridSize) {
            sketchInstance.decreaseGridSize();
            gridSize--;
        }
    };
</script>

<div class="polygon-method-container">
    <div class="canvas-container" bind:this={container}></div>
    
    <div class="instruction-text">
        Click on any grid point to see the possible intersection points
    </div>

    <div class="controls">
        <div class="control-group">
            <button 
                on:click={handleDecreaseGrid}
                disabled={gridSize <= 5}>
                Grid Size -
            </button>
            <button 
                on:click={handleIncreaseGrid}
                disabled={gridSize >= 30}>
                Grid Size +
            </button>
        </div>
        <button on:click={handleGenerateNewLine}>Generate Line Segment</button>
    </div>
</div>

<style>
    .polygon-method-container {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
    }

    .canvas-container {
        width: 100%;
        max-width: 600px;
        aspect-ratio: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #000;
        cursor: crosshair;
    }

    .instruction-text {
        font-family: "Poppins", sans-serif;
        font-size: 1rem;
        color: #666;
        text-align: center;
    }

    .controls {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        justify-content: center;
        padding: 0.5rem;
    }

    .control-group {
        display: flex;
        gap: 0.5rem;
    }

    button {
        padding: 0.5rem 1rem;
        font-size: 1rem;
        cursor: pointer;
        background: #000;
        color: white;
        border: none;
        border-radius: 4px;
        font-family: "Poppins", sans-serif;
    }

    button:disabled {
        background: #666;
        cursor: not-allowed;
    }

    button:hover:not(:disabled) {
        opacity: 0.9;
    }

    @media (max-width: 768px) {
        .canvas-container {
            max-width: 100%;
            margin: 0 1rem;
        }
    }
</style>