import type { Updatable } from "../../bot/sdk/entities";

export const nextFrame = Symbol("waitForNextFrame");

type WaitUntilTrue = () => boolean;

type Wait = typeof nextFrame | number | WaitUntilTrue;

export type Behavior = Generator<Wait, any, number>;

export class BehaviorRunner implements Updatable {
    private readonly generator: Behavior;
    private done = false;
    private wait: Wait | undefined;
    private waitTime: number = 0;

    constructor(generator: Behavior) {
        this.generator = generator;
    }

    tick(deltaSeconds: number): boolean | void {
        while (!this.done) {
            if (!this.wait) {
                const result = this.generator.next(deltaSeconds);
                if (result.done) {
                    this.done = true;
                    break;
                }
                this.wait = result.value;
                if (typeof this.wait === "number")
                    this.waitTime = this.wait;
            }
            if (this.wait === nextFrame) {
                this.wait = undefined;
                break;
            }
            else if (typeof this.wait === "number") {
                if ((this.waitTime -= deltaSeconds) <= 0)
                    this.wait = undefined;
                else
                    break;
            } else if (typeof this.wait === "function") {
                if (!this.wait())
                    this.wait = undefined;
            } else
                break;
        }
    }
}
