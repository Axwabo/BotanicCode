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
                return fail(file);
            continue;
        }
        if (token.type === "Punctuator" && token.value === "(")
            return { text: "", error: `Dynamic imports are not allowed. Line ${line} column ${column}` };
        const onlyAlias = asteriskAlias();
        if (onlyAlias === undefined) // successful validation
            continue;
        if (onlyAlias) // syntax error or illegal import
            return onlyAlias;
        if (token.type === "IdentifierName") {
            const defaultExport = endDefault();
            if (defaultExport === undefined)
                continue;
            if (defaultExport)
                return defaultExport;
        }
        if (token.type === "Punctuator" && token.value === "{") {
            const named = endNamed();
            if (named)
                return named;
        } else
            return end();
        const failure = from();
        if (failure)
            return failure;
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
        builder += token.value;
        return !done;
    }

    function skipWhitespaces() {
        do if (!next())
            return false;
        while (token.type === "WhiteSpace" || token.type === "SingleLineComment" || token.type === "MultiLineComment" || token.type === "HashbangComment" || token.type === "LineTerminatorSequence");
        return true;
    }

    function end(): ImportValidationResult {
        // noinspection StatementWithEmptyBodyJS
        while (next()) ;
        return { text: builder };
    }

    function fail(file: string): ImportValidationResult {
        return { text: "", error: `Nefarious import at line ${line} column ${column - token.value.length + 1}: ${file}` };
    }

    function from(): ImportValidationResult | undefined {
        if (token.type !== "IdentifierName" || token.value !== "from" || !skipWhitespaces() || token.type !== "StringLiteral")
            return end(); // syntax error, must be: from "./file.js"
        const file = token.value.match(extractString)[1];
        return validateFile(file) ? undefined : fail(file);
    }

    function asteriskAlias(): ImportValidationResult | false | undefined {
        if (token.type !== "Punctuator" || token.value !== "*")
            return false;
        if (!skipWhitespaces())
            return { text: builder };
        if (token.type !== "IdentifierName" || token.value !== "as")
            return end(); // syntax error, must be: * as name
        if (!skipWhitespaces())
            return { text: builder };
        if (token.type !== "IdentifierName")
            return end();
        return skipWhitespaces() ? from() : { text: builder };
    }

    function endDefault(): ImportValidationResult | false | undefined {
        if (!skipWhitespaces())
            return end();
        if (token.type === "Punctuator" && token.value === ",") {
            // default export followed by an aliased default export
            if (!skipWhitespaces())
                return end();
            const asterisk = asteriskAlias();
            return asterisk === undefined
                ? undefined
                : asterisk
                    ? asterisk
                    : false;
        } else {
            // only default export
            const failure = from();
            if (failure)
                return failure;
            if (!skipWhitespaces())
                return end();
        }
    }

    function endNamed(): ImportValidationResult | undefined {
        while (true) {
            if (!next())
                return end();
            switch (token.type) {
                case "StringLiteral":
                    // alias
                    // noinspection DuplicateConditionJS
                    if (!skipWhitespaces() || token.type !== "IdentifierName" || token.value !== "as" || !skipWhitespaces() || token.type !== "IdentifierName")
                        return end();
                    break;
                case "IdentifierName":
                case "WhiteSpace":
                case "LineTerminatorSequence":
                case "SingleLineComment":
                case "MultiLineComment":
                case "HashbangComment":
                    break;
                case "Punctuator":
                    if (token.value === ",")
                        break;
                    if (token.value !== "}" || !skipWhitespaces())
                        return end();
                    return undefined;
                default:
                    return end();
            }
        }
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
