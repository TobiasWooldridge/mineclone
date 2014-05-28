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

