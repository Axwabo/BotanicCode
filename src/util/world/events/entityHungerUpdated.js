export default class EntityHungerUpdatedEvent extends Event {
    /** @type {string} */
    id;
    /** @type {number} */
    hunger;

    /**
     * @param id {string}
     * @param hunger {number}
     */
    constructor(id, hunger) {
        super("entityhungerupdated");
        this.id = id;
        this.hunger = hunger;
    }

}
