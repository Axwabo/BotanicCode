export const plainInit: ResponseInit = { headers: { "Content-Type": "text/plain" } as const } as const;

export const illegalFetch = "Cannot fetch resources outside `/bot/` or `/util/` from a bot module.";

const jsHeaders = {
    "Content-Type": "text/javascript",
    "Content-Security-Policy": "script-src 'strict-dynamic'"
} as const;

export const jsSuccess: ResponseInit = { status: 200, headers: jsHeaders } as const;

export const badRequest: ResponseInit = { status: 400 } as const;

export const illegalImport: ResponseInit = { status: 403, statusText: "Illegal Import" } as const;

export const notFound: ResponseInit = { status: 404, statusText: "File Not Found" } as const;

export const illegalImportsContained: ResponseInit = { status: 451, statusText: "Illegal Imports Contained" } as const;

export const serverError: ResponseInit = { status: 500 } as const;
