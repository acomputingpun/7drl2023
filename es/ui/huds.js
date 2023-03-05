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
        this.ter.textLine(xDraw, yDraw, `(${menuItem.data}) ${menuItem.text}`)
    }

    get originShift() { return vecs.Vec2(0,0) }
}
