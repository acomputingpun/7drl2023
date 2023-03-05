import * as vecs from '/es/vectors.js'
import * as dirconst from '/es/dirconst.js'

import * as terrains from '/es/terrains.js'

export class Grid {
    constructor(xySize = hacks.argPanic()) {
        this.xySize = xySize
        this._matrix = []

        for (let y = 0; y < this.xySize.y; y++) {
            let row = []
            for (let x = 0; x < this.xySize.x; x++) {
                row.push(new GridTile(x, y, this))
            }
            this._matrix.push(row)
        }
    }

    lookup (x,y) {
        return this._matrix[y][x]
    }
}

export class GridTile {
    constructor (x=hacks.argPanic(), y=hacks.argPanic(), parent=hacks.argPanic()) {
        this.xyPos = vecs.Vec2(x, y)
        this.parent = parent
        
        this.terrain = new terrains.Floor(this)
    }

    relTile(xyRel) {
        return this.parent.lookup( ...this.xyPos.add(xyRel).xy )
    }
    adjTiles() {
        return dirconst.CARDINALS.map( vec => this.relTile(vec) )
    }

    toString() { return `t<${this.xyPos.x},${this.xyPos.y}>` }
}


export class Occupant {
    constructor () {
        this._tile = null
    }
    
    get xyPos() { return this.tile.xyPos }

    get tile() { return this._tile }
    set tile(tile) {
        if (tile !== null) {
            if (tile.occupant !== null) {
                throw errs.Panic(`Tried to set occupant ${this} to tile {tile} but it already contained ${tile.occupant}`)
            }
            tile.occupant = this
        }
        if (this._tile !== null) {
            this._tile.occupant = null
        }
        this._tile = tile
    }
}