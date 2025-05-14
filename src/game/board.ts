import { Chunk } from "./tile.ts";
import { chunkSize } from "./tileConstants.ts";

const fourteenBits = (1 << 14) - 1;
const negativeX = 1 << 16;
const negatveY = 1 << 30;

export function getChunkRemainder(coord: number) {
    return coord >= 0 ? coord % chunkSize : chunkSize - Math.abs(coord) % chunkSize;
}

export class Board {
    private readonly chunkMap = new Map<number, Chunk>();

    getChunk(x: number, y: number) {
        let id = x & fourteenBits | x << 16 & fourteenBits;
        if (x < 0)
            id |= negativeX;
        if (y < 0)
            id |= negatveY;
        const existing = this.chunkMap.get(id);
        if (existing)
            return existing;
        const newChunk = new Chunk(x, y);
        this.chunkMap.set(id, newChunk);
        return newChunk;
    }

    getTile(x: number, y: number) {
        return this.getChunk(Math.floor(x / chunkSize), Math.floor(y / chunkSize))
        .getTile(getChunkRemainder(x), getChunkRemainder(y));
    }

    get chunks(): MapIterator<Chunk> {
        return this.chunkMap.values();
    }
}

