import * as vecs from '/es/vectors.js'
import * as hacks from '/es/hacks.js'

import * as menus from '/es/ui/menus.js'
import * as panels from '/es/ui/panels.js'

let DEBUG_INITIAL_MESSAGES = ["text", "more text", "another message"]

export class PauseMenuPanel extends menus.MenuPanel {
    constructor(...rest) {
        super(new menus.PresetMenu([
            new menus.MenuItem("New Game", () => null),
            new menus.MenuItem("Map Generation Sandbox", () => null),
            new menus.MenuItem("Settings", (panel) => panel.ren.transferWarp(panel.settingsMenuPanel.focusWarp)),
            new menus.MenuItem("Exit", () => null)
        ]), ...rest)
        this.settingsMenuPanel = new SettingsMenuPanel(this)
    }

    get originShift() { return vecs.Vec2(10,10) }
    get panelSize() { return vecs.Vec2(30, 4) }

    warpCancel() {
        if (this.state === null) {
            console.log("can't cancel pause menu - there is no state!")
        } else {
            throw errs.Panic(`Not yet implemented!`)
        }
    }
}
export class SettingsMenuPanel extends menus.MenuPanel {
    constructor(...rest) {
        super(new menus.PresetMenu([
            new menus.MenuItem("Reduce Tile Size", (panel) => panel.ter.adjustTileSize(-2) ),
            new menus.MenuItem("Increase Tile Size", (panel) => panel.ter.adjustTileSize(+2) ),
            new menus.MenuItem("Back", (panel) => panel.warpCancel())
        ]), ...rest)
    }

    get originShift() { return vecs.Vec2(0,0) }
    get panelSize() { return vecs.Vec2(30, 3) }
}

export class MessageTickerPanel extends panels.Panel {
    get originShift() { return vecs.Vec2(0,0) }
    get panelSize() { return vecs.Vec2(40, 4) }

    constructor(...rest) {
        super(...rest)

        this.messages = []
        for (let message of DEBUG_INITIAL_MESSAGES) {
            this.postMessage(message)
        }
    }

    drawContents() {
        let [xDraw, yDraw] = this.absOrigin.xy
        for (let message of this.messages) {
            yDraw = this.ter.textWrap(xDraw, yDraw, this.panelSize.x, message)+1
        }
    }

    postMessage(message) {
        this.messages.push(message)
    }
}