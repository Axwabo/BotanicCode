export type TileData = Fence; // TODO: more tile data types

export type Facing = "north" | "east" | "south" | "west";

export interface Fence {
    type: "fence";
    posts: Facing[];
}
