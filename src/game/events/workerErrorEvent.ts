export default class WorkerErrorEvent extends Event {
    readonly error: any;

    constructor(error: any) {
        super("workererror");
        this.error = error;
    }
}
