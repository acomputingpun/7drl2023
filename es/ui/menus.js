import * as vecs from '/es/vectors.js'
import * as hacks from '/es/hacks.js'
import * as errs from '/es/errs.js'

import * as panels from '/es/ui/panels.js'

export class MenuItem {
    constructor (text, data) {
        this._text = text
        this._data = data
    }
    get data() {
        return this._data
    }
    get text() {
        return this._text
    }
}

export class Menu {
    constructor () {
        this._selectedIndex = null;
    }

    get selectedIndex() { return this._selectedIndex }
    set selectedIndex(index) { this._selectedIndex = index }

    getMenuItems() {
        throw new errs.ToBeOverridden()
    }

    get selectedItem() {
        if (this._selectedIndex !== null) {
            return this.lookupByIndex(this._selectedIndex)
        } else {
            return null
        }
    }
    get selectedData() {
        if (this._selectedIndex !== null) {
            return this.lookupByIndex(this._selectedIndex).data
        } else {
            return null
        }
    }
    get selectedText() {
        if (this._selectedIndex !== null) {
            return this.lookupByIndex(this._selectedIndex).text
        } else {
            return null
        }
    }

    lookupByIndex(index) {
        let menuItems = this.getMenuItems()
        if (0<=index && index < menuItems.length) {
            return menuItems[index];
        } else {
            return null;
        }
    }
    lookupByData(data) {
        let menuItems = this.getMenuItems()
        for (let menuItem of menuItems) {
            if (menuItem.data === data) {
                return menuItem
            }
        }
        return null
    }

    lookupIndexByData(data) {
        let menuItems = this.getMenuItems()
        for (let index = 0; index < menuItems.length; index++) {
            if (menuItems[k].data === data) {
                return index
            }
        }
        return null
    }
}

export class PresetMenu extends Menu {
    constructor (menuItems, ...rest) {
        super(...rest)
        this._menuItems = menuItems
    }
    
    getMenuItems() { return this._menuItems }
}

export class MenuPanel extends panels.Panel {
    constructor(menu = hacks.argPanic(), ...rest) {
        super(...rest)
        this.menu = menu
    }

    drawMenuItemAt(xDraw, yDraw, menuItem) {
        this.ter.textLine(xDraw, yDraw, menuItem.text)
    }

    drawContents() {
        let [xOrigin, yOrigin] = this.absOrigin.xy
        let menuItems = this.menu.getMenuItems()

        for (let index = 0; index < menuItems.length; index++) {
            this.drawMenuItemAt(xOrigin, yOrigin+index, menuItems[index])
        }
    }
}
