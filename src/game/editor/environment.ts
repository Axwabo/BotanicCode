import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker"
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker"
import useFileStore from "../../fileStore.ts";
import { languages } from "monaco-editor";
import { watch } from "vue";

const { files, get } = useFileStore();

let libraries: Promise<void> = Promise.resolve();

watch(() => files, value => {
    const promises: Promise<void>[] = [];
    for (const [ path, status ] of value) {
        if (status === "locked" || status === "hidden")
            promises.push(registerLibrary(path));
    }
    libraries = Promise.all(promises).then();
}, { once: true });

export default async function ensureMonacoEnvironment() {
    if (self.MonacoEnvironment)
        return;
    self.MonacoEnvironment = {
        getWorker(_, label) {
            return label === "typescript" || label === "javascript" ? new tsWorker() : new editorWorker();
        }
    };
    await libraries;
}

async function registerLibrary(path: string) {
    const response = await get(path);
    if (response)
        languages.typescript.javascriptDefaults.addExtraLib(response, path);
}
