/// <reference lib="webworker" />
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from "workbox-precaching"
import { NavigationRoute, registerRoute } from "workbox-routing";

declare let self: ServiceWorkerGlobalScope;

const base = self.location.origin;

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

self.addEventListener("fetch", event => {
    if (!fileCache || event.request.method !== "POST") // TODO: disallow requests going out of /bot/
        return;
    const path = event.request.url.substring(base.length).replace(/^\//, "");
    if (!path.startsWith("bot/"))
        return;
    const url = new URL(path, base);
    event.respondWith(getCache().then(cache => cache.put(url, new Response(event.request.body, {
        status: 200,
        headers
    }))).then(() => new Response(path, { status: 201 })));
});

registerRoute("/file-list/bot", async () => {
    const keys = await (await getCache()).keys();
    const response = new Response(keys.map(f => f.url.substring(base.length)).join("\n"));
    response.headers.set("Content-Type", "text/plain");
    return response;
});

registerRoute(/\/bot\/sdk\/run*/, async options => {
    const entry = options.url.searchParams.get("entryPoint");
    if (!entry)
        return new Response(null, { status: 401 });
    // TODO: sanitize input
    lastRun = Date.now();
    return new Response(`import registerEvents from "./events.js";registerEvents();void import("${entry}?t=${lastRun}");`, {
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
