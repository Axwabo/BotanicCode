import type { GameState } from "./gameState.ts";
import { tilesPerChunk, worldToChunk } from "../util/tileConstants";
import type { WorldPosition } from "../util/tile";
import type { Chunk } from "../util/world/tile";

function getChunk(game: GameState, position: WorldPosition) {
    return game.board.getChunk(Math.floor(worldToChunk(position.x)), Math.floor(worldToChunk(position.y)));
}

function getLoadedChunks(game: GameState, deltaSeconds: number) {
    const loadedChunks = new Set<Chunk>();
    for (const bot of game.botManager.bots.values()) {
        const currentChunk = getChunk(game, bot.position);
        bot.chunkSeconds.set(currentChunk, 10);
        loadedChunks.add(currentChunk);
        loadedChunks.add(game.board.getChunk(currentChunk.x + 1, currentChunk.y));
        loadedChunks.add(game.board.getChunk(currentChunk.x - 1, currentChunk.y));
        loadedChunks.add(game.board.getChunk(currentChunk.x, currentChunk.y + 1));
        loadedChunks.add(game.board.getChunk(currentChunk.x, currentChunk.y - 1));
        for (const [ chunk, seconds ] of bot.chunkSeconds) {
            if (chunk === currentChunk)
                continue;
            const remaining = seconds - deltaSeconds;
            if (remaining <= 0)
                bot.chunkSeconds.delete(chunk);
            else
                bot.chunkSeconds.set(chunk, remaining);

        }
    }
    return loadedChunks;
}

export default function tick(game: GameState, deltaSeconds: number) {
    const loadedChunks = getLoadedChunks(game, deltaSeconds);
    for (const entity of game.board.entities) {
        const chunk = getChunk(game, entity.position);
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
