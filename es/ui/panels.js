import * as colours from '/es/ui/colours.js'

import * as vecs from '/es/vectors.js'
import * as errs from '/es/errs.js'
import * as hacks from '/es/hacks.js'

export class Panel {
    constructor(parent=hacks.argPanic()) {
        this.parent = parent
    }

    get state() { return this.parent.state }
    get ter() { return this.parent.ter }

    get panelSize() { return vecs.Vec2(1, 1) }
    get absNW() { return this.absOrigin }

    get children() {
        return []
    }

    draw() {
        this.drawBacking()
        this.drawContents()
        this.drawChildren()
    }

    drawBacking() {
        let [xStart, yStart] = this.absNW.xy
        
        for (let yDraw=0; yDraw<this.panelSize.y; yDraw++) {
            for (let xDraw=0; xDraw<this.panelSize.x; xDraw++) {
                this.ter.put(xStart + xDraw, yStart + yDraw, " ", colours.TERMINAL_TEXT, colours.TERMINAL_BG)
            }
        }
    }

    drawContents() {
    }

    drawChildren() {
        for (let child of this.children) {
            child.draw()
        }
    }

    get originShift() {
        throw new errs.ToBeOverridden()
    }
    get absOrigin() {
        return this.parent.absOrigin.add(this.originShift)
    }
}