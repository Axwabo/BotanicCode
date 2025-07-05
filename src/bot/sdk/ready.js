import sendMessage from "./message.js";

export function signalReady() {
    sendMessage({ type: "ready" });
}

/**
 * @param error {any}
 * @param fatal {boolean}
 */
export function signalError(error, fatal = true) {
    log(error, fatal ? "fatal" : "error");
}

/**
 * @param content {any}
 * @param type {LogType}
 */
function log(content, type) {
    sendMessage({ type: "log", content, logType: type });
}

const consoleError = console.error;
console.error = function(e) {
    consoleError(e);
    signalError(e, false);
};

const consoleDebug = console.debug;
console.debug = function(e) {
    consoleDebug(e);
    log(e, "debug");
};

const consoleLog = console.log;
console.log = function(e) {
    consoleLog(e);
    log(e, "info");
};

const consoleWarn = console.warn;
console.warn = function(e) {
    consoleWarn(e);
    log(e, "warn");
};
