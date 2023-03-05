import * as hacks from '/es/hacks.js'
import * as errs from '/es/errs.js'

import * as colours from '/es/ui/colours.js'
import * as fonts from '/es/ui/fonts.js'

import * as uiconst from '/es/ui/uiconst.js'

let DPRINT_CACHE_MISSES = true

class _SpriteSheet extends hacks._Map {
    lookup() {
        let flatArgs = this.flattenArgs(...arguments)
        if (!this.has(flatArgs)) {
            this.set(flatArgs, this.createSprite(...arguments))
        }
        return this.get(flatArgs)
    }

    flattenArgs() {
        throw new errs.ToBeOverridden()  
    }

    createSprite() {
        throw new errs.ToBeOverridden()  
    }
}

export class TextSpriteSheet extends _SpriteSheet {
    flattenArgs(glyph) {
        return `${glyph}`[0]
    }

    createSprite(glyph) {
        let oCan = new OffscreenCanvas(uiconst.TILE_SIZE, uiconst.TILE_SIZE)
        oCan.ctx = oCan.getContext("2d")

        oCan.ctx.font = fonts.TERMINAL_TEXT
        oCan.ctx.textAlign = "center"
        oCan.ctx.textBaseline = "middle"

        oCan.ctx.clearRect(0, 0, uiconst.TILE_SIZE, uiconst.TILE_SIZE)

        oCan.ctx.fillStyle = colours.BLACK
        oCan.ctx.fillText(`${glyph}`[0],  uiconst.TILE_MID_OFFSET, uiconst.TILE_MID_OFFSET )

        oCan.ctx.globalCompositeOperation = "source-in"
    
        return oCan
    }
}

export class ColourTextSpriteSheet extends _SpriteSheet {
    flattenArgs(glyph=null, fg=null, bg=null) {
        return `${glyph}`[0] + `${fg}` + `${bg}`
    }

    createSprite(glyph=null, fg=null, bg=null) {
        let oCan = new OffscreenCanvas(uiconst.TILE_SIZE, uiconst.TILE_SIZE)
        let oCtx = oCan.getContext("2d")

        hacks.dlog(DPRINT_CACHE_MISSES, "spritesheet cache miss: glyph", glyph, "fg", fg, "bg", bg)

        if (bg !== null) {
            oCtx.fillStyle = bg
            oCtx.fillRect(0, 0, uiconst.TILE_SIZE, uiconst.TILE_SIZE)

            oCtx.drawImage(this.lookup(glyph, fg), 0, 0)
            return oCan
        } else if (fg !== null) {
            oCtx.clearRect(0, 0, uiconst.TILE_SIZE, uiconst.TILE_SIZE)
            oCtx.drawImage(this.lookup(glyph), 0, 0)
            oCtx.globalCompositeOperation = "source-in"
            oCtx.fillStyle = fg
            oCtx.fillRect(0, 0, uiconst.TILE_SIZE, uiconst.TILE_SIZE)
            return oCan
        } else if (glyph !== null) {
            oCtx.clearRect(0, 0, uiconst.TILE_SIZE, uiconst.TILE_SIZE)

            oCtx.font = fonts.TERMINAL_TEXT
            oCtx.textAlign = "center"
            oCtx.textBaseline = "middle"
            oCtx.fillStyle = colours.BLACK
            oCtx.fillText(`${glyph}`[0],  uiconst.TILE_MID_OFFSET, uiconst.TILE_MID_OFFSET )

            return oCan
        } else {
            throw new errs.Panic(`Request to create sprite with null glyph!`)
        }
    }
}