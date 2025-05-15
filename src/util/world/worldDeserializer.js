import { Board } from "./board.js";
import { Chunk, Row } from "./tile.js";

// TODO: would it be more ideal to store plain objects and create functions to manipulate world data instead?

export default function createBoardFromJson(chunkStoreContent) {
    const deserialized = JSON.parse(chunkStoreContent);
    const board = new Board();
    board.chunkStore.negativeRows = deserialized.negativeRows.map(createChunkRow);
    board.chunkStore.positiveRows = deserialized.positiveRows.map(createChunkRow);
    return board;
}

/** @returns {ChunkRow} */
function createChunkRow(o) {
    return { positive: o.positive.map(createChunk), negative: o.negative.map(createChunk) };
}

function createChunk(o) {
    const chunk = new Chunk(o.x, o.y);
    chunk.rows = o.rows.map((e, i) => createRow(e, i, chunk));
    return chunk;
}

function createRow(o, i, chunk) {
    const row = new Row(chunk, i);
    row.tiles = o.tiles;
    return row;
}
