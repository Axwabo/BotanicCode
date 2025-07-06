import { defineStore } from "pinia";

function defineParts<T extends string>(...args: T[]): T[] {
    return args;
}

type TutorialPart = typeof parts extends ReadonlyArray<infer T> ? T : never;

const parts = defineParts("welcome", "example", "skip");

interface State {
    sequence: TutorialPart
}

const useTutorialStore = defineStore("Tutorial", {
    state: (): State => ({ sequence: "example" }),
    actions: {
        next() {
            this.sequence = parts[parts.indexOf(this.sequence) + 1];
        },
        skip() {
            this.sequence = "skip";
        }
    }
});

export default useTutorialStore;
