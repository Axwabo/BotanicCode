import { defineStore } from "pinia";
import { reactive } from "vue";

export type FileStatus = "created" | "modified" | "saved" | "locked" | "hidden";

interface State {
    files: Map<string, FileStatus>;
    currentFile: string;
    editors: Map<string, EditorInstance>;
    deleteConfirmation: string;
    swActivated: boolean;
    cache?: Cache;
}

export interface EditorInstance {
    file: string;
    text: string;
    contents: () => string;
}

const openEditorsKey = "BotanicCodeOpenEditors";

function reactiveMap<T>() {
    return reactive(new Map<string, T>());
}

function findIndex(editorPaths: Map<string, EditorInstance>, current: string) {
    const iterator = editorPaths.keys();
    let i = 0;
    while (true) {
        const { value, done } = iterator.next();
        if (value === current)
            return i;
        i++;
        if (done)
            break;
    }
    return -1;
}

function commitEditors(editors: Map<string, EditorInstance>, current: string) {
    localStorage.setItem(openEditorsKey, Array.from(editors.keys()).concat(current).join("\n"));
}

let initPromise: Promise<void> | undefined;

const useFileStore = defineStore("projectFiles", {
    state: (): State => ({ files: reactiveMap(), currentFile: "", editors: reactiveMap(), deleteConfirmation: "", swActivated: false }),
    getters: {
        canRun(state: State) {
            const status = state.files.get(state.currentFile);
            return state.swActivated && (status === "saved" || status === "modified");
        },
        async cacheAsync(state: State) {
            return state.cache ??= await caches.open("Files");
        }
    },
    actions: {
        init() {
            if (initPromise)
                return initPromise;
            const init = async () => {
                const cache = await this.cacheAsync;
                const keys = await cache.keys();
                const statuses: [ string, FileStatus ][] = keys.map(e => [ new URL(e.url, location.origin).pathname, "saved" ]);
                const response = await fetch(`${import.meta.env.BASE_URL}file-list`);
                if (response.ok && response.headers.get("Content-Type") === "text/plain") {
                    const text = await response.text();
                    statuses.push(...(<[ string, FileStatus ][]>text.split("\n").filter(e => e).map(e => [ e, "hidden" ])));
                }
                this.$patch(state => {
                    this.files.clear();
                    for (const [ path, status ] of statuses)
                        state.files.set(path, status);
                });
            };
            return initPromise = init();
        },
        async get(path: string) {
            const cache = await this.cacheAsync;
            const response = await cache.match(path);
            if (response)
                return await response.text();
            if (path.startsWith("/bot/"))
                return "";
            const network = await fetch(import.meta.env.BASE_URL + path);
            return network.ok ? await network.text() : "";
        },
        async save(path: string, content: string) {
            const cache = await this.cacheAsync;
            await cache.put(path, new Response(content));
            this.files.set(path, "saved");
        },
        async delete(path: string) {
            const cache = await this.cacheAsync;
            await cache.delete(path);
            this.files.delete(path);
            this.close(path);
        },
        navigate(path: string, content?: string) {
            if (!this.files.get(path))
                this.files.set(path, "created");
            const editor = this.editors.get(path);
            if (!editor && content !== undefined)
                this.editors.set(path, { file: path, text: content ?? "", contents: () => "" });
            this.currentFile = path;
            commitEditors(this.editors, path);
        },
        async restoreEditors() {
            await this.init();
            const paths = localStorage.getItem(openEditorsKey);
            if (!paths)
                return;
            const promises: Promise<[ string, string ]>[] = [];
            const split = paths.split("\n");
            for (let i = 0; i < split.length - 1; i++) {
                const path = split[i];
                if (this.files.has(path))
                    promises.push((async () => [ path, await this.get(path) ])());
            }
            const completed = await Promise.all(promises);
            for (const [ path, content ] of completed) {
                if (!this.editors.get(path) && this.files.has(path))
                    this.editors.set(path, { file: path, text: content, contents: () => "" });
            }
            const current = split[split.length - 1];
            if (this.files.has(current))
                this.currentFile = current;
        },
        setSdkVisibility(visible: boolean) {
            const change: string[] = [];
            for (const [ path, status ] of this.files)
                if (status === "locked" || status === "hidden")
                    change.push(path);
            const targetStatus = visible ? "locked" : "hidden";
            this.$patch(state => {
                for (const path of change)
                    state.files.set(path, targetStatus);
            });
        },
        close(path: string) {
            const current = this.currentFile;
            const openIndex = findIndex(this.editors, current);
            if (this.editors.delete(path)) {
                commitEditors(this.editors, current);
                const state = this.files.get(path);
                switch (state) {
                    case "created":
                        this.files.delete(path);
                        break;
                    case "modified":
                        this.files.set(path, "saved");
                        break;
                }
            }
            if (current !== path)
                return;
            if (!this.editors.size) {
                this.currentFile = "";
                localStorage.removeItem(openEditorsKey);
                return;
            }
            const targetIndex = Math.max(0, Math.min(this.editors.size - 1, openIndex));
            const editorPaths = this.editors.keys();
            let targetPath = "";
            for (let i = 0; i <= targetIndex; i++)
                targetPath = editorPaths.next().value!;
            this.navigate(targetPath);
        }
    }
});

export default useFileStore;
