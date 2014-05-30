function createNormals(model) {
    if (model.vertexNormals.length > 0) {
        return;
    }

    var normalsByIndex = [];

    // Calculate every normal value for each vertex
    for (var i = 0; i < model.vertexIndices.length; i += 3) {
        var triangleIndices = model.vertexIndices.slice(i, i + 3);
        var vertices = triangleIndices.map(function (x) {
            return getVertex(model.vertices, x);
        });

        var normal = calculateNormal(vertices[0], vertices[1], vertices[2]);

        for (var v = 0; v < 3; v++) {
            normalsByIndex[triangleIndices[v]] = normalsByIndex[triangleIndices[v]] || [];
            normalsByIndex[triangleIndices[v]].push(normal);
        }
    }

    for (var i = 0; i < model.vertices.length / 3; i++) {
        var normal = [0, 0, 0];
        for (var j = 0; j < normalsByIndex[i].length; j++) {
            normal[0] += normalsByIndex[i][j][0];
            normal[1] += normalsByIndex[i][j][1];
            normal[2] += normalsByIndex[i][j][2];
        }

        normal = normalize(normal);

        _.push3(model.vertexNormals, normal);
    }
}

function createEntity(model, position, velocity, attributes) {
    position = position || [0, 0, 0];
    velocity = velocity || [0, 0, 0];
    attributes = attributes || {};

    var vertexBuffer = createWebGLFloatArrayBuffer(model.vertices);

    var vertexIndexBuffer = createIndexBuffer(model.vertexIndices);

    var normalBuffer = createWebGLFloatArrayBuffer(model.vertexNormals);

    var textureCoordBuffer = createWebGLFloatArrayBuffer(model.vertexTextureCoords);
    textureCoordBuffer.itemSize = 2;
    textureCoordBuffer.numItems = model.numTriangles * 2;

    var entity = {
        model: model,
        vertexBuffer: vertexBuffer,
        vertexIndexBuffer: vertexIndexBuffer,
        normalBuffer: normalBuffer,
        textureCoordBuffer: textureCoordBuffer,
        triangles: model.numTriangles,
        position: position,
        velocity: velocity,
        move: function move(timestep) {
            position[0] += velocity[0] * (timestep / 1000);
            position[1] += velocity[1] * (timestep / 1000);
            position[2] += velocity[2] * (timestep / 1000);
        },
        accelerate: function accelerate(gravity, timestep) {
            velocity[0] += gravity[0] * (timestep / 1000);
            velocity[1] += gravity[1] * (timestep / 1000);
            velocity[2] += gravity[2] * (timestep / 1000);
        },
        attributes: attributes
    }

    return entity;
}

function createScaledEntity(scale, model, position, velocity, attributes) {
    model.vertices = model.vertices.map(function(x) { return x * scale; } );

    return createEntity(model, position, velocity, attributes);
}

function createLine(from, to) {
    return {
        vertexBuffer: createWebGLFloatArrayBuffer(from.concat(to)),
        indexBuffer: createIndexBuffer([0, 1])
    };
}

function createWebGLFloatArrayBuffer(data) {
    var buffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

    return buffer;
}

function createIndexBuffer(data) {
    var buffer = gl.createBuffer();

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.STATIC_DRAW);

    return buffer;
}


function createPlatform(size, color, position, velocity, attributes) {
    var vertices = [
        // Top face
        -1.0, 0.0, -1.0,
        -1.0, 0.0, 1.0,
        1.0, 0.0, 1.0,
        1.0, 0.0, -1.0
    ].map(function (x) {
            return x * size / 2;
        });

    var normals = [
        // Top
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0
    ];

    var vertexIndices = [
        0, 1, 2,
        0, 2, 3
    ];

    return createEntity(createModel("Plane", vertices, vertexIndices, normals, color), position, velocity, attributes);
}
