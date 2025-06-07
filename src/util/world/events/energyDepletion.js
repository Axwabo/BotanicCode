export class EnergyDepletionEvent extends Event {
    /** @type {string} */
    botName;
    /** @type {number} */
    amount;

    /**
     * @param botName {string}
     * @param amount {number}
     */
    constructor(botName, amount) {
        super("energydepletion");
        this.botName = botName;
        this.amount = amount;
    }
}
