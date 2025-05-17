import type ClickEvent from "./clickEvent.ts";
import type TerminatingBotEvent from "./terminatingBotEvent.ts";
import type WorkerErrorEvent from "./workerErrorEvent.ts";
import type TileUpdatedEvent from "../../util/world/events/tileUpdatedEvent.js";

interface EventMap {
    render: Event;
    click: ClickEvent;
    tileupdated: TileUpdatedEvent;
    workerinit: Event;
    workerready: Event;
    workererror: WorkerErrorEvent;
    terminatingbot: TerminatingBotEvent;
}

class EditorHandler extends EventTarget {
    addEventListener<E extends keyof EventMap>(type: E, callback: (event: EventMap[E]) => void, options?: AddEventListenerOptions | boolean) {
        super.addEventListener(type, <EventListener>callback, options);
    }

    dispatchEvent(event: Event): boolean {
        return super.dispatchEvent(event);
    }

    removeEventListener<E extends keyof EventMap>(type: E, callback: (event: EventMap[E]) => void, options?: EventListenerOptions | boolean) {
        super.removeEventListener(type, <EventListener>callback, options);
    }
}

export const editorHandler = new EditorHandler();
