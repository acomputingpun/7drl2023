import * as vecs from '/es/vectors.js'
import * as levels from '/es/levels.js'

export class State {
    constructor() {
        this.level = new levels.Level()
    }
    
    get grid() { return this.level.grid }
}
