import type { GameState } from "./gameState.ts";
import { tilesPerChunk, worldToChunk } from "../util/tileConstants";
import type { Tile, WorldPosition } from "../util/tile";
import { editorHandler } from "./events/editorHandler.ts";
import TileUpdatedEvent from "../util/world/events/tileUpdated";

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

function refreshLoadedChunks(game: GameState, deltaSeconds: number) {
    const loadedChunks = game.loadedChunks;
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
}

function updateDirt(game: GameState, tile: Tile, deltaSeconds: number) {
    const left = game.board.getTile(tile.x - 1, tile.y).type === "grass";
    const right = game.board.getTile(tile.x + 1, tile.y).type === "grass";
    const up = game.board.getTile(tile.x, tile.y - 1).type === "grass";
    const down = game.board.getTile(tile.x - 1, tile.y + 1).type === "grass";
    const chance = (+left + +right + +up + +down) * 0.01 * deltaSeconds;
    if (Math.random() >= chance)
        return false;
    tile.type = "grass";
    return true;
}

export default function tick(game: GameState, deltaSeconds: number) {
    refreshLoadedChunks(game, deltaSeconds);
    for (const entity of Array.from(game.board.entities)) {
        const chunk = getChunk(game, entity.position);
        if (game.loadedChunks.has(chunk))
            entity.tick(deltaSeconds);
    }
    game.botManager.tick(deltaSeconds);
    for (const chunk of game.loadedChunks)
        for (let x = 0; x < tilesPerChunk; x++)
            for (let y = 0; y < tilesPerChunk; y++) {
                const tile = chunk.getTile(x, y);
                let updated = false;
                if (tile.data && "tick" in tile.data)
                    updated ||= !!tile.data.tick(deltaSeconds);
                else if (tile.type === "dirt")
                    updated ||= updateDirt(game, tile, deltaSeconds);
                if (updated)
                    editorHandler.dispatchEvent(new TileUpdatedEvent(tile));
            }

}
