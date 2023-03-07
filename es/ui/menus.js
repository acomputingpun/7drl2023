import * as vecs from '/es/vectors.js'
import * as dirconst from '/es/dirconst.js'
import * as hacks from '/es/hacks.js'
import * as utils from '/es/utils.js'
import * as errs from '/es/errs.js'

import * as panels from '/es/ui/panels.js'
import * as warps from '/es/ui/warps.js'

export var DPRINT_MENU_SELECTIONS = true

export class MenuItem {
    constructor (text=hacks.argPanic(), data=hacks.argPanic(), ...rest) {
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
    setSelectedByIndex(index) { this._selectedIndex = index }
    setSelectedByData(data) { this._selectedIndex = this.lookupIndexByData(data) }

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
    constructor (menuItems=hacks.argPanic(), ...rest) {
        super(...rest)
        this._menuItems = menuItems
    }
    
    getMenuItems() { return this._menuItems }
}

export class MenuPanel extends panels.Panel {
    constructor(menu=hacks.argPanic(), ...rest) {
        super(...rest)
        this.menu = menu
        this.focusWarp = new MenuPanelWarp(this)

        this._highlightedIndex = null
    }

    get highlightedIndex() { return this._highlightedIndex }
    setHighlightedByIndex(index) { this._highlightedIndex = index }
    setHighlightedByData(data) { this._highlightedIndex = this.menu.lookupIndexByData(data) }
    get highlightedItem() {
        if (this.highlightedIndex !== null) {
            return this.menu.lookupByIndex(this.highlightedIndex)
        } else {
            return null
        }
    }

    drawMenuItemAt(xDraw, yDraw, menuItem) {
        if (menuItem === this.highlightedItem) {
            this.ter.textLine(xDraw, yDraw, menuItem.text, "#111", "#EEE")
        } else {
            this.ter.textLine(xDraw, yDraw, menuItem.text)
        }
    }

    drawContents() {
        let [xOrigin, yOrigin] = this.absOrigin.xy
        let menuItems = this.menu.getMenuItems()

        for (let index = 0; index < menuItems.length; index++) {
            this.drawMenuItemAt(xOrigin, yOrigin+index, menuItems[index])
        }
    }

    warpSelectHighlightedItem() {
        if (this.highlightedItem !== null) {
            hacks.dlog(DPRINT_MENU_SELECTIONS, `SELECT in menuPanel`, this, `w/ highlightedItem`, this.highlightedItem)
            this.warpSelectItem(this.highlightedItem)
        }
    }
    warpSelectItem(item) {
        item.data(this)
    }

    warpCancel() {
        this.ren.transferWarp(this.parent.focusWarp)
    }
}

export class MenuPanelWarp extends warps.Warp {
    get selectedItem() { return this.panel.selectedItem }
    get highlightedItem() { return this.panel.highlightedItem }
    get highlightedIndex() { return this.panel.highlightedIndex }

    warpSelect() {
        this.panel.warpSelectHighlightedItem()
    }
    warpCancel() {
        this.panel.warpCancel()
    }

    warpCardinal(card) {
        hacks.dlog(DPRINT_MENU_SELECTIONS, `CARDINAL ${card} in menuPanelWarp`, this)
        if (this.panel.highlightedItem !== null) {
            let nItems = this.panel.menu.getMenuItems().length
            if (card === dirconst.N) {
                this.panel.setHighlightedByIndex((this.highlightedIndex + nItems - 1) % nItems)
            } else if (card === dirconst.S) {
                this.panel.setHighlightedByIndex((this.highlightedIndex + 1) % nItems)
            }
        }
    }

    onEnterWarp(source) {
        if (source === this.panel.parent.focusWarp) {
            this.panel.parent.children.push(this.panel)
            this.panel.setHighlightedByIndex(0)
        } else if (source === null) {
            this.panel.setHighlightedByIndex(0)
        }
    }
    onExitWarp(dest) {
        if (dest === this.panel.parent.focusWarp) {
            utils.aRemove(this.panel.parent.children, this.panel)
        }
    }
}