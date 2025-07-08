export default class ItemUpdatedEvent extends Event {
    /** @type {DroppedItem} */
    item;

    /** @param item {DroppedItem} */
    constructor(item) {
        super("itemUpdated");
        this.item = item;
    }
}
