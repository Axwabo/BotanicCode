export function addJsHeader(response: Response) {
    if (response.url.endsWith(".js"))
        response = new Response(response.body, {
            status: response.status,
            headers: { ...response.headers, "Content-Type": "text/javascript" }
        });
    return response;
}

export function getAbsolutePath(file: string, relativeTo?: string) {
    if (!file.startsWith("/") && !file.startsWith("./") && !file.startsWith("../"))
        return false; // invalid reference
    const fullPath = [ "bot" ];
    if (relativeTo !== undefined) {
        fullPath.shift();
        fullPath.push(...relativeTo.split("/"));
        fullPath.shift();
    }
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
    return fullPath;
}

export function getParent(path: string) {
    const slash = path.lastIndexOf("/");
    const directory = path.substring(0, slash);
    return { slash, directory };
}

export function validateEntryFile(entry: string | null) {
    if (!entry)
        return false;
    const path = getAbsolutePath(entry, "");
    return path && path.length > 1 && path[0] === "bot" && path[1] !== "sdk";
}

export function generateEntryPoint(entry: string, run: number) {
    return `import { signalReady, signalError } from "./ready.js";import "./events.js";import("${import.meta.env.BASE_URL}${entry.substring(1)}?t=${run}").then(signalReady).catch(signalError);`;
}
