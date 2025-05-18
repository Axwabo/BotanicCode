import type { TileData } from "../util/tile";

export default function cloneData(data?: TileData): TileData | undefined {
    if (!data)
        return undefined;
    switch (data.type) {
        case "fence":
            return { type: "fence", posts: Array.from(data.posts) };
    }
}
