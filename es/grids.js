import * as hacks from '/es/hacks.js'
import * as utils from '/es/utils.js'
import * as vecs from '/es/vectors.js'
import * as dirconst from '/es/dirconst.js'

import * as terrains from '/es/terrains.js'
import * as los from '/es/los/los.js'

export class Grid {
    constructor(xySize = hacks.argPanic()) {
        this.xySize = xySize
        this._matrix = []

        this._matrix = utils.aCreate2( ...this.xySize.xy, (x,y) => new GridTile(x, y, this) )
    }

    lookup (x,y) {
        if (0<=x && x<this.xySize.x && 0<=y && y<this.xySize.y) {
            return this._matrix[y][x]
        } else {
            return null
        }
    }
    iterPoses = hacks.cachedLookup(() => this.xySize, () => {
        let poses = []
        for (let y = 0; y < this.xySize.y; y++) {
            for (let x = 0; x < this.xySize.x; x++) {
                poses.push(vecs.Vec2(x,y))
            }
        }
        return poses
    })
    iterTiles = hacks.cachedLookup(() => this.iterPoses(), () => {
        return this.iterPoses().map(pos => this.lookup(...pos.xy))
    })

    debugPrint() {
        for (let y = 0; y <this.xySize.y; y++) {
            let oStr = ""
            for (let x = 0; x < this.xySize.x; x++) {
                oStr = oStr + `${this.lookup(x, y).terrain.drawGlyph}`[0]
            }
            console.log(oStr)
        }
    }
}

export class GridTile {
    constructor (x=hacks.argPanic(), y=hacks.argPanic(), parent=hacks.argPanic()) {
        this.xyPos = vecs.Vec2(x, y)
        this.parent = parent

        this.losData = new los.LosData(this)
        this.terrain = new terrains.Floor(this)
        this.occupant = null
    }


    get drawGlyph() {
        if (this.occupant !== null) {
            return this.occupant.drawGlyph
        } else {
            return this.terrain.drawGlyph
        }
    }
    get drawFG() {
        if (this.occupant !== null) {
            return this.occupant.drawFG
        } else {
            return this.terrain.drawFG
        }
    }
    get drawBG() {
        return this.terrain.drawBG
    }

    relTile(xyRel) {
        return this.parent.lookup( ...this.xyPos.add(xyRel).xy )
    }
    cardTiles() {
        return dirconst.CARDINALS.map( vec => this.relTile(vec) )
    }
    
    toString() { return `t<${this.xyPos.x},${this.xyPos.y}>` }
}


export class Occupant {
    drawGlyph = "?"
    drawFG = "#888"

    constructor () {
        this._tile = null
    }
    
    get xyPos() { return this.tile.xyPos }

    get tile() { return this._tile }
    set tile(tile) {
        if (tile !== null) {
            (tile.occupant === null) || hacks.panic(`Tried to set occupant ${this} to tile {tile} but it already contained ${tile.occupant}`)
            tile.occupant = this
        }
        if (this._tile !== null) {
            this._tile.occupant = null
        }
        this._tile = tile
    }
}