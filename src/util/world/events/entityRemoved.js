export default class EntityRemovedEvent extends Event {
    /** @type {string} */
    id;

    /** @param string {string} */
    constructor(string) {
        super("entityremoved");
        this.string = string;
    }
}
