import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker"
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker"
import useFileStore from "../../fileStore.ts";
import * as monaco from "monaco-editor";
import { storeToRefs } from "pinia";
import useSettingsStore from "../../settingsStore.ts";
import { type Ref, watch } from "vue";

const { files, get } = useFileStore();

const { stickyScroll, minimap } = storeToRefs(useSettingsStore());

export function ensureMonacoEnvironment() {
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
        monaco.languages.typescript.javascriptDefaults.addExtraLib(response, path); // TODO: doesn't work
}

// simple Ref causes the page to hang
type EditorRef = () => monaco.editor.IStandaloneCodeEditor | undefined;

export function watchSettings(editor: EditorRef) {
    watchSetting(editor, stickyScroll, enabled => ({ stickyScroll: { enabled } }));
    watchSetting(editor, minimap, enabled => ({ minimap: { enabled } }));
}

function watchSetting<T>(editor: EditorRef, setting: Ref<T>, transform: (value: T) => monaco.editor.IEditorOptions) {
    watch(setting, value => editor()?.updateOptions(transform(value)));
}

export function editorConstruction(): monaco.editor.IStandaloneEditorConstructionOptions {
    return {
        stickyScroll: { enabled: stickyScroll.value },
        minimap: { enabled: minimap.value }
    };
}
