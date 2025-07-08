import type { BotInstance } from "../botInstance.ts";
import type { Tool } from "../editor/editorTypes.ts";
import { energyBar, fillCircle, outlineText } from "./shapes.ts";
import { botRadius } from "../../bot/sdk/bot";
import { isInRange } from "../../util/distance";

export function drawBots(ctx: CanvasRenderingContext2D, bots: Map<string, BotInstance>, selectedBot: string, tool: Tool, pointerWorldX: number, pointerWorldY: number) {
    ctx.font = "20px monospace";
    ctx.textBaseline = "bottom";
    ctx.textAlign = "center";
    let highlightedBot: BotInstance | undefined = bots.get(selectedBot);
    for (const bot of bots.values()) {
        const { x, y } = bot.position;
        ctx.fillStyle = "white";
        drawBot(ctx, x, y);
        if (tool === "Inspector" && isInRange(x, y, pointerWorldX, pointerWorldY, botRadius))
            highlightedBot = bot;
    }
    if (highlightedBot)
        drawInfo(ctx, highlightedBot);
}

function drawBot(ctx: CanvasRenderingContext2D, x: number, y: number) {
    fillCircle(ctx, x, y, botRadius);
    ctx.fillStyle = "#777";
    ctx.strokeStyle = "#777";
    ctx.lineWidth = 3;
    fillCircle(ctx, x - 4, y - 3, 2);
    fillCircle(ctx, x + 4, y - 3, 2);
    ctx.beginPath();
    ctx.moveTo(x - botRadius * 0.75, y + 3);
    ctx.lineTo(x - botRadius, y + botRadius * 0.75);
    ctx.moveTo(x + botRadius * 0.75, y + 3);
    ctx.lineTo(x + botRadius, y + botRadius * 0.75);
    ctx.stroke();
}

function drawInfo(ctx: CanvasRenderingContext2D, highlightedBot: BotInstance) {
    const { name, position: { x, y } } = highlightedBot;
    outlineText(ctx, name, x, y - botRadius);
    ctx.font = "15px Arial";
    let drawY = y - botRadius - 22;
    for (const [ type, count ] of highlightedBot.inventory) {
        ctx.lineWidth = 3;
        outlineText(ctx, `${type} x${count}`, x, drawY);
        drawY -= 17;
    }
    energyBar(ctx, highlightedBot.energy, x, y, botRadius);
}
