import MovableEntity from "./movableEntity.ts";
import type { EntityType } from "../../bot/sdk/entities";
import { tileSize } from "../../util/tileConstants";

export default class Cow extends MovableEntity<Cow> {
    readonly type: EntityType = "cow";
    readonly radius: number = tileSize * 0.8;
}
