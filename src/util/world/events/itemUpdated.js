export default class ItemUpdatedEvent extends Event {
    /** @type {DroppedItem} */
    item;

    /** @param item {DroppedItem} */
    constructor(item) {
        super("itemupdated");
        this.item = item;
    }
}
