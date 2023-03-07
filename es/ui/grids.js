import * as errs from '/es/errs.js'
import * as vecs from '/es/vectors.js'

import * as panels from '/es/ui/panels.js'
import * as warps from '/es/ui/warps.js'
import * as uiconst from '/es/ui/uiconst.js'

export class GridPanel extends panels.Panel {
    constructor(...rest) {
        super(...rest)
        this.xyWorldOrigin = vecs.Vec2(0, 0)
    }

    get originShift() { return vecs.Vec2(1, 5) }
    get panelSize() { return uiconst.TILES_ON_SCREEN }

    get grid() {
        throw new errs.ToBeOverridden()
    }

    drawBacking() {
    }
    drawContents() {
        let [xDrawOrigin, yDrawOrigin] = this.absNW.xy
        let grid = this.grid
        if (grid !== null) {

            for (let yViewport=this.panelSize.y-1; yViewport>=0; yViewport--) {
                let yWorld = this.xyWorldOrigin.y + yViewport
                for (let xViewport=this.panelSize.x-1; xViewport>=0; xViewport--) {
                    let xWorld = this.xyWorldOrigin.x + xViewport

                    let tile = grid.lookup(xWorld, yWorld)
                    if (tile !== null) {
                        let [xTer, yTer] = [xViewport + xDrawOrigin, yViewport + yDrawOrigin]
                        this.ter.put(xTer, yTer, tile.drawGlyph, tile.drawFG, tile.drawBG)
                    }
                }
            }
        }
    }

    shiftWorldOrigin(vec) {
        this.xyWorldOrigin = this.xyWorldOrigin.add(vec)
//        this.constrainWorldOrigin()
    }
    constrainWorldOrigin() {
        this.xyWorldOrigin = vecs.median3(dirconst.IN_PLACE, this.xyWorldOrigin, this.grid.xySize )
    }
}

export class GridPanelWarp extends warps.Warp {
    get grid() { return this.panel.grid }

    warpCardinal(card) {
        this.panel.shiftWorldOrigin(card)
    }
}
