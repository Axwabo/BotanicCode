import type { Entity } from "../../bot/sdk/entities";
import { isInRange } from "../../util/distance";
import { energyBar, fillCircle } from "./shapes.ts";
import type { ManagedEntity } from "../entities/interfaces.ts";
import type { Tool } from "../editor/editorTypes.ts";
import { worldToChunk } from "../../util/tileConstants";
import { beak as beakColor, chicken, comb as combColor, cow, horns as hornsColor, pig, sheep, snout as snoutColor } from "./colors.ts";

export function drawEntities(ctx: CanvasRenderingContext2D, entities: Set<ManagedEntity>, startX: number, startY: number, endX: number, endY: number, pointerWorldX: number, pointerWorldY: number, tool: Tool) {
    for (const entity of entities) {
        const chunkX = worldToChunk(entity.position.x);
        const chunkY = worldToChunk(entity.position.y);
        if (chunkX >= startX - 0.5 && chunkX <= endX + 0.5 && chunkY >= startY - 0.5 && chunkY <= endY + 0.5)
            drawEntity(ctx, entity, pointerWorldX, pointerWorldY, tool === "Inspector");
    }
}

function entityCircle(ctx: CanvasRenderingContext2D, entity: Entity, x: number, y: number) {
    switch (entity.type) {
        case "cow":
            ctx.fillStyle = cow;
            break;
        case "pig":
            ctx.fillStyle = pig;
            break;
        case "sheep":
            ctx.fillStyle = sheep;
            break;
        case "chicken":
            ctx.fillStyle = chicken;
            break;
    }
    fillCircle(ctx, x, y, entity.radius);
}

function horns(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) {
    ctx.fillStyle = hornsColor;
    ctx.fillRect(x - 12, y - radius * 0.5, 4, -15);
    ctx.fillRect(x + 8, y - radius * 0.5, 4, -15);
}

function snout(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.fillStyle = snoutColor;
    ctx.beginPath();
    ctx.arc(x - 7, y, 4, 0, Math.PI * 2);
    ctx.arc(x + 7, y, 4, 0, Math.PI * 2);
    ctx.fill();
}

function beak(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.fillStyle = beakColor;
    ctx.beginPath();
    ctx.moveTo(x - 3, y);
    ctx.lineTo(x + 3, y);
    ctx.lineTo(x, y + 3);
    ctx.closePath();
    ctx.fill();
}

function comb(ctx: CanvasRenderingContext2D, x: number, y: number, entity: Entity) {
    ctx.fillStyle = combColor;
    ctx.beginPath();
    ctx.moveTo(x, y - entity.radius);
    ctx.lineTo(x, y - entity.radius - 4);
    ctx.lineTo(x - 3, y - entity.radius + 2);
    ctx.lineTo(x - 3, y - entity.radius - 4);
    ctx.lineTo(x - 6, y - entity.radius + 4);
    ctx.closePath();
    ctx.fill();
}

function drawEntity(ctx: CanvasRenderingContext2D, entity: Entity, pointerWorldX: number, pointerWorldY: number, overlay: boolean) {
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
