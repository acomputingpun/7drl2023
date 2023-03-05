import * as dirconst from '/es/dirconst.js'
import * as hacks from '/es/hacks.js'

let DPRINT_VALID_KEYS = true
let DPRINT_INVALID_KEYS = true

export class Warp {
    constructor(renderer) {
        this._ren = renderer
    }
    
    get ren() { return this._ren }
    get state() { return this.ren.state }
    
    warpKeydown(ev) {
        switch(ev.key) {
        case "Enter":
        case "Space":
            this.warpSelect()
            break
        case "Escape":
            this.warpCancel()
            break
        case "ArrowDown":
        case "2":
            this.warpCardinal(dirconst.S)
            break
        case "ArrowUp":
        case "8":
            this.warpCardinal(dirconst.N)
            break
        case "ArrowLeft":
        case "4":
            this.warpCardinal(dirconst.W)
            break
        case "ArrowRight":
        case "6":
            this.warpCardinal(dirconst.E)
            break
        case "Clear":
        case "5":
            this.warpCardinal(dirconst.IN_PLACE)
            break
        default:
            hacks.dlog(DPRINT_INVALID_KEYS, "invalid key:", ev.key, "w/event", ev)
        }
    }

    warpSelect() {
        hacks.dlog(DPRINT_VALID_KEYS, "key: Select")
    }
    warpCancel() {
        hacks.dlog(DPRINT_VALID_KEYS, "key: Cancel")
    }
    warpCardinal(card) {
        hacks.dlog(DPRINT_VALID_KEYS, "key: arrow ${card}")
    }
    warpNumeric(val) {
        hacks.dlog(DPRINT_VALID_KEYS, "key: numeric ${val}")
    }

    onEnterWarp() {
    }
    onExitWarp() {
    }
}