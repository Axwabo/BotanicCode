import { createBot } from "./sdk/bot.js"
import { loadWorld, nextFrame } from "./sdk/promises.js"
import { worldToChunk } from "../util/tileConstants.js";

const board = await loadWorld();
console.log("Hello!");

const bot = createBot(board, "Worker");

const moves = [ [ 1, 0 ], [ 0, -1 ], [ -1, 0 ], [ 0, 1 ] ];
let moveIndex = 0;

while (!bot.isTerminated) {
    await nextFrame();
    const [ moveX, moveY ] = moves[moveIndex % moves.length];
    if (bot.move(moveX, moveY))
        continue;
    const { x, y } = bot.position;
    console.log(`Changed direction in chunk ${Math.floor(worldToChunk(x))} ${Math.floor(worldToChunk(y))}`);
    moveIndex++;
}
