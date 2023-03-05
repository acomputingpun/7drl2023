import * as genconst from '/es/genconst.js'

import * as vecs from '/es/vectors.js'
import * as fonts from '/es/ui/fonts.js'
import * as colours from '/es/ui/colours.js'

import * as ui_terminals from '/es/ui/terminals.js'

export class Renderer {
    constructor(runner) {
        this.initCanvas()
        this.initTerminal()
        this.initListeners()

        this.runner = runner

        this._oldDrawTimes = [0,0,0,0,0,0,0,0,0]
    }

    initCanvas() {
        this.canvas = document.createElement("canvas")
        this.canvas.oncontextmenu = function(e) { e.preventDefault(); }
        this.ctx = this.canvas.getContext("2d");  // If this semicolon is removed, the next line doesn't get executed properly.  Why?  Who knows, it's Javascript!

        [this.canvas.width, this.canvas.height] = genconst.mainCanvasSize
        document.body.appendChild(this.canvas)
    }

    initTerminal() {
        this.terminal = new ui_terminals.Terminal(this)
    }
    initListeners() {
        window.addEventListener('keydown', this.warpKeydown.bind(this), false)
    }

    warpKeydown(ev) {
        console.log(`pressed key ${ev.keyCode}, ev is`, ev)
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

        this.drawDebug()
    }
    drawDebug() {
        let drawTime = Date.now() - this.drawMS
        this._oldDrawTimes = [...this._oldDrawTimes.slice(1), drawTime]

        this.ctx.font = fonts.SMALL_TEXT
        this.ctx.fillStyle=colours.DEBUG_TEXT
        this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.textAlign = "left"
        this.ctx.textBaseline = "top"
        this.ctx.fillText("TrueMS " + (this.drawMS - this.firstDrawMS), 2, 2)
        this.ctx.fillText("prevFrames " + (this._oldDrawTimes), 2, 12)
    }
}