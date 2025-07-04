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

export function rewriteImports(text: string) {
    // TODO: matchAll, detect & print bad import locations
    // TODO: use js-tokens package in the future?
    return text.replace(/(?:^|\b)import([\s\S]+?)from\s*["'](.+?)["']/g, (_, members, file) => `import ${members} from "${transformFile(file)}"`)
    .replace(/(?:^|\b)import\s["'](.+?)["']/, (_, file) => `import "${transformFile(file)}"`);
}

function transformFile(file: string) {
    if (!file.startsWith("/") && !file.startsWith("./") && !file.startsWith("../"))
        return file; // invalid reference
    const fullPath = [ "bot" ];
    for (const segment of file.split("/")) {
        if (!segment || segment === ".")
            continue;
        if (segment !== "..") {
            fullPath.push(segment.toLowerCase());
            continue;
        }
        if (!fullPath.pop())
            throw new ImportRewriteError(file);
    }
    if (fullPath[0] !== "util" && fullPath[0] !== "bot")
        throw new ImportRewriteError(file);
    return file;
}

export class ImportRewriteError extends Error {
    constructor(message: string) {
        super(message);
    }
}
