import type { Gizmo } from "../../util/gizmos";

export default class AddGizmosEvent extends Event {
    readonly gizmos: Gizmo[];

    constructor(gizmos: Gizmo[]) {
        super("addgizmos");
        this.gizmos = gizmos;
    }
}
