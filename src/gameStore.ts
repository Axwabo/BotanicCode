import { defineStore } from "pinia";

interface Renderer {
    canvas: HTMLCanvasElement
    context: CanvasRenderingContext2D
}

interface State {
    renderer: Renderer | undefined
}

const useGameStore = defineStore("game", {
    state: (): State => ({ renderer: undefined })
});

export default useGameStore;
