function verifyModel(model) {
    // Check all vertex indices are valid
    for (var i = 0; i < model.vertexIndices.length; i++) {
        var vertexIndex = model.vertexIndices[i];
        if (model.vertices[vertexIndex] === undefined) {
            throw ("Illegal vertex index (" + vertexIndex + ")");
        }
    }


    // Check there is the correct number of normals specified
    if (model.vertices.length != model.vertexNormals.length) {
        throw ("Illegal number of vertex normals for model", model);
    }

    // Check there is the correct number of colors specified
    if (model.vertices.length/3 != model.vertexTextureCoords.length/2) {
        throw ("Illegal number of texture coords for model", model);
    }

    return model;
}

function createModel(name, vertices, vertexIndices, vertexNormals, vertexTextureCoords) {
    var numTriangles = vertexIndices.length / 3;
    var numVertices = vertices.length / 3;

    var model = {
        name: name,
        vertices: vertices,
        vertexIndices: vertexIndices,
        vertexNormals: vertexNormals,
        vertexTextureCoords: vertexTextureCoords,
        numTriangles: numTriangles,
        numVertices: numVertices
    };


    createNormals(model);

    verifyModel(model);

    return model;
}


function createSphere() {
    // Taken from http://learningwebgl.com/lessons/lesson11/index.html
    var radius = 1;
    var latitudeBands = 20;
    var longitudeBands = 20;

    var vertices = [];
    var normals = [];
    var vertexTextureCoords = [];
    for (var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
        var theta = latNumber * Math.PI / latitudeBands;
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);

        for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
            var phi = longNumber * 2 * Math.PI / longitudeBands;
            var sinPhi = Math.sin(phi);
            var cosPhi = Math.cos(phi);

            var x = cosPhi * sinTheta;
            var y = cosTheta;
            var z = sinPhi * sinTheta;
            var u = 1 - (longNumber / longitudeBands);
            var v = 1 - (latNumber / latitudeBands);

            vertices.push(x, y, z);
            normals.push(x, y, z);
            vertexTextureCoords.push(u, v);
        }
    }

    vertices.map(function (x) {
        return x * radius;
    });

    var vertexIndices = [];
    for (var latNumber = 0; latNumber < latitudeBands; latNumber++) {
        for (var longNumber = 0; longNumber < longitudeBands; longNumber++) {
            var first = (latNumber * (longitudeBands + 1)) + longNumber;
            var second = first + longitudeBands + 1;
            vertexIndices.push(first);
            vertexIndices.push(second);
            vertexIndices.push(first + 1);

            vertexIndices.push(second);
            vertexIndices.push(second + 1);
            vertexIndices.push(first + 1);
        }
    }


    return createModel("Sphere", vertices, vertexIndices, normals, vertexTextureCoords);
}