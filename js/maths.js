function vectorDifference(a, b) {
    var c = [];

    for (var i = 0; i < a.length; i++) {
        c.push(a[i] - b[i]);
    }

    return c;
}

function magnitude(v) {
    return Math.sqrt(v.reduce(function(x, y) { return x + Math.pow(y, 2)}));
}

function normalize(v) {
    var mag = magnitude(v);

    return v.map(function(x) { return x/mag; });
}

function calculateNormal(a, b, c) {
    var u = vectorDifference(b, a);
    var v = vectorDifference(c, a);

    var normal = [
        (u[1] * v[2]) - (u[2] * v[1]),
        (u[2] * v[0]) - (u[0] * v[2]),
        (u[0] * v[1]) - (u[1] * v[0])
    ];

    return normalize(normal);
}