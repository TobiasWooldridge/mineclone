function createGraphicsEntity(baseEntity, texture, properties) {
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


    var model = baseEntity.model;

    var vertexBuffer = createWebGLFloatArrayBuffer(model.vertices);

    var vertexIndexBuffer = createIndexBuffer(model.vertexIndices);

    var normalBuffer = createWebGLFloatArrayBuffer(model.vertexNormals);

    var textureCoordBuffer = createWebGLFloatArrayBuffer(model.vertexTextureCoords);

    var graphicsEntity = {
        position: baseEntity.position,
        model: baseEntity.model,
        sharedProperties: baseEntity.properties,
        vertexBuffer: vertexBuffer,
        vertexIndexBuffer: vertexIndexBuffer,
        normalBuffer: normalBuffer,
        textureCoordBuffer: textureCoordBuffer,
        triangles: model.numTriangles,
        texture: texture
    };


    for (var property in properties) {
        if (properties.hasOwnProperty(property)) {
            physicsEntity[property] = properties[property];
        }
    }

    return graphicsEntity;
}