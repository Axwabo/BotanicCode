import { tileSize } from "../tileConstants.js";

/**
 * @param data {TileData}
 * @return {BoundingBox[]}
 */
export function getBoundingBoxes(data) {
    /** @type {BoundingBox[]} */
    const boxes = [];
    switch (data.type) {
        case "fence":
            boxes.push({
                x: tileSize * 0.5 - 3,
                y: tileSize * 0.25,
                width: 6,
                height: tileSize * 0.5
            });
            if (data.posts.includes("north"))
                boxes.push({
                    x: tileSize * 0.5 - 2,
                    y: 0,
                    width: 4,
                    height: tileSize * 0.25
                });
            if (data.posts.includes("east"))
                boxes.push({
                    x: tileSize * 0.5,
                    y: tileSize * 0.5 - 3,
                    width: tileSize * 0.5,
                    height: 6
                });
            if (data.posts.includes("south"))
                boxes.push({
                    x: tileSize * 0.5 - 2,
                    y: tileSize * 0.75,
                    width: 4,
                    height: tileSize * 0.25
                });
            if (data.posts.includes("west"))
                boxes.push({
                    x: 0,
                    y: tileSize * 0.5 - 3,
                    width: tileSize * 0.5,
                    height: 6
                });
            break;
    }
    return boxes;
}
