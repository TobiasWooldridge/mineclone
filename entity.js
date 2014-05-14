function createEntity(vertices, vertexIndices, normals, colors, position, velocity, attributes) {
    var vertexBuffer = createWebGLFloatArrayBuffer(vertices);
    var vertexIndexBuffer = createIndexBuffer(vertexIndices);
    var normalBuffer = createWebGLFloatArrayBuffer(normals);
    var colorBuffer = createWebGLFloatArrayBuffer(colors);

    var entity = {
        vertexBuffer : vertexBuffer,
        vertexIndexBuffer : vertexIndexBuffer,
        normalBuffer : normalBuffer,
        colorBuffer : colorBuffer,
        triangles : vertexIndices.length/3,
        position : position,
        velocity : velocity,
        move : function move (timestep) {
            position[0] += velocity[0] * (timestep / 1000);
            position[1] += velocity[1] * (timestep / 1000);
            position[2] += velocity[2] * (timestep / 1000);
        },
        accelerate : function accelerate (gravity, timestep) {
            velocity[0] += gravity[0] * (timestep / 1000);
            velocity[1] += gravity[1] * (timestep / 1000);
            velocity[2] += gravity[2] * (timestep / 1000);
        },
        attributes : attributes || {}
    }

    return entity;
}

function createLine(from, to) {
    return {
        vertexBuffer : createWebGLFloatArrayBuffer(from.concat(to)),
        indexBuffer : createIndexBuffer([0, 1])
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
    ].map(function(x) { return x * size/2; });

    var normals = [
        // Top
        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0
    ];

    var colors = [
        color    // Front
    ];

    // Convert the array of colors into a table for all the vertices.
    var generatedColors = [];

    for (var j = 0; j < 1; j++) {
        var c = colors[j];

        // Repeat each color four times for the four vertices of the face
        for (var i = 0; i < 4; i++) {
            generatedColors = generatedColors.concat(c);
        }
    }

    var vertexIndices = [
        0,  1,  2,      0,  2,  3    // front
    ];


    return createEntity(vertices, vertexIndices, normals, generatedColors, position, velocity, attributes);
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
    ].map(function(x) { return x * size/2; });

    var normals = [
        // Front
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,

        // Back
        0.0,  0.0, -1.0,
        0.0,  0.0, -1.0,
        0.0,  0.0, -1.0,
        0.0,  0.0, -1.0,

        // Top
        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0,

        // Bottom
        0.0, -1.0,  0.0,
        0.0, -1.0,  0.0,
        0.0, -1.0,  0.0,
        0.0, -1.0,  0.0,

        // Right
        1.0,  0.0,  0.0,
        1.0,  0.0,  0.0,
        1.0,  0.0,  0.0,
        1.0,  0.0,  0.0,

        // Left
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0
    ];

    var colors = [
        color,    // Front
        color,    // Back
        color,    // Top
        color,    // Bottom
        color,    // Right
        color     // Left
    ];

    var vertexIndices = [
        0,  1,  2,      0,  2,  3,    // front
        4,  5,  6,      4,  6,  7,    // back
        8,  9,  10,     8,  10, 11,   // top
        12, 13, 14,     12, 14, 15,   // bottom
        16, 17, 18,     16, 18, 19,   // right
        20, 21, 22,     20, 22, 23    // left
    ];

    // Convert the array of colors into a table for all the vertices.
    var colors = [];

    for (var j = 0; j < vertexIndices.length; j++) {
        // Repeat each color four times for the four vertices of the face
        colors.push(color[0], color[1], color[2], color[3]);
    }



    return createEntity(vertices, vertexIndices, normals, colors, position, velocity, attributes);
}


function createSphere(diameter, color, position, velocity, attributes) {
    // Taken from http://learningwebgl.com/lessons/lesson11/index.html
    var radius = diameter/2;
    var latitudeBands = 20;
    var longitudeBands = 20;

    var vertices = [];
    var normals = [];
    for (var latNumber=0; latNumber <= latitudeBands; latNumber++) {
        var theta = latNumber * Math.PI / latitudeBands;
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);

        for (var longNumber=0; longNumber <= longitudeBands; longNumber++) {
            var phi = longNumber * 2 * Math.PI / longitudeBands;
            var sinPhi = Math.sin(phi);
            var cosPhi = Math.cos(phi);

            var x = cosPhi * sinTheta;
            var y = cosTheta;
            var z = sinPhi * sinTheta;
            var u = 1 - (longNumber / longitudeBands);
            var v = 1 - (latNumber / latitudeBands);

            normals.push(x);
            normals.push(y);
            normals.push(z);

            vertices.push(radius * x);
            vertices.push(radius * y);
            vertices.push(radius * z);
        }
    }

    var vertexIndices = [];
    for (var latNumber=0; latNumber < latitudeBands; latNumber++) {
        for (var longNumber=0; longNumber < longitudeBands; longNumber++) {
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


    var colors = [];
    for (var i = 0; i < vertexIndices.length; i++) {
        colors.push(color[0], color[1], color[2], color[3]);
    }

    return createEntity(vertices, vertexIndices, normals, colors, position, velocity, attributes);
}