import * as vecs from '/es/vectors.js'
import * as hacks from '/es/hacks.js'

import * as menus from '/es/ui/menus.js'

export class PauseMenuPanel extends menus.MenuPanel {
    constructor(...rest) {
        super(new menus.PresetMenu([
            new menus.MenuItem("New Game", "n"),
            new menus.MenuItem("Map Generation Sandbox", "m"),
            new menus.MenuItem("Settings", "s"),
            new menus.MenuItem("Exit", "x")
        ]), ...rest)
        this.settingsMenuPanel = new SettingsMenuPanel(this)
    }

    get originShift() { return vecs.Vec2(10,10) }
    get panelSize() { return vecs.Vec2(30, 4) }

    warpSelectItem(selectedItem) {
        if (selectedItem.data == "s") {
            this.ren.transferWarp(this.settingsMenuPanel.focusWarp)
        } else {
        }
    }

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
            new menus.MenuItem("Reduce Tile Size", "r"),
            new menus.MenuItem("Increase Tile Size", "i"),
            new menus.MenuItem("Done", "d")
        ]), ...rest)
    }

    warpSelectItem(selectedItem) {
        if (selectedItem.data == "r") {
            this.ter.setTileSize( Math.max(this.ter.tileSize - 2, 6) )
        } else if (selectedItem.data == "i") {
            this.ter.setTileSize( Math.min(this.ter.tileSize + 2, 24) )
        } else if (selectedItem.data == "d") {
            this.warpCancel()
        } else {

        }
    }

    get originShift() { return vecs.Vec2(10,10) }
    get panelSize() { return vecs.Vec2(30, 3) }
}