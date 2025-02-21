<script lang="ts">
    import katex from 'katex';
    import { onMount } from 'svelte';
    
    export let math: string;
    export let display: boolean = false;
    export let replaceBraces: boolean = true;
    
    let element: HTMLSpanElement;
    
    function replaceAngleBrackets(text: string): string {
        if (!replaceBraces) return text;
        
        return text.replaceAll('<', '{').replaceAll('>', '}');
    }
    
    $: mathText = replaceAngleBrackets(math);
    
    $: if (element && math) {
        katex.render(mathText, element, {
            displayMode: display,
            throwOnError: false
        });
    }
</script>

<span bind:this={element}></span>