export default class BotReadyEvent extends Event {
    readonly name: string;

    constructor(name: string) {
        super("botready");
        this.name = name;
    }
}
