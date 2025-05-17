/// <reference lib="webworker" />
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from "workbox-precaching"
import { NavigationRoute, registerRoute } from "workbox-routing";
import staticRoutes from "./staticRoutes.ts";
import { cacheNames } from "workbox-core";

declare let self: ServiceWorkerGlobalScope;

let fileCache: Cache | undefined;

let lastRun = 0; // TODO: group by worker

async function getCache() {
    return fileCache ??= await caches.open("Files");
}

self.addEventListener("activate", async () => {
    fileCache = await caches.open("Files");
    await self.clients.claim();
    await self.skipWaiting();
});

self.addEventListener("message", event => {
    if (event.data && event.data.type === "SKIP_WAITING")
        void self.skipWaiting();
});

const headers = {
    "Content-Type": "text/javascript",
    "Content-Security-Policy": "script-src 'strict-dynamic'"
};

const botDirectory = /^\/bot\/(?!sdk\/)/ig;

self.addEventListener("fetch", event => {
    const path = new URL(event.request.url).pathname;
    const referrerUrl = new URL(event.request.referrer);
    if (referrerUrl.origin === self.location.origin
        && referrerUrl.pathname.match(botDirectory)
        && !path.startsWith("/bot/")
        && !path.startsWith("/util/")) {
        event.respondWith(new Response("Cannot fetch resources outside `/bot/` or `/util/` from a bot module.", {
            status: 403,
            statusText: "Illegal Import"
        }));
        return;
    }
    if (!fileCache || !path.match(botDirectory))
        return;
    const url = new URL(path, self.location.origin);
    switch (event.request.method) {
        case "POST":
            event.respondWith(getCache().then(cache => cache.put(url, new Response(event.request.body, {
                status: 200,
                headers
            }))).then(() => new Response(path, { status: 201 })));
            break;
        case "DELETE":
            event.respondWith(getCache().then(cache => cache.delete(url)).then(() => new Response(null, { status: 200 })));
            break;
    }
});
const plainInit = {
    headers: {
        "Content-Type": "text/plain"
    }
};

registerRoute("/file-list/bot", async () => {
    const cache = await getCache();
    const keys = await cache.keys();
    return new Response(keys.map(f => new URL(f.url, self.location.origin).pathname).concat(staticRoutes).join("\n"), plainInit);
});

registerRoute("/file-list/static", async () => {
    const cache = await caches.open(cacheNames.precache);
    const keys = await cache.keys();
    return new Response(keys.map(e => new URL(e.url))
    .filter(e => e.origin === self.location.origin && (e.pathname.startsWith("/util") || e.pathname.startsWith("/bot")))
    .map(e => e.pathname)
    .join("\n"), plainInit);
});

registerRoute(/\/bot\/sdk\/run*/, async options => {
    const entry = options.url.searchParams.get("entryPoint");
    if (!entry)
        return new Response(null, { status: 401 });
    // TODO: sanitize input
    lastRun = Date.now();
    return new Response(`import { signalReady, signalError } from "./ready.js";import "./events.js";import("${entry}?t=${lastRun}").then(signalReady).catch(signalError);`, {
        status: 200,
        headers
    });
});

registerRoute(/\/bot\/(?!sdk\/)/i, async ({ url }) => {
    if (!fileCache)
        return new Response(null, { status: 503 });
    const isTimed = url.searchParams.has("t");
    url.searchParams.delete("t");
    const cached = await fileCache.match(url);
    if (!cached)
        return new Response(null, {
            status: 404,
            statusText: "File Not Found"
        });
    else if (!isTimed)
        return cached;
    const text = await cached.text();
    // TODO: prevent importing from parent directory
    return new Response(
        text.replace(/(?:^|\w)import([\s\S]+?)from\s*["'](.+?)["']/g, (_, members, file) => `import ${members} from "${transformFile(file)}"`)
        .replace(/(?:^|\w)import\s["'](.+?)["']*/, (_, file) => `import "/bot/${file}?t=${lastRun}"`),
        { status: 200, headers }
    );
});

const staticAssets = /^(?:\/util\/|\.\/sdk\/|sdk\/|\/bot\/sdk\/)/;

function transformFile(file: string) {
    return file.match(staticAssets) ? file : `/bot/${file}?t=${lastRun}`;
}

// self.__WB_MANIFEST is the default injection point
precacheAndRoute(self.__WB_MANIFEST);

// clean old assets
cleanupOutdatedCaches();

/** @type {RegExp[] | undefined} */
let allowlist;
// in dev mode, we disable precaching to avoid caching issues
if (import.meta.env.DEV)
    allowlist = [ /^\/$/ ];

// to allow work offline
registerRoute(new NavigationRoute(
    createHandlerBoundToURL("index.html"),
    { allowlist }
));
