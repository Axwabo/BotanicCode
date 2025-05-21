import type { WorldPosition } from "./tile";

export type Gizmo = GizmoDetails & (RectangleGizmo | PointGizmo);

interface GizmoDetails {
    color: string;
    position: WorldPosition;
}

interface RectangleGizmo {
    type: "rectangle";
    width: number;
    height: number;
}

interface PointGizmo {
    type: "point";
    radius: number;
}
