<!-- src/lib/crossingPaths/components/MonteCarloSimulation/MonteCarloSimulation.svelte -->
<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    
    let sketchInstance: any = null;
    let container: HTMLElement;
    let stats = {
        totalSamples: 0,
        intersectingPairs: 0,
        probability: 0
    };
    let gridSize = 4;

    onMount(async () => {
        if (browser && container) {
            const { createSketchWrapper } = await import('$lib/utils/createSketchWrapper');
            const { createMonteCarloSketch } = await import('./sketch');
            
            const sketch = createMonteCarloSketch();
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

    const handleAddSamples = () => {
        if (sketchInstance?.addSamples) {
            sketchInstance.addSamples();
            updateStats();
        }
    };

    const handleReset = () => {
        if (sketchInstance?.reset) {
            sketchInstance.reset();
            updateStats();
        }
    };

    const updateStats = () => {
        if (sketchInstance?.getStats) {
            stats = sketchInstance.getStats();
        }
        if (sketchInstance?.getGridSize) {
            gridSize = sketchInstance.getGridSize();
        }
    };

    const handleIncreaseGrid = () => {
        if (sketchInstance?.increaseGridSize) {
            sketchInstance.increaseGridSize();
            updateStats();
        }
    };

    const handleDecreaseGrid = () => {
        if (sketchInstance?.decreaseGridSize) {
            sketchInstance.decreaseGridSize();
            updateStats();
        }
    };

    $: probability = (stats.probability * 100).toFixed(1);
</script>

<div class="simulation-container">
    <div class="canvas-container" bind:this={container}></div>
    
    <div class="stats-container">
        <div class="stat-group">
            <span class="stat-label">Grid Size:</span>
            <span class="stat-value">{gridSize} × {gridSize}</span>
        </div>
        <div class="stat-group">
            <span class="stat-label">Total Samples:</span>
            <span class="stat-value">{stats.totalSamples}</span>
        </div>
        <div class="stat-group">
            <span class="stat-label">Intersecting Pairs:</span>
            <span class="stat-value">{stats.intersectingPairs}</span>
        </div>
        <div class="stat-group">
            <span class="stat-label">Probability:</span>
            <span class="stat-value">{probability}%</span>
        </div>
    </div>

    <div class="controls">
        <div class="control-group">
            <button on:click={handleDecreaseGrid}>Grid Size -</button>
            <button on:click={handleIncreaseGrid}>Grid Size +</button>
        </div>
        <div class="control-group">
            <button on:click={handleAddSamples}>Add 100 Samples</button>
            <button on:click={handleReset}>Reset</button>
        </div>
    </div>
</div>

<style>
    .simulation-container {
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
    }

    .stats-container {
        display: flex;
        gap: 2rem;
        flex-wrap: wrap;
        justify-content: center;
        font-family: "Poppins", sans-serif;
    }

    .stat-group {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.25rem;
    }

    .stat-label {
        font-size: 0.9rem;
        color: #666;
    }

    .stat-value {
        font-size: 1.2rem;
        font-weight: 500;
        color: #000;
    }

    .controls {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        justify-content: center;
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

    button:hover {
        opacity: 0.9;
    }

    @media (max-width: 768px) {
        .canvas-container {
            max-width: 100%;
            margin: 0 1rem;
        }

        .stats-container {
            gap: 1rem;
        }

        .stat-group {
            min-width: 120px;
        }
    }
</style>