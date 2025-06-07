export default class PickUpEvent extends Event {
    /** @type {string} */
    botName;
    /** @type {ItemType} */
    itemType;
    /** @type {number} */
    count;

    /**
     * @param botName {string}
     * @param itemType {ItemType}
     * @param count {number}
     */
    constructor(botName, itemType, count) {
        super("pickup");
        this.botName = botName;
        this.itemType = itemType;
        this.count = count;
    }
}
