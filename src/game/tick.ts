import type { GameState } from "./gameState.ts";
import { tilesPerChunk } from "../util/tileConstants";

export default function tick(game: GameState, deltaSeconds: number) {
    for (const entity of game.board.entities)
        entity.tick(deltaSeconds);
    const chunk = game.board.getChunk(0, 0); // TODO: refresh all loaded chunks
    for (let x = 0; x < tilesPerChunk; x++)
        for (let y = 0; y < tilesPerChunk; y++) {
            const tile = chunk.getTile(x, y);
            if (tile.data && "tick" in tile.data)
                tile.data.tick(deltaSeconds);
        }
}
