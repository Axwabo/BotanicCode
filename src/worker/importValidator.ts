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
        if (token.type !== "IdentifierName" || token.value !== "import")
            continue;
        if (!skipWhitespaces())
            break;
        if (token.type === "StringLiteral") {
            // side-effect import
            const file = token.value.match(extractString)[1];
            if (!validateFile(file))
                return failFile(file);
            continue;
        }
        if (token.type === "Punctuator" && token.value === "(")
            return { text: "", error: `Dynamic imports are not allowed. Line ${line} column ${column}` };
        if (token.type === "Punctuator" && token.value === "{") {
            if (!skipWhitespaces())
                break;
            if (token.type !== "Punctuator" && token.value !== "}")
                return end();
            // TODO: handle aliases, multiple members
        } else if (token.type !== "IdentifierName")
            return end(); // syntax error
        if (!skipWhitespaces())
            break;
        if (token.type !== "IdentifierName" && token.value !== "from")
            return end();
        if (!skipWhitespaces())
            break;
        if (token.type !== "StringLiteral")
            return end();
        const file = token.value.match(extractString)[1];
        if (!validateFile(file))
            return failFile(file);
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
        do if (!next())
            return false;
        while (token.type === "WhiteSpace");
        return true;
    }

    function end(): ImportValidationResult {
        // noinspection StatementWithEmptyBodyJS
        while (next()) ;
        return { text: builder };
    }

    function failFile(file: string): ImportValidationResult {
        return { text: "", error: `Nefarious import at line ${line} column ${column - token.value.length}: ${file}` };
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
