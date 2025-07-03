export default class WorkerErrorEvent extends Event {
    readonly error: any;
    readonly fatal: boolean;

    constructor(error: any, fatal: boolean) {
        super("workererror");
        this.error = error;
        this.fatal = fatal;
    }
}
