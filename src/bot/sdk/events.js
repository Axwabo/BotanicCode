import WorldLoadedEvent from "../../util/world/events/worldLoadedEvent.js";
import createBoardFromJson from "../../util/world/worldDeserializer.js";
import { getBot } from "./bot.js";
import TileUpdatedEvent from "../../util/world/events/tileUpdatedEvent.js";

addEventListener("message", handleMessage);

/** @param ev {MessageEvent<GameMessage>} */
function handleMessage(ev) {
    if (!ev.data)
        return;
    switch (ev.data.type) {
        case "render":
            dispatchEvent(new Event("render"));
            break;
        case "world":
            const board = createBoardFromJson(ev.data.board);
            addEventListener("tileupdated", /** @param event {TileUpdatedEvent} */event => {
                const { x, y, type, data } = event.tile;
                const tile = board.getTile(x, y);
                tile.type = type;
                tile.data = data;
            });
            dispatchEvent(new WorldLoadedEvent(board));
            break;
        case "tile":
            dispatchEvent(new TileUpdatedEvent(ev.data.tile));
            break;
        case "bot":
            const bot = getBot(ev.data.name);
            if (bot)
                handleResponse(bot, ev.data.response);
    }
}

/**
 * @param bot {Bot}
 * @param response {BotResponse}
 */
function handleResponse(bot, response) {
    switch (response.type) {
        case "terminate":
            bot.terminate();
            break;
        case "position":
            bot.position.x = response.x;
            bot.position.y = response.y;
            break;
    }
}
