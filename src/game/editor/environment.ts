import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker"
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker"
import useFileStore from "../../fileStore.ts";
import * as monaco from "monaco-editor";
import { storeToRefs } from "pinia";
import useSettingsStore from "../../settingsStore.ts";
import { type Ref, watch } from "vue";

const { files, get } = useFileStore();

const { stickyScroll } = storeToRefs(useSettingsStore());

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
    loadSettings();
}

async function registerLibrary(path: string) {
    const response = await get(path);
    if (response)
        monaco.languages.typescript.javascriptDefaults.addExtraLib(response, path); // TODO: doesn't work
}

function loadSettings() {
    const settings = localStorage.getItem("BotanicCodeSettings");
    if (!settings)
        stickyScroll.value = monaco.editor.EditorOptions.stickyScroll.defaultValue.enabled;
}

type EditorRef = Ref<monaco.editor.IStandaloneCodeEditor | undefined>;

export function watchSettings(editor: EditorRef) {
    watchSetting(editor, stickyScroll, enabled => ({ stickyScroll: { enabled } }));
}

function watchSetting<T>(editor: EditorRef, setting: Ref<T>, transform: (value: T) => monaco.editor.IEditorOptions) {
    watch(setting, value => editor.value?.updateOptions(transform(value)));
}
