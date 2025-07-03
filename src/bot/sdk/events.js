import WorldLoadedEvent from "../../util/world/events/worldLoaded.js";
import createBoardFromJson from "../../util/world/worldDeserializer.js";
import { getBot } from "./bot.js";
import TileUpdatedEvent from "../../util/world/events/tileUpdated.js";
import EntityAddedEvent from "../../util/world/events/entityAdded.js";
import EntityPositionUpdatedEvent from "../../util/world/events/entityPosition.js";
import EntityRemovedEvent from "../../util/world/events/entityRemoved.js";
import PickUpEvent from "../../util/world/events/pickUp.js";
import { EnergyDepletionEvent } from "../../util/world/events/energyDepletion.js";
import RenderEvent from "../../util/world/events/render.js";
import EntityEnergyUpdatedEvent from "../../util/world/events/energyUpdated.js";
import { signalError } from "./ready.js";

addEventListener("message", handleMessage);

addEventListener("error", handleError);

/** @param ev {MessageEvent<GameMessage>} */
function handleMessage(ev) {
    if (!ev.data)
        return;
    switch (ev.data.type) {
        case "render":
            dispatchEvent(new RenderEvent(ev.data.delta));
            break;
        case "world":
            const board = createBoardFromJson(ev.data.board);
            addEventListener("tileupdated", /** @param event {TileUpdatedEvent} */event => {
                const { x, y, type, data } = event.tile;
                const tile = board.getTile(x, y);
                tile.type = type;
                tile.data = data;
            });
            dispatchEvent(new WorldLoadedEvent(board, ev.data.bots));
            break;
        case "tile":
            dispatchEvent(new TileUpdatedEvent(ev.data.tile));
            break;
        case "bot":
            const bot = getBot(ev.data.name);
            if (bot)
                handleResponse(bot, ev.data.response);
            break;
        case "entityAdd":
            dispatchEvent(new EntityAddedEvent(ev.data.entity));
            break;
        case "entityPositionUpdate":
            dispatchEvent(new EntityPositionUpdatedEvent(ev.data.id, ev.data.position));
            break;
        case "entityRemove":
            dispatchEvent(new EntityRemovedEvent(ev.data.id));
            break;
        case "entityEnergyUpdate":
            dispatchEvent(new EntityEnergyUpdatedEvent(ev.data.id, ev.data.energy));
            break;
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
        case "pickUp":
            dispatchEvent(new PickUpEvent(bot.name, response.item, response.count));
            break;
        case "energy":
            dispatchEvent(new EnergyDepletionEvent(bot.name, response.amount));
            break;
    }
}

/** @param ev {ErrorEvent} */
function handleError(ev) {
    signalError(ev);
}

const originalError = console.error;
console.error = function(e) {
    originalError(e);
    signalError(e, false);
};
