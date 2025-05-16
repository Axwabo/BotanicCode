import { defineStore } from "pinia";
import { reactive } from "vue";

export type FileStatus = "created" | "modified" | "saved";

interface State {
    files: Map<string, FileStatus>;
    currentFile: string;
    editors: Map<string, EditorInstance>;
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
    state: (): State => ({ files: reactiveMap(), currentFile: "", editors: reactiveMap() }),
    actions: {
        navigate(path: string, create?: string) {
            if (this.currentFile === path)
                return;
            if (this.files.get(this.currentFile) === "created")
                this.files.delete(this.currentFile);
            if (create)
                this.files.set(path, "created");
            const editor = this.editors.get(path);
            if (!editor)
                this.editors.set(path, { file: path, text: create ?? "", contents: () => "" });
            this.currentFile = path;
        }
    }
});

export default useFileStore;
