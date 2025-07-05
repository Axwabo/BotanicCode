import jsTokens, { type Token } from "js-tokens";

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
    const allTokens = jsTokens(text)[Symbol.iterator]();
    let token: Token = null as unknown as Token; // thanks vue-tsc for working :rolling_eyes:

    while (next()) {
        if (token.type !== "IdentifierName" || token.value !== "import")
            continue;
        // TODO: check next tokens
    }

    return { text: builder };

    function next() {
        const { value, done } = allTokens.next();
        token = value;
        if (token.type === "LineTerminatorSequence") {
            line++;
            column = 0;
        } else
            column += token.value.length;
        builder += token.value.length;
        return !done;
    }
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
