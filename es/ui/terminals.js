import * as errs from '/es/errs.js'
import * as vecs from '/es/vectors.js'

import * as colours from '/es/ui/colours.js'
import * as fonts from '/es/ui/fonts.js'
import * as uiconst from '/es/ui/uiconst.js'

import * as ui_sheets from '/es/ui/sheets.js'
import * as ui_grids from '/es/ui/grids.js'


let DEBUG_ALWAYS_DRAW = true
let DEBUG_TWOPASS_DRAW = true

class _TerminalExtensions {
// ONE-PASS TERMINAL DRAWING FUNCTIONS
    onepass_drawTilesLoop() {
        this.ctx.textBaseline = "middle"
        this.ctx.textAlign = "center"
        this.ctx.font = fonts.TERMINAL_TEXT

        for (let xDraw = 0; xDraw < this.TILES_ON_SCREEN.x; xDraw++) {
            for (let yDraw = 0; yDraw < this.TILES_ON_SCREEN.y; yDraw++) {
                if (DEBUG_ALWAYS_DRAW || this._dirtyMatrix[yDraw][xDraw] ) {
                    this._drawGlyph (xDraw, yDraw)
                    this._dirtyMatrix[yDraw][xDraw] = false
                }
            }
        }
    }

    onepass_drawGlyph(xDraw, yDraw) {
        let [xCanvas, yCanvas] = this.tToCPos(xDraw, yDraw)
        let _glyph = this._glyphMatrix[yDraw][xDraw]
        let _fg = this._fgMatrix[yDraw][xDraw]
        let _bg = this._bgMatrix[yDraw][xDraw]

        if (_glyph !== null) {
            let sprite = this.sheet.lookup(_glyph, _fg, _bg)
            this.ctx.drawImage(sprite, xCanvas, yCanvas)
        }
    }

// TWO-PASS TERMINAL DRAWING FUNCTIONS
    twopass_drawTilesLoop() {
        for (let xDraw = 0; xDraw < this.TILES_ON_SCREEN.x; xDraw++) {
            for (let yDraw = 0; yDraw < this.TILES_ON_SCREEN.y; yDraw++) {
                if (DEBUG_ALWAYS_DRAW || this._dirtyMatrix[yDraw][xDraw] ) {
                    this._drawBG (xDraw, yDraw)
                }
            }
        }
        for (let xDraw = 0; xDraw < this.TILES_ON_SCREEN.y; xDraw++) {
            for (let yDraw = 0; yDraw < this.TILES_ON_SCREEN.y; yDraw++) {
                if (DEBUG_ALWAYS_DRAW || this._dirtyMatrix[yDraw][xDraw] ) {
                    this._drawGlyph (xDraw, yDraw)
                    this._dirtyMatrix[yDraw][xDraw] = false
                }
            }
        }
    }

    twopass_drawGlyph(xDraw, yDraw) {
        let [xCanvas, yCanvas] = this.tToCPos(xDraw, yDraw)
        let _glyph = this._glyphMatrix[yDraw][xDraw]
        let _fg = this._fgMatrix[yDraw][xDraw]

        let sprite = this.sheet.lookup(_glyph, _fg)
        this.ctx.drawImage(sprite, xCanvas, yCanvas)
    }
    twopass_drawBG(xDraw, yDraw) {
        let [xCanvas, yCanvas] = this.tToCPos(xDraw, yDraw)
        let _bg = this._bgMatrix[yDraw][xDraw]

        this.ctx.fillStyle = _bg
        this.ctx.fillRect(xCanvas, yCanvas, uiconst.TILE_SIZE, uiconst.TILE_SIZE)
    }

// FALLBACK DRAWING FUNCTIONS
    fallback_drawGlyph(xDraw, yDraw) {
        let [xCanvas, yCanvas] = this.tToCPos(xDraw, yDraw)
        let _glyph = this._glyphMatrix[yDraw][xDraw]
        let _fg = this._fgMatrix[yDraw][xDraw]
        let _bg = this._bgMatrix[yDraw][xDraw]

        this.ctx.fillStyle = colours._bg
        this.ctx.fillRect(xCanvas, yCanvas, uiconst.TILE_SIZE, uiconst.TILE_SIZE)
        this.ctx.fillStyle = colours._fg
        this.ctx.fillText(`${_glyph}`[0], xCanvas+uiconst.TILE_MID_OFFSET, yCanvas+uiconst.TILE_MID_OFFSET)
    }
}

