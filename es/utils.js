export function median3 (a, b, c) {
    return a+b+c - Math.max(a, b, c) - Math.min(a, b, c)
}

var LOG_PRECISION = 100000
export function log(base, n) {
    return Math.round((Math.log(n) * LOG_PRECISION) / Math.log(base)) / LOG_PRECISION
}

export function toHalfbell(raw) {
    if (raw <= 0) {
        return 0
    } else if (raw >= 1) {
        return 0
    } else {
        return log(0.5, raw)
    }
}

export function aRemove(arr, item) {
    let index = arr.indexOf(item)
    arr.splice(index, 1)
    return item
}
export function aReduce(arr, rfunc) {
    let out = arr[0]
    for (let x of arr.slice(1)) {
        out = rfunc(out, x)
    }
    return out
}
export function aSum(arr) {
    return aReduce(arr, (a,b)=>a+b)
}
export function aZip(a, b) {
    return a.map( (x, i) => [x, b[i]] )
}
export function aWithout(arr, item) {
    let k = [...arr]
    aRemove(k, item)
    return k
}
export function* aReverse(arr) {
    for (let k = arr.length-1; k>=0; k--) {
        yield arr[k];
    }
    
}

export function* span2(s, e) {
    let [xs, ys] = s
    let [xe, ye] = e
    for (let y = ys; y < ye; y++) {
        for (let x = xs; x < xe; x++) {
            yield [x, y]
        }
    }
}