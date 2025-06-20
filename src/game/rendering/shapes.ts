export function lightning(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.fillStyle = "#ffaf00";
    ctx.beginPath();
    ctx.moveTo(x + 5, y - 10);
    ctx.lineTo(x - 5, y);
    ctx.lineTo(x - 1, y + 2);
    ctx.lineTo(x - 5, y + 10);
    ctx.lineTo(x + 5, y - 2);
    ctx.lineTo(x + 1, y - 2);
    ctx.closePath();
    ctx.fill();
}

export function energyBar(ctx: CanvasRenderingContext2D, energy: number, x: number, y: number, radius: number) {
    lightning(ctx, x - 30, y + radius + 10);
    ctx.fillStyle = `rgba(0, 0, 0, 0.2)`;
    ctx.fillRect(x - 20, y + radius + 5, 50, 5);
    ctx.fillStyle = `hsl(${energy * 120}, 100%, 50%)`;
    ctx.fillRect(x - 20, y + radius + 5, energy * 50, 5);
}

export function fillCircle(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}