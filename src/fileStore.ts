import { defineStore } from "pinia";
import { reactive } from "vue";

export type FileStatus = "created" | "modified" | "saved" | "locked";

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
        close(path: string) {
            const current = this.currentFile;
            let editorPaths = this.editors.keys();
            let openIndex = -1;
            let i = 0;
            while (true) {
                const { value, done } = editorPaths.next();
                if (value === current) {
                    openIndex = i;
                    break;
                }
                i++;
                if (done)
                    break;
            }
            this.editors.delete(path);
            if (current !== path)
                return;
            if (!this.editors.size) {
                this.currentFile = "";
                return;
            }
            const targetIndex = Math.max(0, Math.min(this.editors.size - 1, openIndex));
            editorPaths = this.editors.keys();
            let targetPath = "";
            for (i = 0; i <= targetIndex; i++)
                targetPath = editorPaths.next().value!;
            this.navigate(targetPath);
        }
    }
});

export default useFileStore;
