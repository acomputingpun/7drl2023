import * as hacks from '/es/hacks.js'

class _Terrain {
    constructor (parent = hacks.argPanic()) {
        this.parent = parent

        this.drawGlyph = "?"
        this.drawFG = "#F00"
        this.drawBG = "#000"
    }
}

export class Wall extends _Terrain {
    constructor () {
        super(...arguments)

        this.drawGlyph = "#"
        this.drawFG = "#555"
        this.drawBG = "#111"
    }
}

export class Floor extends _Terrain {
    constructor () {
        super(...arguments)

        this.drawGlyph = "."
        this.drawFG = "#AAA"
        this.drawBG = "#779"
    }
}