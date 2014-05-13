function createEntity(vertices, vertexIndices, colors, position, velocity) {
    var vertexBuffer = createFloat32ArrayBuffer(vertices);
    var colorBuffer = createFloat32ArrayBuffer(colors);
    var vertexIndexBuffer = createIndexBuffer(vertexIndices);


    var entity = {
        vertexBuffer : vertexBuffer,
        colorBuffer : colorBuffer,
        vertexIndexBuffer : vertexIndexBuffer,
        numVertices : vertices.length,
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
        }
    }

    return entity;
}


function createLine(from, to) {
    return {
        vertexBuffer : createFloat32ArrayBuffer(from.concat(to)),
        indexBuffer : createIndexBuffer([0, 1])
    };
}


function createFloat32ArrayBuffer(data) {
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