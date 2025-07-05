import jsTokens from "js-tokens";

export interface ImportRewriteResult {
    text: string;
    error?: string;
}

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

export function rewriteImports(text: string): ImportRewriteResult {
    let builder = "";
    let line = 0;
    let column = 0;
    for (const token of jsTokens(text)) {
        switch (token.type) {
            case "LineTerminatorSequence":
                line++;
                column = 0;
                break;
            case "IdentifierName":
            // TODO
            default:
                column += token.value.length;
                builder += token.value;
                break;
        }
    }
    return { text: builder };
}

function validateFile(file: string) {
    if (!file.startsWith("/") && !file.startsWith("./") && !file.startsWith("../"))
        return true; // invalid reference
    const fullPath = [ "bot" ];
    for (const segment of file.split("/")) {
        if (!segment || segment === ".")
            continue;
        if (segment !== "..") {
            fullPath.push(segment.toLowerCase());
            continue;
        }
        if (!fullPath.pop())
            return false;
    }
    return fullPath[0] === "util" || fullPath[0] === "bot";
}
