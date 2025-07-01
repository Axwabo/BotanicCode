import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker"
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker"
import useFileStore from "../../fileStore.ts";
import { languages } from "monaco-editor";

const { files, get } = useFileStore();

export default function ensureMonacoEnvironment() {
    if (self.MonacoEnvironment)
        return;
    self.MonacoEnvironment = {
        getWorker(_, label) {
            return label === "typescript" || label === "javascript" ? new tsWorker() : new editorWorker();
        }
    };
    for (const [ path, status ] of files) {
        if (status === "locked" || status === "hidden")
            void registerLibrary(path);
    }
}

async function registerLibrary(path: string) {
    const response = await get(path);
    if (response)
        languages.typescript.javascriptDefaults.addExtraLib(response, path); // TODO: doesn't work
}
