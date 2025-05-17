/** @param message {WorkerMessage} */
export default function sendMessage(message) {
    postMessage(message);
}
