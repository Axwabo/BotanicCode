import { defineStore } from "pinia";
import { reactive } from "vue";

export type FileStatus = "created" | "modified" | "saved" | "locked" | "hidden";

interface State {
    files: Map<string, FileStatus>;
    currentFile: string;
    editors: Map<string, EditorInstance>;
    deleteConfirmation: string;
}

export interface EditorInstance {
    file: string;
    text: string;
    contents: () => string;
}

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
    state: (): State => ({ files: reactiveMap(), currentFile: "", editors: reactiveMap(), deleteConfirmation: "" }),
    actions: {
        navigate(path: string, content?: string) {
            if (this.files.get(this.currentFile) === "created")
                this.files.delete(this.currentFile);
            if (!this.files.get(path))
                this.files.set(path, "created");
            const editor = this.editors.get(path);
            if (!editor && content !== undefined)
                this.editors.set(path, { file: path, text: content ?? "", contents: () => "" });
            this.currentFile = path;
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