class _Terminal extends _TerminalExtensions {
    constructor(renderer=hacks.argPanic()) {
        super(...arguments)

        this._renderer = renderer
        this.sheet = new ui_sheets.ColourTextSpriteSheet()

        this.TILES_ON_SCREEN = vecs.Vec2(36, 24)

        this._initMatrices()
        this._children = []
    }

    get originShift() { return vecs.Vec2(0, 0) }
    get absOrigin() { return vecs.Vec2(0, 0) }

    get children() { return this._children }
    drawChildren() {
        for (let child of this.children) {
            child.draw()
        }
    }

    get renderer() { return this._renderer }
    get state() { return this.renderer.runner.state }
    get ctx() { return this.renderer.ctx }

    get ter() { return this }
    
    tToCVec(tVec) { return tVec.sMul(uiconst.TILE_SIZE) }
    tToCPos(tX, tY) { return [tX*uiconst.TILE_SIZE, tY*uiconst.TILE_SIZE] }

    cToTVec(cVec) { return cVec.sMul(1/uiconst.TILE_SIZE).floor() }
    cToTPos(cX, cY) { return [Math.floor(cX / uiconst.TILE_SIZE), Math.floor(cY / uiconst.TILE_SIZE)] }

    draw() {
        this.drawChildren()
        this._drawTilesLoop()
    }

    _initMatrices() {
        this._glyphMatrix = []
        this._fgMatrix = []
        this._bgMatrix = []
        this._dirtyMatrix = []
        for (let yTile = 0; yTile < this.TILES_ON_SCREEN.y; yTile++) {
            let glyphRow = []
            let fgRow = []
            let bgRow = []
            let dirtyRow = []

            for (let xTile = 0; xTile < this.TILES_ON_SCREEN.x; xTile++) {
                glyphRow.push(" ")
                fgRow.push(colours.WHITE)
                bgRow.push(colours.BLACK)
                dirtyRow.push(true)
            }

            this._glyphMatrix.push(glyphRow)
            this._fgMatrix.push(fgRow)
            this._bgMatrix.push(bgRow)
            this._dirtyMatrix.push(dirtyRow)
        }
    }
    
    _drawTilesLoop() {
        throw new errs.ToBeOverridden()  
    }
    _drawGlyph(xDraw, yDraw) {
        throw new errs.ToBeOverridden()  
    }
    _drawBG(xDraw, yDraw) {
        throw new errs.ToBeOverridden()
    }

    putGlyph(pX, pY, glyph) {
        if (this._glyphMatrix[pY][pX] !== glyph) {
            this._glyphMatrix[pY][pX] = glyph
            this._dirtyMatrix[pY][pX] = true
        }
    }
    put(pX, pY, glyph=null, fg=null, bg=null) {
        if (glyph !== null && glyph != this._glyphMatrix[pY][pX]) {
            this._glyphMatrix[pY][pX] = glyph
            this._dirtyMatrix[pY][pX] = true
        }
        if (fg !== null && fg != this._fgMatrix[pY][pX]) {
            this._fgMatrix[pY][pX] = fg
            this._dirtyMatrix[pY][pX] = true
        }
        if (bg !== null && bg != this._bgMatrix[pY][pX]) {
            this._bgMatrix[pY][pX] = bg
            this._dirtyMatrix[pY][pX] = true
        }
    }
        
    markDirty(tX, tY) {
        this._dirtyMatrix[tY][tX] = true
    }
    markDirtyRect(rect) {
        throw new errs.Panic(`Not yet implemented... to be written!`)
    }
}

export class Terminal extends _Terminal {
    constructor() {
        super(...arguments)
        if (DEBUG_TWOPASS_DRAW) {
            this._drawTilesLoop = this.twopass_drawTilesLoop
            this._drawGlyph = this.twopass_drawGlyph
            this._drawBG = this.twopass_drawBG
        } else {
            this._drawTilesLoop = this.onepass_drawTilesLoop
            this._drawGlyph = this.onepass_drawGlyph
        }

        this._children = [new ui_grids.GridPanel(this)]
    }
}