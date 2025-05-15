import { type TileType } from "./tileType.ts";
import type { TileData } from "./tileData.ts";
import { chunkSize } from "../util/tileConstants";

const defaultTileType: TileType = "grass";

export interface Tile {
    x: number;
    y: number;
    type: TileType;
    data?: TileData
}

export class Row {
    readonly tiles: Tile[] = [];

    constructor(chunk: Chunk, y: number) {
        for (let x = 0; x < chunkSize; x++)
            this.tiles.push({ x: chunk.worldX + x, y: chunk.worldY + y, type: defaultTileType });
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
