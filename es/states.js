import * as vecs from '/es/vectors.js'
import * as grids from '/es/grids.js'

export class State {
    constructor() {
        this.level = new Level()

        console.log("getting poses", this.grid.iterTiles()) 
        console.log("getting poses again!", this.grid.iterTiles()) 
    }
    
    get grid() { return this.level.grid }
}

export class Level {
    constructor() {
        this.grid = new grids.Grid( vecs.Vec2(36, 24) )
    }
}

