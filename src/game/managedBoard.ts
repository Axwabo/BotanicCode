import { Board } from "../util/world/board";
import type { ManagedEntity } from "./entities/interfaces.ts";
import type EntityAddedEvent from "../util/world/events/entityAdded.js";
import type EntityPositionUpdatedEvent from "../util/world/events/entityPosition.js";
import type EntityRemovedEvent from "../util/world/events/entityRemoved";
import type EntityEnergyUpdatedEvent from "../util/world/events/energyUpdated";
import ItemUpdatedEvent from "../util/world/events/itemUpdated";
import type { DroppedItem } from "../bot/sdk/items";

interface EventMap {
    entityadded: EntityAddedEvent;
    entitypositionupdated: EntityPositionUpdatedEvent;
    entityenergyupdated: EntityEnergyUpdatedEvent;
    entityremoved: EntityRemovedEvent;
    itemupdated: ItemUpdatedEvent;
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

    handleItemUpdate(item: DroppedItem) {
        this.getChunkAtPosition(item.position).handleItemUpdate(item);
        this.dispatchEvent(new ItemUpdatedEvent(item));
    }
}
