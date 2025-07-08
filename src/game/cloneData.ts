import type { GrowingPlant, TileData } from "../util/tile";

export default function cloneData(data?: TileData): TileData | Omit<GrowingPlant, "tick" | "growthPercentage"> | undefined {
    if (!data)
        return undefined;
    switch (data.type) {
        case "chargingStation":
            return { type: "chargingStation" };
        case "wheat":
            return { type: "wheat", ageSeconds: data.ageSeconds };
        case "carrot":
            return { type: "carrot", ageSeconds: data.ageSeconds };
        case "potato":
            return { type: "potato", ageSeconds: data.ageSeconds };
        case "tomato":
            return { type: "tomato", ageSeconds: data.ageSeconds };
        case "strawberry":
            return { type: "strawberry", ageSeconds: data.ageSeconds };
        case "fence":
            return { type: "fence", posts: Array.from(data.posts) };
    }
}
