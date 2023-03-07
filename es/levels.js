import * as grids from '/es/grids.js'
import * as vecs from '/es/vectors.js'

export class Level {
    constructor() {
        this.grid = new grids.Grid( vecs.Vec2(24, 24) )
    }
}
