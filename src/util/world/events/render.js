export default class RenderEvent extends Event {
    /** @type {number} */
    deltaTime;

    /** @param deltaTime {number} */
    constructor(deltaTime) {
        super("render");
        this.deltaTime = deltaTime;
    }
}
