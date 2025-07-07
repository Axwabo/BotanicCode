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
    pending: Map<string, string>;
}

export interface EditorInstance {
    file: string;
    text: string;
    contents: () => string;

    load(contentGetter: () => string): void;
}

const emptyContent: () => string = () => "";

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

const useFileStore = defineStore("projectFiles", {
    state: (): State => ({ files: reactiveMap(), currentFile: "", editors: reactiveMap(), deleteConfirmation: "", swActivated: false, pending: new Map() }),
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
        async init() {
            const cache = await this.cacheAsync;
            const keys = await cache.keys();
            const statuses: [ string, FileStatus ][] = keys.map(e => [ new URL(e.url, location.origin).pathname, "saved" ]);
            const response = await fetch(`${import.meta.env.BASE_URL}file-list/static`);
            if (response.ok && response.headers.get("Content-Type") === "text/plain") {
                const text = await response.text();
                statuses.push(...(<[ string, FileStatus ][]>text.split("\n").filter(e => e).map(e => [ e, "hidden" ])));
            }
            this.$patch(state => {
                this.files.clear();
                for (const [ path, status ] of statuses)
                    state.files.set(path, status);
            });
        },
        async get(path: string) {
            const cache = await this.cacheAsync;
            const response = await cache.match(path);
            if (response)
                return await response.text();
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
                this.createEditor(path, content);
            this.currentFile = path;
        },
        createEditor(path: string, content?: string) {
            const loading = Array.from(this.editors.values()).some(e => e.contents === emptyContent);
            const pending = this.pending;
            if (loading) {
                pending.set(path, content ?? "");
                return;
            }
            const editors = this.editors;
            editors.set(path, {
                file: path,
                text: content ?? "",
                contents: emptyContent,
                load(contentGetter: () => string) {
                    this.contents = contentGetter;
                    for (const [ path, content ] of pending) {
                        editors.set(path, {
                            file: path,
                            text: content,
                            contents: emptyContent,
                            load(contentGetter: () => string) {
                                this.contents = contentGetter;
                            }
                        });
                    }
                }
            });
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
            this.editors.delete(path);
            if (current !== path)
                return;
            if (!this.editors.size) {
                this.currentFile = "";
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
