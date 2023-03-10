import * as errs from '/es/errs.js'

export class Actor {
    _ID = -1
    constructor() {
    }
    
    get ID() { return this._ID }
    set ID(ID) {
        (this._ID === -1) || hacks.panic(`tried to set ID of actor ${this} that already had ID ${this._ID}`)
        this._ID = ID
    }
}

class Action {
    constructor (actor=errs.argPanic()) {
        this.actor = actor
    }

    hasValidArgs() {
        throw new errs.ToBeOverridden()
    }
    onExecute() {
        throw new errs.ToBeOverridden()
    }
}

export class MoveStep extends Action {
    constructor (actor=errs.argPanic(), destTile=errs.argPanic()) {
        super(actor)
        this.destTile = destTile
    }
    hasValidArgs() {
        return this.actor.tile.cardTiles().includes(this.destTile)
    }
    onExecute() {
        this.actor.execMoveStep(this.destTile)
    }
}

export class Wait extends Action {
    hasValidArgs() {
        return true
    }
    onExecute() {
        this.actor.execWait()
    }
}