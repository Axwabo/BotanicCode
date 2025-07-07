import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker"
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker"
import useFileStore from "../../fileStore.ts";
import * as monaco from "monaco-editor";
import { languages } from "monaco-editor";
import { storeToRefs } from "pinia";
import useSettingsStore from "../../settingsStore.ts";
import { type Ref, watch } from "vue";
import ModuleKind = languages.typescript.ModuleKind;

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
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        // web worker
        target: monaco.languages.typescript.ScriptTarget.ESNext,
        lib: [ "esnext", "webworker" ],
        allowJs: true,
        checkJs: true,
        module: ModuleKind.ESNext,
        typeRoots: [ "/bot/sdk", "/util" ]
    });
    for (const [ path, status ] of files) {
        if (status === "locked" || status === "hidden")
            void registerLibrary(path);
    }
    // void registerLibrary("bot/sdk/bot.js")
    void registerLibrary("bot/sdk/requests.d.ts")
    loadSettings();
}

async function registerLibrary(path: string) {
    const response = await get(path);
    if (response) {
        monaco.languages.typescript.javascriptDefaults.addExtraLib(response, "ts:" + path); // TODO: doesn't work
        monaco.editor.createModel(response, "typescript", monaco.Uri.parse("ts:" + path));
        debugger
    }
}

function loadSettings() {
}

// simple Ref causes the page to hang
type EditorRef = () => monaco.editor.IStandaloneCodeEditor | undefined;

export function watchSettings(editor: EditorRef) {
    watchSetting(editor, stickyScroll, enabled => ({ stickyScroll: { enabled } }));
}

function watchSetting<T>(editor: EditorRef, setting: Ref<T>, transform: (value: T) => monaco.editor.IEditorOptions) {
    watch(setting, value => editor()?.updateOptions(transform(value)));
}
