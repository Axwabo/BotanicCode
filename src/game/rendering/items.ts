import type { DroppedItem } from "../../bot/sdk/items";
import { fillCircle, outlineText } from "./shapes.ts";
import { tileSize } from "../../util/tileConstants";
import { carrot, potato, strawberry, tomato } from "./colors.ts";

const wheat = "#ddbb49";

export default function drawItem(ctx: CanvasRenderingContext2D, item: DroppedItem) {
    ctx.font = "12px Arial";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.lineWidth = 2;
    const { x, y } = item.position;
    outlineText(ctx, `x${item.amount}`, x + tileSize * 0.5, y);
    switch (item.type) {
        case "wheat":
            ctx.strokeStyle = wheat;
            ctx.beginPath();
            ctx.moveTo(x + tileSize * 0.2, y + tileSize * 0.25);
            ctx.lineTo(x - tileSize * 0.2, y - tileSize * 0.25);
            ctx.moveTo(x + tileSize * 0.2, y + tileSize * 0.35);
            ctx.lineTo(x - tileSize * 0.2, y - tileSize * 0.15);
            ctx.moveTo(x + tileSize * 0.2, y + tileSize * 0.15);
            ctx.lineTo(x - tileSize * 0.2, y - tileSize * 0.35);
            ctx.stroke();
            break;
        case "carrot":
            ctx.fillStyle = carrot;
            ctx.beginPath();
            ctx.moveTo(x + tileSize * 0.2, y + tileSize * 0.2);
            ctx.lineTo(x + tileSize * 0.1, y - tileSize * 0.2);
            ctx.lineTo(x - tileSize * 0.1, y - tileSize * 0.1);
            ctx.closePath();
            ctx.fill();
            break;
        case "potato":
            ctx.fillStyle = potato;
            fillCircle(ctx, x, y, 6);
            break;
        case "tomato":
            ctx.fillStyle = tomato;
            fillCircle(ctx, x, y, 5);
            break;
        case "strawberry":
            ctx.fillStyle = strawberry;
            ctx.beginPath();
            ctx.moveTo(x + tileSize * 0.1, y + tileSize * 0.1);
            ctx.lineTo(x + tileSize * 0.2, y - tileSize * 0.1);
            ctx.lineTo(x - tileSize * 0.2, y - tileSize * 0.1);
            ctx.closePath();
            ctx.fill();
            break;
        case "wheatSeed":
            ctx.fillStyle = wheat;
            seeds(ctx, x, y);
            break;
        case "tomatoSeed":
            ctx.fillStyle = tomato;
            seeds(ctx, x, y);
            break;
        case "strawberrySeed":
            ctx.fillStyle = strawberry;
            seeds(ctx, x, y);
            break;
    }
}

function seeds(ctx: CanvasRenderingContext2D, x: number, y: number) {
    fillCircle(ctx, x + tileSize * 0.2, y, 1);
    fillCircle(ctx, x, y - tileSize * 0.1, 1);
    fillCircle(ctx, x - tileSize * 0.2, y + tileSize * 0.1, 1);
}
