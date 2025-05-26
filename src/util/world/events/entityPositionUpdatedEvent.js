export default class EntityPositionUpdatedEvent extends Event {
    /** @type {string} */
    id;
    /** @type {WorldPosition} */
    position;

    /**
     * @param id {string}
     * @param position {WorldPosition}
     */
    constructor(id, position) {
        super("entitypositionupdated");
        this.id = id;
        this.position = position;
    }
}
