import ChunkStore from "./chunkStore.js";
import { getChunkRemainder, tilesPerChunk, worldToTile } from "../tileConstants.js";

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
        return this.getChunk(Math.floor(tileX / tilesPerChunk), Math.floor(tileY / tilesPerChunk));
    }

    /**
     * @param x {number}
     * @param y {number}
     * @return {Tile}
     */
    getTile(x, y) {
        return this.getChunkAt(x, y).getTile(getChunkRemainder(x), getChunkRemainder(y));
    }

    /**
     * @param x {number}
     * @param y {number}
     * @return {Tile}
     */
    getTileAt(x, y) {
        return this.getTile(Math.floor(worldToTile(x)), Math.floor(worldToTile(y)));
    }
}

