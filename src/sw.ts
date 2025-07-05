/// <reference lib="webworker" />
import { addPlugins, cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from "workbox-precaching"
import { NavigationRoute, registerRoute } from "workbox-routing";
import { precacheChannel, requestErrorChannel } from "./worker/channels";
import { addJsHeader, generateEntryPoint, rewriteImports } from "./worker/transforms.ts";
import { badRequest, illegalFetch, illegalImport, illegalImportsContained, jsSuccess, notFound, plainInit } from "./worker/ini.ts";

declare let self: ServiceWorkerGlobalScope;

let fileCache: Cache | undefined;

// self.__WB_MANIFEST is the default injection point
const manifest = self.__WB_MANIFEST;

self.addEventListener("activate", async () => {
    fileCache = await caches.open("Files");
    await self.skipWaiting();
    await self.clients.claim();
});

self.addEventListener("message", event => {
    if (event.data && event.data.type === "SKIP_WAITING")
        void self.skipWaiting();
});

const botDirectory = new RegExp(`^${import.meta.env.BASE_URL.replace("/", "\\/")}bot\\/(?!sdk\\/)`);

self.addEventListener("fetch", event => {
    const path = new URL(event.request.url).pathname;
    if (!event.request.referrer)
        return;
    const referrerUrl = new URL(event.request.referrer);
    if (referrerUrl?.origin !== self.location.origin
        || !referrerUrl.pathname.match(botDirectory)
        || path.startsWith(import.meta.env.BASE_URL + "bot/")
        || path.startsWith(import.meta.env.BASE_URL + "util/"))
        return;
    requestErrorChannel.postMessage(`${illegalFetch}\nRequested resource: ${event.request.url}`);

    event.respondWith(new Response(illegalFetch, illegalImport));
});

registerRoute(/\/file-list\/static/, async () => {
    return new Response(manifest.map(e => typeof e === "string" ? e : e.url)
    .filter(e => e.startsWith("util/") || e.startsWith("bot/"))
    .map(e => `/${e}`)
    .join("\n"), plainInit);
});

registerRoute(/\/bot\/sdk\/run*/, async options => {
    const entry = options.url.searchParams.get("entryPoint");
    if (!entry)
        return new Response(null, badRequest);
    // TODO: sanitize input
    return new Response(generateEntryPoint(entry, Date.now()), jsSuccess);
});

registerRoute(/\/bot\/(?!sdk\/)/i, async ({ url }) => {
    fileCache ??= await caches.open("Files");
    const file = url.pathname.replace(import.meta.env.BASE_URL, "/");
    const cached = await fileCache.match(file);
    if (!cached) {
        requestErrorChannel.postMessage(`File not found: ${file}`);
        return new Response(null, notFound);
    }
    const raw = await cached.text();
    const { text, error } = rewriteImports(raw);
    if (!error)
        return new Response(text, jsSuccess);
    requestErrorChannel.postMessage(`An illegal import was detected in the requested file: ${file}\nNefarious import: ${error}`);
    return new Response(null, illegalImportsContained);
});

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
        response = addJsHeader(response);
        precacheChannel.postMessage("precaching");
        return response;
    }
} ]);

// to allow work offline
registerRoute(new NavigationRoute(
    createHandlerBoundToURL("index.html"),
    { allowlist }
));
