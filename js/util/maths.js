function magnitude(v) {
    return Math.sqrt(v.reduce(function (x, y) {
        return x + Math.pow(y, 2)
    }));
}

function normalize(v) {
    var mag = magnitude(v);
    return v.map(function (x) { return x / mag; });
}