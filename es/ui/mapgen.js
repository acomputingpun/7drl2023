import * as vecs from '/es/vectors.js'
import * as hacks from '/es/hacks.js'

import * as panels from '/es/ui/panels.js'
import * as warps from '/es/ui/warps.js'
import * as uiconst from '/es/ui/uiconst.js'
import * as ui_grids from '/es/ui/grids.js'

export class GameplayPanel extends panels.Panel {
    constructor(mapgen=hacks.argPanic(), ...rest) {
        super(...rest)

        this.gridPanel = new GridPanel()
        this._children = [this.gridPanel]
    }

    get originShift() { return vecs.Vec2(1, 5) }
    get panelSize() { return uiconst.TILES_ON_SCREEN }
}

export class MapgenSandboxPanel extends panels.Panel {
    constructor(mapgen=hacks.argPanic(), ...rest) {
        super(...rest)

        this.gridPanel = new MapgenGridPanel(this)

        this._children = [this.gridPanel]
    }

    get originShift() { return vecs.Vec2(0, 0) }
    get panelSize() { return uiconst.TILES_ON_SCREEN }
}

export class MapgenGridPanel extends ui_grids.GridPanel {
    constructor(...rest) {
        super(...rest)

        this.focusWarp = new InteractionWarp(this)
    }

    get originShift() { return vecs.Vec2(0, 0) }
    get panelSize() { return uiconst.TILES_ON_SCREEN }
}

export class InteractionWarp extends ui_grids.GridPanelWarp {
}