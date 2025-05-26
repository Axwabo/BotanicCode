import type { GameState } from "./gameState.ts";

export default function tick(game: GameState, deltaSeconds: number) {
    for (const entity of game.board.entities)
        entity.tick(deltaSeconds);
}
