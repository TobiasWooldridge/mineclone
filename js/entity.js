
function createNormals(model) {
    if (model.vertexNormals.length > 0) {
        return;
    }

    var normalsByIndex = [];

    // Calculate every normal value for each vertex
    for (var i = 0; i < model.vertexIndices.length; i += 3) {
        var triangleIndices = model.vertexIndices.slice(i, i + 3);
        var vertices = triangleIndices.map(function(x) { return getVertex(model.vertices, x); });

        var normal = calculateNormal(vertices[0], vertices[1], vertices[2]);

        for (var v = 0; v < 3; v++) {
            normalsByIndex[triangleIndices[v]] = normalsByIndex[triangleIndices[v]] || [];
            normalsByIndex[triangleIndices[v]].push(normal);
        }
    }

    for (var i = 0; i < model.vertices.length/3; i ++) {
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
    var colorBuffer = createWebGLFloatArrayBuffer(model.vertexColors);

    var entity = {
        model: model,
        vertexBuffer: vertexBuffer,
        vertexIndexBuffer: vertexIndexBuffer,
        normalBuffer: normalBuffer,
        colorBuffer: colorBuffer,
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
    ].map(function (x) { return x * size / 2; });

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

function createCube(size, color, position, velocity, attributes) {
    var vertices = [
        // Front face
        -1.0, -1.0, 1.0,
        1.0, -1.0, 1.0,
        1.0, 1.0, 1.0,
        -1.0, 1.0, 1.0,

        // Back face
        -1.0, -1.0, -1.0,
        -1.0, 1.0, -1.0,
        1.0, 1.0, -1.0,
        1.0, -1.0, -1.0,

        // Top face
        -1.0, 1.0, -1.0,
        -1.0, 1.0, 1.0,
        1.0, 1.0, 1.0,
        1.0, 1.0, -1.0,

        // Bottom face
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, -1.0, 1.0,
        -1.0, -1.0, 1.0,

        // Right face
        1.0, -1.0, -1.0,
        1.0, 1.0, -1.0,
        1.0, 1.0, 1.0,
        1.0, -1.0, 1.0,

        // Left face
        -1.0, -1.0, -1.0,
        -1.0, -1.0, 1.0,
        -1.0, 1.0, 1.0,
        -1.0, 1.0, -1.0
    ].map(function (x) {
            return x * size / 2;
        });

    var normals = [
        // Front
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,

        // Back
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,

        // Top
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,

        // Bottom
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,

        // Right
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,

        // Left
        -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0
    ];

    var vertexIndices = [
        0, 1, 2, 0, 2, 3,    // front
        4, 5, 6, 4, 6, 7,    // back
        8, 9, 10, 8, 10, 11,   // top
        12, 13, 14, 12, 14, 15,   // bottom
        16, 17, 18, 16, 18, 19,   // right
        20, 21, 22, 20, 22, 23    // left
    ];

    return createEntity(createModel("Cube", vertices, vertexIndices, normals, color), position, velocity, attributes);
}


function createSphere(diameter, color, position, velocity, attributes) {
    // Taken from http://learningwebgl.com/lessons/lesson11/index.html
    var radius = diameter / 2;
    var latitudeBands = 20;
    var longitudeBands = 20;

    var vertices = [];
    var normals = [];
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

            normals.push(x, y, z);
            vertices.push(x, y, z);
        }
    }

    vertices.map(function(x) { return x * radius; });

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


    return createEntity(createModel("Sphere", vertices, vertexIndices, normals, color), position, velocity, attributes);
}