import { Chunk } from "./tile.ts";

interface ChunkRow {
    positive: Chunk[];
    negative: Chunk[];
}

function index(i: number) {
    return i < 0 ? -i - 1 : i;
}

export default class ChunkStore {
    private readonly positiveRows: ChunkRow[] = [];
    private readonly negativeRows: ChunkRow[] = [];

    get(x: number, y: number) {
        const rows = y < 0 ? this.negativeRows : this.positiveRows;
        const row = rows[index(y)] ??= { positive: [], negative: [] };
        return (x < 0 ? row.negative : row.positive)[index(x)] ??= new Chunk(x, y);
    }
}
