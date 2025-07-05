import type { LogType } from "../../util/messages";

export default class WorkerLogEvent extends Event {
    readonly content: any;
    readonly logType: LogType;

    constructor(content: any, logType: LogType) {
        super("workerlog");
        this.content = content;
        this.logType = logType;
    }
}
