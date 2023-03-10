import * as vecs from '/es/vectors.js'
import * as errs from '/es/errs.js'
import * as utils from '/es/utils.js'

import * as grids from '/es/grids.js'

export class Level {
    constructor() {
        this.grid = new grids.Grid( vecs.Vec2(24, 24) )
        
        this.initCounter = new InitCounter()
    }
 
    registerActor (newActor) {
        newActor.ID = this._nextActorID++
        this.initCounter.addActor(newActor)
    }

    get nextActor() { return this.initCounter.nextActor }
    
    executeAction(action) {
        action.actor === this.nextActor || hacks.panic("tried to execute action for actor out of turn!")
        action.hasValidArgs() || hacks.panic("tried to execute action without valid arguments!")
        action.onExecute()
    }
}

class InitCounter {
    TIME_DEBT_INCREMENT = 10000
    //TODO: Modify this to use an ordered data structure - a priority-based heap or something?
    constructor() {
        this.actors = []
        this.timeDebtTiebreaker = 0
    }

    includes(actor) {
        return this.actors[actor]
    }

    addActor(actor) {
        actor._timeDebt = this.timeDebtTiebreaker++
    }
    removeActor(actor) {
        utils.aRemove(actor, this.actors)
    }

    get nextActor() {
        if (this.actors.length > 0) {
            let best = this.actors[0]
            for (let actor of this.actors) {
                if (actor._timeDebt < best._timeDebt) {
                    best = actor
                }
            }
            if (best._timeDebt > 0) {
                this.advanceGlobalTime(best._timeDebt)
            }
            return best
        } else {
            return null
        }
    }
    
    advanceGlobalTime(delta) {
        for (let actor of this.actors) {
            actor._timeDebt -= delta
        }
    }
    
    advanceTimeOf(actor) {
        this.actors.includes(actor) || hacks.panic("advancing time of actor not in initiative count")
        actor._timeDebt += this.TIME_DEBT_INCREMENT
    }
}