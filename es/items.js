import * as errs from '/es/errs.js'
import * as hacks from '/es/hacks.js'

class ItemSlot {
    constructor(parent=hacks.argPanic()) {
        this.parent = parent
    }

    _removeItem(item) { throw new errs.ToBeOverridden() }
    _putItem(item) { throw new errs.ToBeOverridden() }
    get contents() { throw new errs.ToBeOverridden() }
}

export class SingleItemSlot extends ItemSlot {
    constructor(...rest) {
        super(...rest)
        this._item = null
    }
    
    _putItem(item) {
        (this._item === null) || hacks.panic(`tried to place item ${item} in full itemSlot`)
        (item.slot === null) || hacks.panic(`tried to place item ${item} in slot ${this} but it already had a slot!`)
        this._item = item
    }
    _removeItem(item) {
        (this._item === item) || hacks.panic(`tried to remove item ${item} from itemSlot that didn't contain it (contained ${this.contents}`)
        this._item = null
    }

    get contents() { return [this._item] }
}

export class MultipleItemSlot extends ItemSlot {
    constructor(...rest) {
        super(...rest)
        this._items = []
    }

    _putItem(item) {
        (item.slot === null) || hacks.panic(`tried to place item ${item} in slot ${this} but it already had a slot!`)
        this._items.push(item)
    }
    _removeItem(item) {
        (this._items.includes(item)) || hacks.panic(`tried to remove item ${item} from itemSlot that didn't contain it (contained ${this.items}`)
        utils.aRemove(this._items, item)
    }
    
    get contents() { return [this._items] }
}

export class Item {
    constructor() {
        this._slot = null
    }
    
    get slot() { return this._itemSlot }    
    set slot(newSlot) {
        if (this._slot !== null) {
            this._slot._removeItem(this)
            this._slot = null
        } 
        if (newSlot !== null) {
            newSlot._putItem(this)
            this._slot = newSlot
        }
    }
    
    set host(newHost) {
        this.slot = newHost.itemSlot
    }
    get host() { return this.slot.host }
}