import { defineStore } from "pinia";

interface Settings {
    stickyScroll: boolean
}

const settingsKey = "BotanicCodeSettings";

const useSettingsStore = defineStore("Settings", {
    state: (): Settings => ({
        stickyScroll: true
    }),
    actions: {
        load() {
            const value = localStorage.getItem(settingsKey);
            if (!value)
                return;
            const settings: Settings = JSON.parse(value);
            this.$patch(state => {
                state.stickyScroll = settings.stickyScroll;
            });
        },
        save() {
            localStorage.setItem(settingsKey, JSON.stringify(this.$state));
        }
    }
});

export default useSettingsStore;
