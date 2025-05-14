import { chunkSize } from "./tileConstants.ts";
import ChunkStore from "./chunkStore.ts";

export function getChunkRemainder(coord: number) {
    return coord >= 0 ? coord % chunkSize : chunkSize - Math.abs(coord) % chunkSize;
}

export class Board {
    private readonly chunkStore = new ChunkStore();

    getChunk(x: number, y: number) {
        return this.chunkStore.get(x, y);
    }

    getChunkAt(worldX: number, worldY: number) {
        return this.getChunk(Math.floor(worldX / chunkSize), Math.floor(worldY / chunkSize));
    }

    getTile(x: number, y: number) {
        return this.getChunkAt(x, y).getTile(getChunkRemainder(x), getChunkRemainder(y));
    }
}

