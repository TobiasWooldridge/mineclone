var Model = (function() {
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

    function createNormals(model) {
        if (model.vertexNormals.length > 0) {
            return;
        }

        function getVertex(vertices, index) {
            return vertices.slice(index * 3, (index + 1) * 3);
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
            var normal = vec3.create();
            for (var j = 0; j < normalsByIndex[i].length; j++) {
                normal[0] += normalsByIndex[i][j][0];
                normal[1] += normalsByIndex[i][j][1];
                normal[2] += normalsByIndex[i][j][2];
            }

            vec3.normalize(normal, normal);

            _.push3(model.vertexNormals, normal);
        }
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
            numVertices: numVertices,
            clone : function() {
                return createModel(name,
                    vertices.slice(),
                    vertexIndices.slice(),
                    vertexNormals.slice(),
                    vertexTextureCoords.slice());
            },
            shift : function(offset) {
                var clone = model.clone();

                for (var i = 0; i < clone.vertices.length; i++) {
                    clone.vertices[i] += offset[i % 3];
                }

                return clone;
            },
            scale : function(scale) {
                var clone = model.clone();

                for (var i = 0; i < clone.vertices.length; i++) {
                    clone.vertices[i] *= scale[i % scale.length];
                }

                return clone;
            }
        };

        if (vertexNormals == undefined || vertexNormals.length == 0) {
            createNormals(model);
        }



        verifyModel(model);

        return model;
    }


    function createSphere() {
        // Adapted from http://learningwebgl.com/lessons/lesson11/index.html
        var latitudeBands = 20;
        var longitudeBands = 20;

        var vertices = [];
        var normals = [];
        var vertexTextureCoords = [];
        for (var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
            var theta = latNumber * Math.PI / latitudeBands;

            for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
                var phi = longNumber * 2 * Math.PI / longitudeBands;

                var x = Math.cos(phi) * Math.sin(theta);
                var y = Math.cos(theta);
                var z = Math.sin(phi) * Math.sin(theta);
                var u = 1 - (longNumber / longitudeBands);
                var v = 1 - (latNumber / latitudeBands);

                vertices.push(z, y, x);
                normals.push(z, y, x);
                vertexTextureCoords.push(u, v);
            }
        }

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

    function combineModels(a, b) {
        return createModel(a.name,
            a.vertices.concat(b.vertices),
            // We need to shift the vertex indices, otherwise they'll point to the preceding indices
            a.vertexIndices.concat(b.vertexIndices.map(function(x) { return x + a.vertices.length/3 })),
            a.vertexNormals.concat(b.vertexNormals),
            a.vertexTextureCoords.concat(b.vertexTextureCoords)
        )
    }

    return {
        createSphere : createSphere,
        verify : verifyModel,
        create : createModel,
        combine : combineModels
    }
})();