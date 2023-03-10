import * as vecs from '/es/vectors.js'
import * as grids from '/es/grids.js'

import * as terrains from '/es/terrains.js'
import * as pseudo from '/es/pseudo.js'
import * as levels from '/es/levels.js'

export class MapGenerator {
    constructor() {
        this._level = new levels.Level()
        
        this.fillRandomly()
        this.grid.debugPrint()
    }
    
    prefill() {
        for (let tile of this.grid.iterTiles()) {
        }
    }

    fillRandomly() {
        let seed = 1
        for (let tile of this.grid.iterTiles()) {
            if (pseudo.uniform(seed, 0, 1) < 0.9) {
                tile.terrain = new terrains.Floor(tile)
            } else {
                tile.terrain = new terrains.Wall(tile)
            }
            seed += 1
        }
    }

    get level() { return this._level }
    get grid() { return this.level.grid }
}