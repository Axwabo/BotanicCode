import { Chunk } from "./tile.ts";
import { chunkSize } from "./tileConstants.ts";

const sixteenBits = (1 << 16) - 1;

export class Board {
    private readonly chunkMap = new Map<number, Chunk>();

    getChunk(x: number, y: number) {
        const id = x & sixteenBits | x << 16 & sixteenBits;
        const existing = this.chunkMap.get(id);
        if (existing)
            return existing;
        const newChunk = new Chunk(x, y);
        this.chunkMap.set(id, newChunk);
        return newChunk;
    }

    getTile(x: number, y: number) {
        return this.getChunk(Math.floor(x / chunkSize), Math.floor(y / chunkSize))
        .getTile(x % chunkSize, y % chunkSize);
    }

    get chunks(): MapIterator<Chunk> {
        return this.chunkMap.values();
    }
}

