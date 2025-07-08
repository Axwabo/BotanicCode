/// <reference lib="webworker" />
import { addPlugins, cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from "workbox-precaching"
import { NavigationRoute, registerRoute } from "workbox-routing";
import { precacheChannel, requestErrorChannel } from "./worker/channels";
import { addJsHeader, generateEntryPoint, validateEntryFile } from "./worker/transforms.ts";
import { badRequest, illegalFetch, illegalImport, illegalImportsContained, jsSuccess, notFound, plainInit } from "./worker/ini.ts";
import validateImports from "./worker/importValidator.ts";
import type { RouteMatchCallback } from "workbox-core";

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

self.addEventListener("fetch", event => {
    if (!event.request.referrer)
        return;
    const referrer = new URL(event.request.referrer);
    const requested = new URL(event.request.url);
    if (!isPath(referrer, /^bot\//i) || isPath(requested, /^(?:bot|util)\//i))
        return;
    requestErrorChannel.postMessage(`${illegalFetch}\nRequested resource: ${event.request.url}`);
    event.respondWith(new Response(illegalFetch, illegalImport));
});

function isPath(url: URL, regex: RegExp) {
    return url.origin === self.location.origin
        && url.pathname.startsWith(import.meta.env.BASE_URL)
        && regex.test(url.pathname.substring(import.meta.env.BASE_URL.length));
}

function capture(regex: RegExp): RouteMatchCallback {
    return ({ url }) => isPath(url, regex);
}

registerRoute(capture(/^file-list$/i), async () => {
    return new Response(manifest.map(e => typeof e === "string" ? e : e.url)
    .filter(e => e.startsWith("util/") || e.startsWith("bot/"))
    .map(e => `/${e}`)
    .join("\n"), plainInit);
});

registerRoute(capture(/^bot\/sdk\/run*/i), async options => {
    const entry = options.url.searchParams.get("entryPoint");
    return validateEntryFile(entry)
        ? new Response(generateEntryPoint(entry!, Date.now()), jsSuccess)
        : new Response(null, badRequest);
});

registerRoute(capture(/^bot\/(?!sdk)/i), async ({ url }) => {
    fileCache ??= await caches.open("Files");
    const file = url.pathname.replace(import.meta.env.BASE_URL, "/");
    const cached = await fileCache.match(file);
    if (!cached) {
        requestErrorChannel.postMessage(`File not found: ${file}`);
        return new Response(null, notFound);
    }
    const raw = await cached.text();
    const { text, error } = validateImports(raw, file);
    if (!error)
        return new Response(text, jsSuccess);
    requestErrorChannel.postMessage(`An illegal import was detected in the requested file: ${file}\n${error}`);
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
