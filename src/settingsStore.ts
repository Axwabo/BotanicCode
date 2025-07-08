import { defineStore } from "pinia";

interface Settings {
    stickyScroll: boolean
}

const settingsKey = "BotanicCodeSettings";

const useSettingsStore = defineStore("Settings", {
    state: load,
    actions: {
        save() {
            localStorage.setItem(settingsKey, JSON.stringify(this.$state));
        }
    }
});

const defaultSettings: Settings = {
    stickyScroll: true
};

function load(): Settings {
    const value = localStorage.getItem(settingsKey);
    if (!value)
        return defaultSettings;
    const settings: Partial<Settings> = JSON.parse(value);
    return {
        stickyScroll: !!settings.stickyScroll
    };
}

export default useSettingsStore;
