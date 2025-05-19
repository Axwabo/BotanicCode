/// <reference lib="webworker" />
import { addPlugins, cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from "workbox-precaching"
import { NavigationRoute, registerRoute } from "workbox-routing";
import { cacheNames } from "workbox-core";

declare let self: ServiceWorkerGlobalScope;

let fileCache: Cache | undefined;

let lastRun = 0;

const precacheProgress = {
    total: 0,
    current: 0
};

const updateChannel = new BroadcastChannel("BotanicCodePrecache");

self.addEventListener("activate", async () => {
    fileCache = await caches.open("Files");
    await self.skipWaiting();
    await self.clients.claim();
});

self.addEventListener("message", event => {
    if (event.data && event.data.type === "SKIP_WAITING")
        void self.skipWaiting();
});

const headers = {
    "Content-Type": "text/javascript",
    "Content-Security-Policy": "script-src 'strict-dynamic'"
};

const botDirectory = new RegExp(`^${import.meta.env.BASE_URL.replace("/", "\\/")}bot\\/(?!sdk\\/)`);

self.addEventListener("fetch", event => {
    const path = new URL(event.request.url).pathname;
    if (!event.request.referrer)
        return;
    const referrerUrl = new URL(event.request.referrer);
    if (referrerUrl?.origin === self.location.origin
        && referrerUrl.pathname.match(botDirectory)
        && !path.startsWith(import.meta.env.BASE_URL + "bot/")
        && !path.startsWith(import.meta.env.BASE_URL + "util/"))
        event.respondWith(new Response("Cannot fetch resources outside `/bot/` or `/util/` from a bot module.", {
            status: 403,
            statusText: "Illegal Import"
        }));
});

const plainInit = {
    headers: {
        "Content-Type": "text/plain"
    }
};

registerRoute(import.meta.env.BASE_URL + "file-list/static", async () => {
    const cache = await caches.open(cacheNames.precache);
    const keys = await cache.keys();
    return new Response(keys.map(e => new URL(e.url))
    .filter(e => e.origin === self.location.origin)
    .map(e => new URL(e.pathname, e.origin + import.meta.env.BASE_URL))
    .filter(e => e.pathname.startsWith("/util/") || e.pathname.startsWith("/bot/"))
    .map(e => e.pathname)
    .join("\n"), plainInit);
});

registerRoute(/\/bot\/sdk\/run*/, async options => {
    const entry = options.url.searchParams.get("entryPoint");
    if (!entry)
        return new Response(null, { status: 401 });
    // TODO: sanitize input
    lastRun = Date.now();
    return new Response(`import { signalReady, signalError } from "./ready.js";import "./events.js";import("${import.meta.env.BASE_URL}${entry}?t=${lastRun}").then(signalReady).catch(signalError);`, {
        status: 200,
        headers
    });
});

registerRoute(/\/bot\/(?!sdk\/)/i, async ({ url }) => {
    fileCache ??= await caches.open("Files");
    const isTimed = url.searchParams.has("t");
    const cached = await fileCache.match(url.pathname.replace(import.meta.env.BASE_URL, "/"));
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
        .replace(/(?:^|\w)import\s["'](.+?)["']*/, (_, file) => `import "${import.meta.env.BASE_URL}bot/${file}?t=${lastRun}"`),
        { status: 200, headers }
    );
});

const staticAssets = /^(?:\.\.\/util\/|\/util\/|\.\/sdk\/|sdk\/|\/bot\/sdk\/)/;

function transformFile(file: string) {
    return file.match(staticAssets) ? file : `${import.meta.env.BASE_URL}bot/${file}?t=${lastRun}`;
}

// self.__WB_MANIFEST is the default injection point
const manifest = self.__WB_MANIFEST;
precacheAndRoute(manifest);

// clean old assets
cleanupOutdatedCaches();

/** @type {RegExp[] | undefined} */
let allowlist;
// in dev mode, we disable precaching to avoid caching issues
if (import.meta.env.DEV)
    allowlist = [ /^\/$/ ];

addPlugins([ {
    cacheWillUpdate: async ({ response }) => {
        if (precacheProgress.total)
            return response;
        const cache = await caches.open(cacheNames.precache);
        const keys = await cache.keys();
        precacheProgress.total = manifest.length;
        precacheProgress.current = keys.length;
        updateChannel.postMessage({ type: "precaching", current: keys.length, total: manifest.length });
        return response;
    },
    cacheDidUpdate: async () => {
        precacheProgress.current++;
        updateChannel.postMessage({ type: "precaching", total: precacheProgress.total, current: precacheProgress.current });
    }
} ]);

// to allow work offline
registerRoute(new NavigationRoute(
    createHandlerBoundToURL("index.html"),
    { allowlist }
));
