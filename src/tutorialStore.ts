import { defineStore, storeToRefs } from "pinia";
import { computed } from "vue";

function defineParts<T extends string>(...args: T[]): T[] {
    return args;
}

type TutorialPart = typeof parts extends ReadonlyArray<infer T> ? T : never;

const parts = defineParts("welcome", "project", "sdk", "editor", "tabs", "run", "board", "actions", "tools", "environment", "example", "skip");

interface State {
    sequence: TutorialPart
}

export const useTutorialStore = defineStore("Tutorial", {
    state: (): State => ({ sequence: localStorage.getItem(tutorialKey) === "true" ? "skip" : parts[0] }),
    actions: {
        next() {
            this.sequence = parts[parts.indexOf(this.sequence) + 1];
        },
        skip() {
            this.sequence = "skip";
        },
        restart() {
            this.sequence = parts[0];
        }
    }
});

export function tutorialSequence() {
    const { sequence } = storeToRefs(useTutorialStore());
    return sequence;
}

export default function isTutorialSequence(part: TutorialPart) {
    const sequence = tutorialSequence();
    return computed(() => sequence.value === part);
}

export const tutorialKey = "BotanicCodeTutorialCompleted";
