import { Chunk } from "./tile.js";

function index(i) {
    return i < 0 ? -i - 1 : i;
}

export default class ChunkStore {
    /** @type {ChunkRow[]} */
    positiveRows = [];
    /** @type {ChunkRow[]} */
    negativeRows = [];

    /**
     * @param x {number}
     * @param y {number}
     * @return {Chunk}
     */
    get(x, y) {
        const rows = y < 0 ? this.negativeRows : this.positiveRows;
        const row = rows[index(y)] ??= { positive: [], negative: [] };
        return (x < 0 ? row.negative : row.positive)[index(x)] ??= new Chunk(x, y);
    }
}
