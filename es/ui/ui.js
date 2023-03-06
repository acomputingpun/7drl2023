import * as hacks from '/es/hacks.js'
import * as vecs from '/es/vectors.js'
import * as fonts from '/es/ui/fonts.js'
import * as colours from '/es/ui/colours.js'

import * as ui_terminals from '/es/ui/terminals.js'
import * as warps from '/es/ui/warps.js'
import * as ui_huds from '/es/ui/huds.js'

let DRAW_DEBUG = true
let DDRAW_CANVAS_OUTLINE = true
let DDRAW_MS = true
let DPRINT_WARP_TRANSFERS = true

export class Renderer {
    constructor(runner) {
        this.runner = runner
        this._activeWarp = null

        this.initCanvas()
        this.initTerminal()

        this._oldDrawTimes = [0,0,0,0,0,0,0,0,0]
    }

    initCanvas() {
        this.canvas = document.createElement("canvas")
        this.canvas.oncontextmenu = function(e) { e.preventDefault(); }
        this.ctx = this.canvas.getContext("2d");  // If this semicolon is removed, the next line doesn't get executed properly.  Why?  Who knows, it's Javascript!

        [this.canvas.width, this.canvas.height] = [10, 10]
        document.body.appendChild(this.canvas)
    }
    adjustCanvasSize(xSize, ySize) {
        [this.canvas.width, this.canvas.height] = [xSize, ySize]
    }

    initTerminal() {
        this.terminal = new ui_terminals.Terminal(this)
    }

    warpKeydown(ev) {
        this._activeWarp.warpKeydown(ev)
    }

    startListening() {
        console.log("this is", this)
        this.transferWarp(this.terminal.pauseMenuPanel.focusWarp)
        window.addEventListener('keydown', this.warpKeydown.bind(this), false)
    }

    transferWarp(warp) {
        hacks.dlog(DPRINT_WARP_TRANSFERS, `Transferring from warp ${this._activeWarp} to ${warp}`)
        if (this._activeWarp !== null) {
            this._activeWarp.onExitWarp(warp)
        }
        let oldActiveWarp = this._activeWarp
        this._activeWarp = warp
        if (this._activeWarp !== null) {
            this._activeWarp.onEnterWarp(oldActiveWarp)
        }
    }

    startDrawLoop() {
        this.firstDrawMS = Date.now()
        this.requestAnimationFrame = window.requestAnimationFrame.bind(window)
        this.requestAnimationFrame( this.drawLoop.bind(this) )

    }
    drawLoop() {
        this.drawMS = Date.now()
        this.draw()
        this.requestAnimationFrame( this.drawLoop.bind(this) )
    }
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.terminal.draw(this)

        if (DRAW_DEBUG) {
            this.drawDebug()
        }
    }
    drawDebug() {
        this.ctx.font = fonts.DEBUG_TEXT
        this.ctx.fillStyle=colours.DEBUG_TEXT
        this.ctx.strokeStyle=colours.DEBUG_TEXT
        this.ctx.textAlign = "left"
        this.ctx.textBaseline = "top"

        if (DDRAW_MS) {
            let drawTime = Date.now() - this.drawMS
            this._oldDrawTimes = [...this._oldDrawTimes.slice(1), drawTime]

            this.ctx.fillText("TrueMS " + (this.drawMS - this.firstDrawMS), 2, 2)
            this.ctx.fillText("prevFrames " + (this._oldDrawTimes), 2, 12)
        }

        if (DDRAW_CANVAS_OUTLINE) {
            this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height)
        }
    }
}