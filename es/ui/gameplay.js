import * as vecs from '/es/vectors.js'
import * as hacks from '/es/hacks.js'

import * as panels from '/es/ui/panels.js'
import * as warps from '/es/ui/warps.js'
import * as uiconst from '/es/ui/uiconst.js'
import * as ui_grids from '/es/ui/grids.js'

let DPRINT_INVALID_ACTIONS = false
let DPRINT_VALID_ACTIONS = true

export class GameplayPanel extends panels.Panel {
    constructor(state=hacks.argPanic(), ...rest) {
        super(...rest)

        this.state = state
        this.gridPanel = new GameplayGridPanel(this)
        this._children = [this.gridPanel]
    }

    createFocusWarp() {
        return new GameplayWarp(this)
    }

    get grid() { return this.state.level.grid }
    get hero() { return this.state.hero }

    get originShift() { return vecs.Vec2(0, 0) }
    get panelSize() { return uiconst.TILES_ON_SCREEN }
}

export class GameplayGridPanel extends ui_grids.GridPanel {
    constructor(...rest) {
        super(...rest)
    }

    get grid() {
        return this.parent.grid
    }

    get originShift() { return vecs.Vec2(1, 1) }
    get panelSize() { return vecs.Vec2(30, 30) }
}

export class GameplayWarp extends warps.Warp {

    get hero() { return this.panel.hero }
    get heroTile() { return this.hero.tile }
    
    warpCardinal(card) {
        let destTile = this.heroTile.relTile(card)
        if (destTile === null) {
            hacks.dlog(DPRINT_INVALID_ACTIONS, `can't move to destTile null!`)
        } else {
            hacks.dlog(DPRINT_VALID_ACTIONS, `should now move to destTile ${destTile}!`)
        }
    }
}