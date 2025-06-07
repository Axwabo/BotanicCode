export default class EntityAddedEvent extends Event {
    /** @type {Entity} */
    entity;

    /** @param entity {Entity} */
    constructor(entity) {
        super("entityadded");
        this.entity = entity;
    }
}
