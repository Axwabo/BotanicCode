import ChunkStore from "./chunkStore.js";
import { chunkSize, getChunkRemainder } from "../tileConstants.js";

export class Board {
    chunkStore = new ChunkStore();

    /**
     * @param x {number}
     * @param y {number}
     * @return {Chunk}
     */
    getChunk(x, y) {
        return this.chunkStore.get(x, y);
    }

    /**
     * @param tileX {number}
     * @param tileY {number}
     * @return {Chunk}
     */
    getChunkAt(tileX, tileY) {
        return this.getChunk(Math.floor(tileX / chunkSize), Math.floor(tileY / chunkSize));
    }

    /**
     * @param x {number}
     * @param y {number}
     * @return {Tile}
     */
    getTile(x, y) {
        return this.getChunkAt(x, y).getTile(getChunkRemainder(x), getChunkRemainder(y));
    }
}

