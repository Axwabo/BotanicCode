import type { Entity } from "../../bot/sdk/entities";
import { isInRange } from "../../util/distance";
import { energyBar, fillCircle } from "./shapes.ts";

function entityCircle(ctx: CanvasRenderingContext2D, entity: Entity, x: number, y: number) {
    switch (entity.type) {
        case "cow":
            ctx.fillStyle = "#933d00";
            break;
        case "pig":
            ctx.fillStyle = "#f99";
            break;
        case "sheep":
            ctx.fillStyle = "#ddd";
            break;
        case "chicken":
            ctx.fillStyle = "#dc862a";
            break;
    }
    fillCircle(ctx, x, y, entity.radius);
}

function horns(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) {
    ctx.fillStyle = "#aaa";
    ctx.fillRect(x - 12, y - radius * 0.5, 4, -15);
    ctx.fillRect(x + 8, y - radius * 0.5, 4, -15);
}

function snout(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.fillStyle = "#a55";
    ctx.beginPath();
    ctx.arc(x - 7, y, 4, 0, Math.PI * 2);
    ctx.arc(x + 7, y, 4, 0, Math.PI * 2);
    ctx.fill();
}

function beak(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.fillStyle = "#e8d29d";
    ctx.beginPath();
    ctx.moveTo(x - 3, y);
    ctx.lineTo(x + 3, y);
    ctx.lineTo(x, y + 3);
    ctx.closePath();
    ctx.fill();
}

function comb(ctx: CanvasRenderingContext2D, x: number, y: number, entity: Entity) {
    ctx.fillStyle = "#f00";
    ctx.beginPath();
    ctx.moveTo(x, y - entity.radius);
    ctx.lineTo(x, y - entity.radius - 4);
    ctx.lineTo(x - 3, y - entity.radius + 2);
    ctx.lineTo(x - 3, y - entity.radius - 4);
    ctx.lineTo(x - 6, y - entity.radius + 4);
    ctx.closePath();
    ctx.fill();
}

export function drawEntity(ctx: CanvasRenderingContext2D, entity: Entity, pointerWorldX: number, pointerWorldY: number, overlay: boolean) {
    const { x, y } = entity.position;
    entityCircle(ctx, entity, x, y);
    switch (entity.type) {
        case "cow":
        case "sheep":
            horns(ctx, x, y, entity.radius);
            break;
        case "pig":
            snout(ctx, x, y);
            break;
        case "chicken":
            beak(ctx, x, y);
            comb(ctx, x, y, entity);
            break;
    }
    if (overlay && isInRange(x, y, pointerWorldX, pointerWorldY, entity.radius))
        energyBar(ctx, entity.energy, x, y, entity.radius);
}