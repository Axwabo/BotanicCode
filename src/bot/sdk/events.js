import WorldLoadedEvent from "../../util/world/events/worldLoadedEvent.js";
import createBoardFromJson from "../../util/world/worldDeserializer.js";

export default function registerEvents() {
    addEventListener("message", handleMessage);
}

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
    }
}
