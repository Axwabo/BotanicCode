export function addJsHeader(response: Response) {
    if (response.url.endsWith(".js"))
        response = new Response(response.body, {
            status: response.status,
            headers: { ...response.headers, "Content-Type": "text/javascript" }
        });
    return response;
}

export function generateEntryPoint(entry: string, run: number) {
    return `import { signalReady, signalError } from "./ready.js";import "./events.js";import("${import.meta.env.BASE_URL}${entry}?t=${run}").then(signalReady).catch(signalError);`;
}

export class ImportRewriteError extends Error {
}
