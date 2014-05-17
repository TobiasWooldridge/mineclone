function vectorDifference(a, b) {
    var c = [];

    for (var i = 0; i < a.length; i++) {
        c.push(a[i] - b[i]);
    }

    return c;
}



//Set Vector U to (Triangle.p2 minus Triangle.p1)
//Set Vector V to (Triangle.p3 minus Triangle.p1)
//
//Set Normal.x to (multiply u[1] by v[2]) minus (multiply u[2] by v[1])
//Set Normal.y to (multiply u[2] by v[0]) minus (multiply u[0] by v[2])
//Set Normal.z to (multiply u[0] by v[1]) minus (multiply u[1] by v[0])



function magnitude(v) {
    return v.reduce(function(x, y) { return x + y});
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

    normal = normalize(normal);

    normal = normal.map(function(x) { return x * -1 });

    return normal;
}