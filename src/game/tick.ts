import type { GameState } from "./gameState.ts";
import { tilesPerChunk, worldToChunk } from "../util/tileConstants";
import type { WorldPosition } from "../util/tile";
import type { Chunk } from "../util/world/tile";

function getChunk(game: GameState, position: WorldPosition) {
    return game.board.getChunk(Math.floor(worldToChunk(position.x)), Math.floor(worldToChunk(position.y)));
}

const chunkLoadTime = 10;

const offsets = [
    [ 1, 0 ],
    [ -1, 0 ],
    [ 0, 1 ],
    [ 0, -1 ],
    [ 1, 1 ],
    [ -1, -1 ],
    [ 1, -1 ],
    [ -1, 1 ]
];

function getLoadedChunks(game: GameState, deltaSeconds: number) {
    const loadedChunks = new Set<Chunk>();
    for (const bot of game.botManager.bots.values()) {
        const currentChunk = getChunk(game, bot.position);
        for (const [ chunk, seconds ] of bot.chunkSeconds) {
            const remaining = seconds - deltaSeconds;
            if (remaining <= 0)
                bot.chunkSeconds.delete(chunk);
            else
                bot.chunkSeconds.set(chunk, remaining);
        }
        bot.chunkSeconds.set(currentChunk, chunkLoadTime);
        loadedChunks.add(currentChunk);
        for (const [ x, y ] of offsets) {
            const chunk = game.board.getChunk(currentChunk.x + x, currentChunk.y + y);
            bot.chunkSeconds.set(chunk, chunkLoadTime);
            loadedChunks.add(chunk);
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
