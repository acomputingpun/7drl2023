import * as utils from '/es/utils.js'

export class Vector2 {
    constructor(x,y) {
        this.x=x
        this.y=y
        this.xy = [x, y]
    }
    add(other){
        return new Vector2(this.x+other.x,this.y+other.y)
    }
    iAdd(x, y){
        return new Vector2(this.x+x,this.y+y)
    }
    sub(other){
        return new Vector2(this.x-other.x,this.y-other.y)
    }
    iSub(x, y){
        return new Vector2(this.x-x,this.y-y)
    }
    sMul(scalar){
        return new Vector2(this.x*scalar,this.y*scalar)
    }
    lMul(other){
        return new Vector2(this.x*other.x,this.y*other.y)
    }
    floor() {
        return new Vector2(Math.floor(this.x), Math.floor(this.y))
    }

    rotCW() {
        return new Vector2(-this.y, this.x)
    }
    rotCCW() {
        return new Vector2(this.y, -this.x)
    }
    reverse() {
        return new Vector2(-this.x, -this.y)
    }

    get mag(){
        return ((this.x**2+this.y**2)**0.5)
    }
    get norm() {
        return this.sMul(1/this.mag)
    }
    distTo(other){
        return other.sub(this).mag
    }

    interp(frac, other){
        return this.add(other.sub(this).sMul(frac))
    }

    toString() {
        return `(${this.x},${this.y})`
    }

    eq(other) {
        return this.x == other.x && this.y == other.y
    }
}

export function median3(v1, v2, v3) {
    return new Vector2( utils.median3(v1.x, v2.x, v3.x), utils.median3(v1.y, v2.y, v3.y) )
}

export function Vec2(x,y) {
    return new Vector2(x, y)
}

export function arrToVecs(xys) {
    let ret = []
    for (let xy of xys) {
        ret.push(Vec2(xy[0], xy[1]))
    }
    return ret
}