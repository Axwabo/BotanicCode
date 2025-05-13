/// <reference lib="webworker" />
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from "workbox-precaching"
import { NavigationRoute, registerRoute } from "workbox-routing";

declare let self: ServiceWorkerGlobalScope;

const base = self.location.origin + import.meta.env.BASE_URL;

let fileCache: Cache | undefined;

self.addEventListener("activate", async () => {
    fileCache = await caches.open("Files");
    await self.clients.claim();
    await self.skipWaiting();
});

self.addEventListener("message", event => {
    if (event.data && event.data.type === "SKIP_WAITING")
        void self.skipWaiting();
});

self.addEventListener("fetch", event => {
    if (!fileCache || event.request.method !== "POST")
        return;
    const path = event.request.url.substring(base.length).replace(/^\//, "");
    if (!path.startsWith("bot/"))
        return;
    const url = new URL(path, base);
    event.respondWith(fileCache.put(url, new Response(event.request.body, {
        status: 200,
        headers: {
            "Content-Type": "text/javascript",
            "Content-Security-Policy": "script-src 'strict-dynamic'"
        }
    })).then(() => new Response(path, { status: 201 })));
});

registerRoute("/file-list/bot", async () => {
    const keys = fileCache ? await fileCache.keys() : [];
    const response = new Response(keys.map(f => f.url.substring(base.length)).join("\n"));
    response.headers.set("Content-Type", "text/plain");
    return response;
});

registerRoute(/\/bot\/*/i, async options => {
    if (!fileCache)
        return new Response(null, { status: 503 });
    const cached = await fileCache.match(options.url);
    if (cached)
        return cached;
    return new Response(null, {
        status: 404,
        statusText: "File Not Found"
    });
});

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
