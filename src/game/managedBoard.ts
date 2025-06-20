import { Board } from "../util/world/board";
import type { ManagedEntity } from "./entities/interfaces.ts";
import type EntityAddedEvent from "../util/world/events/entityAdded.js";
import type EntityPositionUpdatedEvent from "../util/world/events/entityPosition.js";
import type EntityRemovedEvent from "../util/world/events/entityRemoved";
import type EntityHungerUpdatedEvent from "../util/world/events/entityHungerUpdated";

interface EventMap {
    entityadded: EntityAddedEvent;
    entitypositionupdated: EntityPositionUpdatedEvent;
    entityhungerupdated: EntityHungerUpdatedEvent;
    entityremoved: EntityRemovedEvent;
}

export default class ManagedBoard extends Board {
    readonly entities: Set<ManagedEntity> = new Set<ManagedEntity>();
    private readonly target = new EventTarget();

    addEventListener<E extends keyof EventMap>(type: E, callback: (event: EventMap[E]) => void, options?: AddEventListenerOptions | boolean) {
        this.target.addEventListener(type, <EventListener>callback, options);
    }

    dispatchEvent(event: Event): boolean {
        return this.target.dispatchEvent(event);
    }

    removeEventListener<E extends keyof EventMap>(type: E, callback: (event: EventMap[E]) => void, options?: EventListenerOptions | boolean) {
        this.target.removeEventListener(type, <EventListener>callback, options);
    }
}
