import * as ui from '/es/ui/ui.js'
import * as states from '/es/states.js'

export class GameRunner {
    constructor() {
        this.state = new states.State()
        this.renderer = new ui.Renderer(this)
    }

    main () {
        this.renderer.startDrawLoop()
        this.renderer.startListening()
        console.log("amain", this)
    }
}