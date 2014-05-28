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
    if (model.numVertices != model.vertexColors.length / 4) {
        throw ("Illegal number of colors for model", model);
    }

    return model;
}

function createModel(name, vertices, vertexIndices, vertexNormals, colors) {
    var numTriangles = vertexIndices.length / 3;
    var numVertices = vertices.length / 3;

    // Use all-white colors if they're undefined
    if (colors == undefined) {
        colors = [];

        for (var j = 0; j < numVertices; j++) {
            _.push4(colors, palette.white);
        }
    }
    else if (colors.length == 4) {
        var color = colors;
        colors = [];

        for (var j = 0; j < numVertices; j++) {
            _.push4(colors, color);
        }
    }

    console.log(name, colors);

    var model = {
        name: name,
        vertices: vertices,
        vertexIndices: vertexIndices,
        vertexNormals: vertexNormals,
        vertexColors: colors,
        numTriangles: numTriangles,
        numVertices: numVertices
    };


    createNormals(model);

    verifyModel(model);

    return model;
}

