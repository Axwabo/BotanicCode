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
            break;
    }
    return boxes;
}
