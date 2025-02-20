<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    
    let sketchInstance: any = null;
    let container: HTMLElement;

    onMount(async () => {
        if (browser && container) {
            const { createSketchWrapper } = await import('../../../utils/createSketchWrapper');
            const { createGridPathsSketch } = await import('./sketch');
            
            const sketch = createGridPathsSketch();
            const wrapper = createSketchWrapper(sketch, {
                maxWidth: 600,  // Reduced max width
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

    const handleRegenerate = () => {
        if (sketchInstance?.regeneratePaths) {
            sketchInstance.regeneratePaths();
        }
    };
</script>

<div class="sketch-container">
    <div class="canvas-container" bind:this={container}></div>
    <div class="controls">
        <div class="control-group">
            <button on:click={handleDecrease}>Grid Size -</button>
            <button on:click={handleIncrease}>Grid Size +</button>
        </div>
        <button on:click={handleRegenerate}>Random Paths</button>
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
        width: 100%;
        max-width: 600px;  /* Match maxWidth from sketch config */
        aspect-ratio: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #000;  /* Match sketch background */
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

    /* Media query for smaller screens */
    @media (max-width: 768px) {
        .canvas-container {
            max-width: 100%;
            margin: 0 1rem;
        }
    }
</style>