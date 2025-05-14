import { chunkSize, type TileType } from "./tileConstants.ts";
import type { TileData } from "./tileData.ts";

const defaultTileType: TileType = "grass";

export interface Tile {
    row: Row;
    rowX: number;
    worldX: number;
    worldY: number;
    type: TileType;
    data?: TileData
}

export class Row {
    readonly chunk: Chunk;
    readonly chunkY: number;
    readonly tiles: Tile[] = [];

    constructor(chunk: Chunk, y: number) {
        this.chunk = chunk;
        this.chunkY = y;
        for (let x = 0; x < chunkSize; x++)
            this.tiles.push({ row: this, rowX: x, worldX: this.chunk.worldX + x, worldY: this.worldY, type: defaultTileType });
    }

    get worldY() {
        return this.chunk.worldY + this.chunkY;
    }

    getTile(x: number) {
        return this.tiles[x];
    }
}

export class Chunk {
    readonly rows: Row[] = [];
    readonly x: number;
    readonly y: number;

    constructor(x: number, y: number) {
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

    getTile(x: number, y: number) {
        return this.rows[y].getTile(x);
    }
}
