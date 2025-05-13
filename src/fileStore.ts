import { defineStore } from "pinia";
import { reactive } from "vue";

export type FileStatus = "created" | "modified" | "saved";

interface State {
    files: Map<string, FileStatus>
    currentFile: string
    fileContents: string
    requestEditorText: () => string
}

const useFileStore = defineStore("projectFiles", {
    state: (): State => ({ files: reactive(new Map<string, FileStatus>()), currentFile: "", fileContents: "", requestEditorText: () => "" }),
    actions: {
        navigate(path: string, status?: FileStatus) {
            if (status)
                this.files.set(path, status);
            else if (this.files.get(this.currentFile) === "created")
                this.files.delete(this.currentFile);
            this.currentFile = path;
        }
    }
});

export default useFileStore;
