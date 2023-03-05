import * as vecs from '/es/vectors.js'

export const N = vecs.Vec2( 0, -1 )
export const S = vecs.Vec2( 0, +1 )
export const E = vecs.Vec2( +1, 0 )
export const W = vecs.Vec2( -1, 0 )
export const IN_PLACE = vecs.Vec2( 0, 0 )

export const NE = vecs.Vec2( +1, -1 )
export const NW = vecs.Vec2( -1, -1 )
export const SE = vecs.Vec2( +1, +1 )
export const SW = vecs.Vec2( -1, +1 )

export const CARDINALS = [N, S, E, W]
export const DIAGONALS = [NE, NW, SE, SW]
export const PENTAGONALS = [...CARDINALS, IN_PLACE]
export const OCTAGONALS = [...CARDINALS, ...DIAGONALS]
export const NONAGONALS = [...OCTAGONALS, IN_PLACE]

export const ROT_CW = new Map([ [N,E], [E,S], [S,W], [W,N], [NE,SE], [SE,SW], [SW,NW], [NW,NE], [IN_PLACE,IN_PLACE] ]) 
export const ROT_CCW = new Map([ [E,N], [S,E], [W,S], [N,W], [SE,NE], [SW,SE], [NW,SW], [NE,NW], [IN_PLACE,IN_PLACE] ]) 
export const REVERSE = new Map([ [N,S], [E,W], [S,N], [W,E], [NE,SW], [SE,NW], [SW,NE], [NW,SE], [IN_PLACE,IN_PLACE] ]) 

//export const ROT_FUNC = new Map([ [ROT_CW, (vec) => vec.rotCW()], [ROT_CCW, (vec) => vec.rotCCW()], [REVERSE, (vec) => vec.reverse()], [IN_PLACE, (vec) => vec] ])