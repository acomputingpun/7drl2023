import * as errs from '/es/errs.js'
import * as vecs from '/es/vectors.js'
import * as utils from '/es/utils.js'

import * as colours from '/es/ui/colours.js'
import * as fonts from '/es/ui/fonts.js'
import * as uiconst from '/es/ui/uiconst.js'

import * as ui_sheets from '/es/ui/sheets.js'
import * as ui_grids from '/es/ui/grids.js'
import * as ui_huds from '/es/ui/huds.js'

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
    constructor(renderer=hacks.argPanic(), ...rest) {
        super(...rest)

        this._renderer = renderer
        this.sheet = new ui_sheets.ColourTextSpriteSheet()

        this.TILES_ON_SCREEN = vecs.Vec2(72, 56)

        this._initMatrices()
        this._children = []
    }

    get originShift() { return vecs.Vec2(0, 0) }
    get absOrigin() { return vecs.Vec2(0, 0) }

    get children() { return this._children }
    drawChildren() {
        for (let child of utils.aReverse(this.children)) {
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

    putGlyph(xTer, yTer, glyph) {
        if (this._glyphMatrix[yTer][xTer] !== glyph) {
            this._glyphMatrix[yTer][xTer] = glyph
            this._dirtyMatrix[yTer][xTer] = true
        }
    }
    put(xTer, yTer, glyph=null, fg=null, bg=null) {
        if (glyph !== null && glyph != this._glyphMatrix[yTer][xTer]) {
            this._glyphMatrix[yTer][xTer] = glyph
            this._dirtyMatrix[yTer][xTer] = true
        }
        if (fg !== null && fg != this._fgMatrix[yTer][xTer]) {
            this._fgMatrix[yTer][xTer] = fg
            this._dirtyMatrix[yTer][xTer] = true
        }
        if (bg !== null && bg != this._bgMatrix[yTer][xTer]) {
            this._bgMatrix[yTer][xTer] = bg
            this._dirtyMatrix[yTer][xTer] = true
        }
    }
        
    textLine(xTer, yTer, text, fg=null, bg=null) {
        for (let glyph of text) {
            this.put(xTer, yTer, glyph, fg, bg)
            xTer += 1
        }
    }

    textClip(xTer, yTer, xWidth, text, fg=null, bg=null) {
        for (let xShift = Math.min(xWidth, text.width)-1; xShift >= 0; xShift--) {
            this.put(xTer+xShift, yTer, glyph, fg, bg)
        }            
    }

    textWrap(xTer, yTer, xWidth, text, fg=null, bg=null) {
        let words = text.split(' ')
        let line = ''

        for (let word of words) {
            if (line.length + word.length > xWidth) {
                if (line.length > 0) {
                    this.textLine(xTer, yTer, line, fg, bg)
                    line = ''
                    yTer += 1
                } else {
                    while (word.length > 0) {
                        this.textLine(xTer, yTer, word.slice(0, xWidth))
                        word = word.slice(xWidth)
                        yTer += 1
                    }
                }
            } else {
                line = line + ' ' + word
            }
        }
        this.textLine(xTer, yTer, line, fg, bg)
        
        return yTer
    }

    wrapText(text, xDraw, yDraw, xWidth, yLineHeight) {
        let words = text.split(' ')
        let line = ''

        let yShift = 0

        for (let word of words) {
            let metric = this.ctx.measureText(line + word + ' ')
            if (metric.width > xWidth) {
                this.ctx.fillText(line, xDraw, yDraw+yShift)
                yShift += yLineHeight
                line = word + ' '
            } else {
                line = line + word + ' '
            }
        }
        this.ctx.fillText(line, xDraw, yDraw+yShift)
        yShift += yLineHeight
        return yShift
    }


    markDirty(tX, tY) {
        this._dirtyMatrix[tY][tX] = true
    }
    markDirtyRect(rect) {
        throw new errs.Panic(`Not yet implemented... to be written!`)
    }
}

export class Terminal extends _Terminal {
    constructor(...rest) {
        super(...rest)
        if (DEBUG_TWOPASS_DRAW) {
            this._drawTilesLoop = this.twopass_drawTilesLoop
            this._drawGlyph = this.twopass_drawGlyph
            this._drawBG = this.twopass_drawBG
        } else {
            this._drawTilesLoop = this.onepass_drawTilesLoop
            this._drawGlyph = this.onepass_drawGlyph
        }

        this.gridPanel = new ui_grids.GridPanel(this)
        this.pauseMenuPanel = new ui_huds.PauseMenuPanel(this)
 
        this._children = [this.pauseMenuPanel]
    }
}