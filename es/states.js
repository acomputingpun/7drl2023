import * as vecs from '/es/vectors.js'

import * as levels from '/es/levels.js'
import * as heros from '/es/heros.js'

export class State {
    constructor() {
        this.hero = new heros.Hero()
        this.level = new levels.Level()
        
        this.level.registerActor(this.hero)
        this.hero.tile = this.level.grid.lookup(4, 4)
    }
    
    get grid() { return this.level.grid }
}
