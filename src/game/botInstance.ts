import type { WorldPosition } from "../util/tile";
import { tileSize } from "../util/tileConstants";

export const radius = tileSize * 0.4;

export interface BotInstance {
    name: string;
    position: WorldPosition;
}
