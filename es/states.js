import * as vecs from '/es/vectors.js'
import * as grids from '/es/grids.js'

export class State {
    constructor() {
        this.level = new Level()
    }
    
    get grid() { return this.level.grid }
}

export class Level {
    constructor() {
        this.grid = new grids.Grid( vecs.Vec2(24, 24) )
    }
}