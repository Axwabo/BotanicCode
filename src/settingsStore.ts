import { defineStore } from "pinia";

interface Settings {
    stickyScroll: boolean;
    minimap: boolean;
}

const settingsKey = "BotanicCodeSettings";

const useSettingsStore = defineStore("Settings", {
    state: load,
    actions: {
        save() {
            localStorage.setItem(settingsKey, JSON.stringify(this.$state));
        },
        reset() {
            this.$patch(state => {
                state.stickyScroll = defaultSettings.stickyScroll;
                state.minimap = defaultSettings.minimap;
            });
        }
    }
});

const defaultSettings: Settings = {
    stickyScroll: true,
    minimap: true
};

function load(): Settings {
    const value = localStorage.getItem(settingsKey);
    if (!value)
        return defaultSettings;
    const settings: Partial<Settings> = JSON.parse(value);
    return {
        stickyScroll: settings.stickyScroll !== false,
        minimap: settings.minimap !== false
    };
}

export default useSettingsStore;
