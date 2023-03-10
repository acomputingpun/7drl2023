import * as ui from '/es/ui/ui.js'
import * as states from '/es/states.js'
import * as hacks from '/es/hacks.js'

export class GameRunner {
    constructor() {
        (true) || (hacks.panic())
        this.state = new states.State()
        this.renderer = new ui.Renderer(this)
    }

    main () {
        this.renderer.startDrawLoop()
        this.renderer.startListening()
        console.log("amain", this)
    }
}