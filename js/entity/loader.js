var loader = (function () {
    function request(method, address, callback) {
        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status == 200) {
                callback(xhr.responseText);
            }
        };

        xhr.open(method, address, true);
        xhr.send();
    }

    var getResource = _.curry(request, ['GET']);

    function parseObj(name, objFile) {
        var vertexBuffer = [], vertexNormalsBuffer = [], facesBuffer = [], vertexTextureCoordsBuffer = [];

        var buffersByLabels = {
            v: vertexBuffer,
            vn: vertexNormalsBuffer,
            vt: vertexTextureCoordsBuffer,
            f: facesBuffer
        };

        var lines = objFile.split("\n");

        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];

            if (line[0] != '#') {
                var tokens = line.split(" ");

                var label = tokens[0];
                var vector = tokens.slice(1);

                if (label == 'vt') {
                    buffersByLabels[label].push([+vector[0], +vector[1]]);
                }
                else if (label == 'f') {
                    _.pushAll(buffersByLabels[label], vector);
                }
                else if (buffersByLabels[label] != undefined) {
                    buffersByLabels[label].push(vector.map(function (x) {
                        return +x;
                    }));
                }
            }
        }


        var vertices = [], vertexIndices = [], vertexTextureCoords = [], vertexNormals = [];

        // HANDLE LOADING OF MODELS THAT MATCH MY OWN DODGY SPEC
        if (facesBuffer[0].split("/").length == 1) {
            for (var i = 0; i < vertexBuffer.length; i++) {
                _.pushAll(vertices, vertexBuffer[i]);
                _.pushAll(vertexNormals, vertexNormalsBuffer[i]);
                _.pushAll(vertexTextureCoords, vertexTextureCoordsBuffer[i]);
            }

            for (var i = 0; i < facesBuffer.length; i++) {
                vertexIndices.push(+facesBuffer[i]);
            }
        }
        // HANDLE LOADING OF ACTUAL .obj FILES
        else {
            var triangles = 0;

            for (var i = 0; i < facesBuffer.length; i++) {
                var face = facesBuffer[i].split("/").map(function (x) {
                    return (+x) - 1;
                });

                // Complex faces are either just vertex
                vertexIndices.push(triangles++);
                _.pushAll(vertices, vertexBuffer[+face[0]]);

                // or Vertex/Texture coordinate
                if (face.length >= 2) {
                    _.pushAll(vertexTextureCoords, vertexTextureCoordsBuffer[+face[1]]);
                }

                // or Vertex/Texture coordinate/Normal
                if (face.length >= 3) {
                    _.pushAll(vertexNormals, vertexNormalsBuffer[+face[2]]);
                }
            }
        }

        return Model.create(name, vertices, vertexIndices, vertexNormals, vertexTextureCoords);
    }

    return {
        getResource: getResource,
        parseObj: parseObj
    };
})();
