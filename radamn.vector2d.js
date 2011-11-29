module.exports.Vector2D = {};
module.exports.Vector2D.v2Sub = function(a,b) {
    return {
        x:a.x-b.x,
        y: a.y-b.y
    };
}
module.exports.Vector2D.v2Plus = function(a,b) {
    return {
        x:a.x+b.x,
        y: a.y+b.y
    };
}

module.exports.Vector2D.v2MulFactor = function(a,float) {
    return {
        x:a.x*float,
        y: a.y*float
    };
}

module.exports.Vector2D.v2Mul = function(a,b) {
    return {
        x:a.x*b.x,
        y: a.y*b.y
    };
}

module.exports.Vector2D.v2Dot = function(a,b) {
    return a.x * b.x + a.y * b.y;
}

module.exports.Vector2D.v2Div = function(a,b) {
    return {
        x:a.x/b.x,
        y: a.y/b.y
    };
}

module.exports.Vector2D.v2Abs = function(a) {
    return {
        x: Math.abs(a.x),
        y: Math.abs(a.y)
    };
}

module.exports.Vector2D.v2valid = function(a) {
    return !(is_infinite(a.x) || isNaN(a.x) || is_infinite(a.y) || isNaN(a.y));
}
/**
 * @returns b2Vec2
 */
module.exports.Vector2D.v2Min = function(/* const b2Vec2& */ a, /* const b2Vec2& */ b) {
    return b2Vec2(a.x < b.x ? a.x : b.x , a.y < b.y ? a.y : b.y);
}
/**
 * @returns b2Vec2
 */
module.exports.Vector2D.v2Max = function(/* const b2Vec2& */ a, /* const b2Vec2& */ b) {
    return b2Vec2(a.x > b.x ? a.x : b.x , a.y > b.y ? a.y : b.y);
}

module.exports.Vector2D.v2MatrixMul = function(vector, matrix) {
    return b2Vec2(v2Dot(vector, matrix.ex), b2Dot(vector, matrix.ey));
}