import * as errs from '/es/errs.js'
import * as vecs from '/es/vectors.js'

import * as panels from '/es/ui/panels.js'

export class GridPanel extends panels.Panel {
    constructor(...rest) {
        super(...rest)        
    }

    get originShift() { return vecs.Vec2(0, 0) }
    get panelSize() { return this.ter.TILES_ON_SCREEN }

    drawBacking() {
    }
    drawContents() {
        let [xOrigin, yOrigin] = this.absNW.xy

        if (this.state !== null && this.state.level !== null && this.state.level.grid !== null) {
            let grid = this.state.level.grid

            for (let yViewport=0; yViewport<this.panelSize.y; yViewport++) {
                for (let xViewport=0; xViewport<this.panelSize.x; xViewport++) {
                    let [xWorld, yWorld] = [xViewport, yViewport]
                    let tile = grid.lookup(xWorld, yWorld)
                    if (tile !== null) {
                        let [xTer, yTer] = [xViewport + xOrigin, yViewport + yOrigin]
                        this.ter.put(xTer, yTer, tile.drawGlyph, tile.drawFG, tile.drawBG)
                    }
                }
            }
        }
    }
}