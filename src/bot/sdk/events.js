import WorldLoadedEvent from "../../util/world/events/worldLoadedEvent.js";
import createBoardFromJson from "../../util/world/worldDeserializer.js";
import { getBot } from "./bot.js";

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
            dispatchEvent(new WorldLoadedEvent(createBoardFromJson(ev.data.board)));
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
        case"position":
            bot.position.x = response.x;
            bot.position.y = response.y;
            break;
    }
}
