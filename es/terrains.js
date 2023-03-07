import * as hacks from '/es/hacks.js'

class _Terrain {
    constructor (parent=hacks.argPanic()) {
        this.parent = parent

        this.drawGlyph = "?"
        this.drawFG = "#F00"
        this.drawBG = "#000"
    }
}

export class Wall extends _Terrain {
    constructor (...rest) {
        super(...rest)

        this.drawGlyph = "#"
        this.drawFG = "#888"
        this.drawBG = "#222"
    }
}

export class Floor extends _Terrain {
    constructor (...rest) {
        super(...rest)

        this.drawGlyph = "."
        this.drawFG = "#AAA"
        this.drawBG = "#779"
    }
}