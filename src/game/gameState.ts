import type BotManager from "./botManager.ts";
import type { WorldPosition } from "../util/tile";
import type ManagedBoard from "./managedBoard.ts";

export interface GameState {
    board: ManagedBoard;
    position: WorldPosition;
    botManager: BotManager;
}
