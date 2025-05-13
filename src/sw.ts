/// <reference lib="webworker" />
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from "workbox-precaching"
import { NavigationRoute, registerRoute } from "workbox-routing"

declare let self: ServiceWorkerGlobalScope;

const base = self.location.origin + import.meta.env.BASE_URL;

let fileCache: Cache | undefined;

self.addEventListener("activate", async () => fileCache = await caches.open("Files"));

self.addEventListener("message", async event => {
    if (!event.data)
        return;
    switch (event.data.type) {
        case "SKIP_WAITING":
            void self.skipWaiting();
            break;
        case "SAVE":
            if (!fileCache) {
                event.source?.postMessage("Cache not yet set up");
                break;
            }
            // TODO: path validation
            await fileCache.put(new URL(event.data.path, base), new Response(event.data.script, {
                status: 200,
                headers: {
                    "Content-Type": "text/javascript",
                    "Content-Security-Policy": "script-src 'strict-dynamic'"
                }
            }));
            event.source?.postMessage("Saved");
            break;
    }
});

self.addEventListener("fetch", event => {
    if (!fileCache)
        return;
    const path = event.request.url.substring(base.length).replace(/^\//, "");
    if(!path.startsWith("bot/"))
        return;
    event.respondWith(fileCache.match(new URL(event.request.url)).then(e => e ?? new Response(null, {
        status: 404,
        statusText: "File Not Found"
    })));
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
