import { chunkSize } from "../tileConstants.js";

/** @type {TileType} */
const defaultTileType = "grass";


export class Row {
    /** @type {Tile[]} */
    tiles = [];

    constructor(chunk, y) {
        for (let x = 0; x < chunkSize; x++)
            this.tiles.push({ x: chunk.worldX + x, y: chunk.worldY + y, type: defaultTileType });
    }

    getTile(x) {
        return this.tiles[x];
    }
}

export class Chunk {
    /** @type {Row[]} */
    rows = [];
    /** @type {number} */
    x;
    /** @type {number} */
    y;

    /**
     * @param x {number}
     * @param y {number}
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
        for (let row = 0; row < chunkSize; row++)
            this.rows.push(new Row(this, row));
    }

    get worldX() {
        return this.x * chunkSize;
    }

    get worldY() {
        return this.y * chunkSize;
    }

    /**
     * @param x {number}
     * @param y {number}
     */
    getTile(x, y) {
        return this.rows[y].getTile(x);
    }
}
