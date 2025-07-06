import { defineStore, storeToRefs } from "pinia";

function defineParts<T extends string>(...args: T[]): T[] {
    return args;
}

type TutorialPart = typeof parts extends ReadonlyArray<infer T> ? T : never;

const parts = defineParts("welcome", "project", "sdk", "editor", "example", "skip");

interface State {
    sequence: TutorialPart
}

export const useTutorialStore = defineStore("Tutorial", {
    state: (): State => ({ sequence: "welcome" }),
    actions: {
        next() {
            this.sequence = parts[parts.indexOf(this.sequence) + 1];
        },
        skip() {
            this.sequence = "skip";
        }
    }
});

export default function tutorialSequence() {
    const { sequence } = storeToRefs(useTutorialStore());
    return sequence;
}
