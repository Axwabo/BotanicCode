import { defineStore } from "pinia";
import { reactive } from "vue";

export type FileStatus = "created" | "modified" | "saved";

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
        }
    }
});

export default useFileStore;
