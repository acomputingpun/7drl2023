import * as vecs from '/es/vectors.js'
import * as hacks from '/es/hacks.js'

import * as panels from '/es/ui/panels.js'
import * as warps from '/es/ui/warps.js'
import * as uiconst from '/es/ui/uiconst.js'
import * as ui_grids from '/es/ui/grids.js'

export class MapgenSandboxPanel extends panels.Panel {
    constructor(mapgen=hacks.argPanic(), ...rest) {
        super(...rest)

        this.mapgen = mapgen
        this.gridPanel = new MapgenGridPanel(this)
        this._children = [this.gridPanel]
    }

    createFocusWarp() {
        return new MapgenWarp(this.gridPanel)
    }


    shiftWorldOrigin(vec) {
        this.gridPanel.shiftWorldOrigin(vec)
    }

    get grid () { return this.mapgen.grid }

    get originShift() { return vecs.Vec2(0, 0) }
    get panelSize() { return uiconst.TILES_ON_SCREEN }
}

export class MapgenGridPanel extends ui_grids.GridPanel {
    constructor(...rest) {
        super(...rest)
    }

    get grid() {
        return this.parent.grid
    }

    createFocusWarp() {
        return new MapgenWarp(this)
    }

    get originShift() { return vecs.Vec2(1, 1) }
    get panelSize() { return vecs.Vec2(30, 30) }
}

export class MapgenWarp extends ui_grids.GridPanelWarp {
}