import * as hacks from '/es/hacks.js'

import * as grids from '/es/grids.js'
import * as actions from '/es/actions.js'

class MobActor extends actions.Actor {
    constructor(mob=hacks.argPanic(), ...rest) {
        super(...rest)
        this.mob=mob
    }
    
    get tile() { return this.mob.tile }
}

export class Mob extends grids.Occupant {
    drawGlyph = "a"
    drawFG = "#FF0"

    constructor (...rest) {
        super(...rest)
        
        this.actor = new MobActor(this)
    }
}