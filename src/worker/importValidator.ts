// @ts-nocheck
import jsTokens, { type Token } from "js-tokens";

interface ImportValidationResult {
    text: string;
    error?: string;
}

const extractString = /^["']([\s\S]+?)["']$/;

export default function validateImports(text: string): ImportValidationResult {
    let builder = "";
    let line = 1;
    let column = 0;
    const allTokens = jsTokens(text)[Symbol.iterator]();
    let token: Token = null as unknown as Token;

    while (next()) {
        if (token.type !== "IdentifierName" || token.value !== "import" || !next())
            continue;
        if (!skipWhitespaces())
            break;
        if (token.type === "StringLiteral") {
            // side-effect import
            const file = token.value.match(extractString)[1];
            if (!validateFile(file))
                return { text: "", error: `Nefarious import at line ${line} column ${column - token.value.length}: ${file}` };
        }
        if (token.type === "Punctuator") {
            if (token.value === "(")
                return { text: "", error: `Dynamic imports are not allowed. Line ${line} column ${column}` };
        }
        if (!skipWhitespaces())
            break;
        // TODO
    }

    return { text: builder };

    function next() {
        const { value, done } = allTokens.next();
        if (!value)
            return false;
        token = value;
        if (token.type === "LineTerminatorSequence") {
            line++;
            column = 0;
        } else
            column += token.value.length;
        builder += token.value.length;
        return !done;
    }

    function skipWhitespaces() {
        while (token.type === "WhiteSpace")
            if (!next())
                return false;
        return true;
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
