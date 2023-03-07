import * as dirconst from '/es/dirconst.js'
import * as hacks from '/es/hacks.js'

let DPRINT_VALID_KEYS = true
let DPRINT_INVALID_KEYS = true

export class Warp {
    constructor(panel=hacks.argPanic()) {
        this._panel = panel
    }
    
    get panel() { return this._panel }
    get ren() { return this.panel.ren }
    
    warpKeydown(ev) {
        switch(ev.key) {
        case "Enter":
        case "Space":
            hacks.dlog(DPRINT_VALID_KEYS, "key: Select")
            this.warpSelect()
            break
        case "Escape":
            hacks.dlog(DPRINT_VALID_KEYS, "key: Cancel")
            this.warpCancel()
            break
        case "ArrowDown":
        case "2":
            hacks.dlog(DPRINT_VALID_KEYS, "key: arrow s")
            this.warpCardinal(dirconst.S)
            break
        case "ArrowUp":
        case "8":
            hacks.dlog(DPRINT_VALID_KEYS, "key: arrow n")
            this.warpCardinal(dirconst.N)
            break
        case "ArrowLeft":
        case "4":
            hacks.dlog(DPRINT_VALID_KEYS, "key: arrow w")
            this.warpCardinal(dirconst.W)
            break
        case "ArrowRight":
        case "6":
            hacks.dlog(DPRINT_VALID_KEYS, "key: arrow e")
            this.warpCardinal(dirconst.E)
            break
        case "Clear":
        case "5":
            hacks.dlog(DPRINT_VALID_KEYS, "key: arrow in_place")
            this.warpCardinal(dirconst.IN_PLACE)
            break
        default:
            hacks.dlog(DPRINT_INVALID_KEYS, "invalid key:", ev.key, "w/event", ev)
        }
    }

    warpSelect() {
    }
    warpCancel() {
    }
    warpCardinal(card) {
    }
    warpNumeric(val) {
        hacks.dlog(DPRINT_VALID_KEYS, "key: numeric ${val}")
    }

    onEnterWarp(source=hacks.argPanic()) {
    }
    onExitWarp(dest=hacks.argPanic()) {
    }

    toString() { return `warp ${this.constructor.name}` }
}