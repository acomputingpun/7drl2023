import * as errs from '/es/errs.js'

export function argPanic () {
    throw new errs.Panic(`Argument error!`)
}

export function dlog(flag, ...args) {
    if (flag) {
        console.log(...args)
    }
}

export function cachedLookup(caller=argPanic(), eff=argPanic()) {
    return () => {
        if (eff.__dirtyID !== caller._dirtyID) {
            eff.__dirtyID = caller._dirtyID
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