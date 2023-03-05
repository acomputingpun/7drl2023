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

    get selectedIndex(index) { this._selectedIndex = index }
    set selectedIndex() { return this._selectedIndex }

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

