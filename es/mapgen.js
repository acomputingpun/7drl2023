import * as vecs from '/es/vectors.js'
import * as grids from '/es/grids.js'

export class MapGenerator {
    constructor(level) {
        this._level = level
    }
    
    prefill() {
        for (let tile of this.iterTiles()) {
        }
    }
    
    get level() { return this._level }
    get grid() { return this.level.grid }
}