import type BotManager from "./botManager.ts";
import type { WorldPosition } from "../util/tile";
import type ManagedBoard from "./managedBoard.ts";
import type { Chunk } from "../util/world/tile";

export interface GameState {
    board: ManagedBoard;
    position: WorldPosition;
    zoom: number;
    botManager: BotManager;
    loadedChunks: Set<Chunk>;
}
