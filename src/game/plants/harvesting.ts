import type { ItemType } from "../../bot/sdk/items";
import type { GrowingPlant, PlantType, Tile, TileData } from "../../util/tile";

interface HarvestResult {
    item: ItemType;
    multiplier: number;
    minimum?: number;
}

export function isPlant(data: TileData): data is GrowingPlant {
    return "growthPercentage" in data;
}

export function getDrops(tile: Tile): Record<ItemType, number> | undefined {
    if (!tile.data || !isPlant(tile.data))
        return;
    const result = dropsPerPlant[tile.data.type];
    if (!result)
        return;
    const drops = result instanceof Array ? result : [ result ];
    const items: Record<ItemType, number> = {};
    for (const drop of drops)
        items[drop.item] = Math.max(drop.minimum ?? 0, Math.floor(tile.data.growthPercentage * drop.multiplier));
    return items;
}

const dropsPerPlant: Record<PlantType, HarvestResult | HarvestResult[]> = {
    wheat: [
        {
            item: "wheatSeed",
            multiplier: 0,
            minimum: 1
        },
        {
            item: "wheat",
            multiplier: 5
        }
    ],
    tomato: [
        {
            item: "tomatoSeed",
            multiplier: 0,
            minimum: 1
        },
        {
            item: "tomato",
            multiplier: 3
        }
    ],
    strawberry: [
        {
            item: "strawberrySeed",
            multiplier: 0,
            minimum: 1
        },
        {
            item: "strawberry",
            multiplier: 3
        }
    ],
    potato: {
        item: "potato",
        minimum: 1,
        multiplier: 5
    },
    carrot: {
        item: "carrot",
        minimum: 1,
        multiplier: 3
    }
};
