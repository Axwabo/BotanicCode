export default class EntityEnergyUpdatedEvent extends Event {
    /** @type {string} */
    id;
    /** @type {number} */
    energy;

    /**
     * @param id {string}
     * @param energy {number}
     */
    constructor(id, energy) {
        super("entityenergyupdated");
        this.id = id;
        this.energy = energy;
    }

}
