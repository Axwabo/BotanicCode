import { defineStore } from "pinia";

interface Settings {
    stickyScroll: boolean
}

const useSettingsStore = defineStore("Settings", {
    state: (): Settings => ({
        stickyScroll: true
    })
});

export default useSettingsStore;
