function magnitude(v) {
    return Math.sqrt(v.reduce(function (x, y) {
        return x + Math.pow(y, 2)
    }));
}

function normalize(v) {
    var mag = magnitude(v);
    return v.map(function (x) { return x / mag; });
}

function squareMagnitude(v) {
    return v.map(function (x) { return x * x; }).reduce(function (x, y) { return x + y; });
}

function subtractVector(a, b) {
    if (a.length != b.length) {
        throw "Cannot subtract vectors of different length";
    }

    var result = [];
    for (var i = 0; i < a.length; i++) {
        result.push(a[i] - b[i]);
    }
    return result;
}

function addVector(a, b) {
    if (a.length != b.length) {
        throw "Cannot subtract vectors of different length";
    }

    var result = [];
    for (var i = 0; i < a.length; i++) {
        result.push(a[i] + b[i]);
    }
    return result;
}

