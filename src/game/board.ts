import type { Row } from "./tile.ts";

export const chunkSize = 32;

export interface Chunk {
    x: number;
    y: number;
    rows: Row[];
}

export interface Board {
    chunks: Chunk[];
}

