export default class TileUpdatedEvent extends Event {
    /** @type {Tile} */
    tile;

    /** @param tile {Tile} */
    constructor(tile) {
        super("tileupdated");
        this.tile = tile;
    }
}
