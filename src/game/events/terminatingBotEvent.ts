export default class TerminatingBotEvent extends Event {
    readonly name: string;

    constructor(name: string) {
        super("terminatingbot");
        this.name = name;
    }
}
