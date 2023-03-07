import * as errs from '/es/errs.js'

export function panic (text) {
    throw new errs.Panic(text)
}
export function argPanic () {
    throw new errs.Panic(`Argument error!`)
}

export function dlog(flag, ...args) {
    if (flag) {
        console.log(...args)
    }
}

export function cachedLookup(dFunc=hacks.argPanic(), eff=argPanic()) {
    return () => {
        let dirtyID = dFunc()
        if (eff.__dirtyID !== dirtyID) {
            eff.__dirtyID = dirtyID
            eff.__cachedValue = eff()
        }
        return eff.__cachedValue
    }
}

export class _Map {
    constructor () {
        this._inner = new Map();
    }
    
    set() { return this._inner.set(...arguments) }
    get() { return this._inner.get(...arguments) }
    has() { return this._inner.has(...arguments) }

    keys() { return this._inner.keys(...arguments) }
    values() { return this._inner.values(...arguments) }
    entries() { return this._inner.entries(...arguments) }

    isEmpty() { return [...this.keys()].length == 0 }
}