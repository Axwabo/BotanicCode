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

export function rewriteImports(text: string, run: number) {
    // TODO: matchAll, detect & print bad import locations
    // TODO: use js-tokens package in the future?
    return text.replace(/(?:^|\w)import([\s\S]+?)from\s*["'](.+?)["']/g, (_, members, file) => `import ${members} from "${transformFile(file, run)}"`)
    .replace(/(?:^|\w)import\s["'](.+?)["']/, (_, file) => `import "${transformFile(file, run)}"`);
}

function transformFile(file: string, run: number) {
    // TODO
    if (file.startsWith("/")) {
        throw new ImportRewriteError(file);
    }
    return `${file}?t=${run}`;
}

export class ImportRewriteError extends Error {
    constructor(message: string) {
        super(message);
    }
}
