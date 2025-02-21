<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    
    let sketchInstance: any = null;
    let container: HTMLElement;

    onMount(async () => {
        if (browser && container) {
            const { createSketchWrapper } = await import('../../../utils/createSketchWrapper');
            const { createPathIntersectionsSketch } = await import('./sketch');
            
            const sketch = createPathIntersectionsSketch();
            const wrapper = createSketchWrapper(sketch, {
                maxWidth: 400,
                minHeight: 800,
            });
            
            sketchInstance = wrapper.mount(container);
        }
    });

    onDestroy(() => {
        if (sketchInstance) {
            sketchInstance.remove();
        }
    });

    const handleIncrease = () => {
        if (sketchInstance?.increaseGridSize) {
            sketchInstance.increaseGridSize();
        }
    };

    const handleDecrease = () => {
        if (sketchInstance?.decreaseGridSize) {
            sketchInstance.decreaseGridSize();
        }
    };
</script>

<div class="sketch-container">
    <div class="canvas-container" bind:this={container}></div>
    <div class="caption">
        Top grid is P and the bottom grid is LP. Hover over the bottom grid to see the corresponding line pair.
    </div>
    <div class="controls">
        <div class="control-group">
            <button on:click={handleDecrease}>Grid Size -</button>
            <button on:click={handleIncrease}>Grid Size +</button>
        </div>
    </div>
</div>

<style>
    .sketch-container {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }

    .canvas-container {
        width: 400px;
        height: 800px;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        background: #000;
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
    }

    button:hover {
        opacity: 0.9;
    }

    .caption {
        font-family: "Poppins", sans-serif;
        font-size: 1rem;
        color: #b3b3b3;
        text-align: center;
        max-width: 400px;
        line-height: 1.5;
    }

    /* Media query for smaller screens */
    @media (max-width: 768px) {
        .canvas-container {
            max-width: 100%;
            margin: 0 1rem;
        }
    }
</style>