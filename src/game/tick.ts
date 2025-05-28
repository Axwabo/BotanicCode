import type { GameState } from "./gameState.ts";
import { tilesPerChunk, worldToChunk } from "../util/tileConstants";

export default function tick(game: GameState, deltaSeconds: number) {
    const { entities, loadedChunks } = game.board;
    for (const entity of entities) {
        const chunk = game.board.getChunk(Math.floor(worldToChunk(entity.position.x)), Math.floor(worldToChunk(entity.position.y)));
        if (loadedChunks.has(chunk))
            entity.tick(deltaSeconds);
    }
    for (const chunk of loadedChunks)
        for (let x = 0; x < tilesPerChunk; x++)
            for (let y = 0; y < tilesPerChunk; y++) {
                const tile = chunk.getTile(x, y);
                if (tile.data && "tick" in tile.data)
                    tile.data.tick(deltaSeconds);
            }
}
