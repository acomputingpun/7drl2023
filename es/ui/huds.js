import * as vecs from '/es/vectors.js'
import * as hacks from '/es/hacks.js'

import * as menus from '/es/ui/menus.js'

class PauseMenu extends menus.PresetMenu {
    constructor(...rest) {
        super([new menus.MenuItem("New Game", "n"), new menus.MenuItem("Map Generation Sandbox", "m"), new menus.MenuItem("Exit", "x")], ...rest)
    }
}

export class PauseMenuPanel extends menus.MenuPanel {
    constructor(...rest) {
        super(new PauseMenu(), ...rest)
    }

    drawMenuItemAt(xDraw, yDraw, menuItem) {
        if (menuItem.data === this.selectedData) {
            this.ter.textLine(xDraw, yDraw, `(${menuItem.data}) ${menuItem.text}`, "#F00", "#00F")
        } else {
            this.ter.textLine(xDraw, yDraw, `(${menuItem.data}) ${menuItem.text}`)
        }
    }

    get originShift() { return vecs.Vec2(10,10) }
    get panelSize() { return vecs.Vec2(30, 3) }
}

export class PauseMenuWarp extends menus.MenuPanelWarp {
    constructor(...rest) {
        super(...rest)
    }

    onEnterWarp() {
        console.log("this is", this)
        this.menu.setSelectedByIndex(0)
    }

    warpSelect() {
        console.log("pressed select w/ selectedItem", this.selectedItem)
    }
    warpCancel() {
        if (this.state === null) {
            console.log("can't cancel pause menu - there is no state!")
        } else {
            throw errs.Panic(`Not yet implemented!`)
        }
    }
}