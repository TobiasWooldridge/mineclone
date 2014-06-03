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
        var vertices = [], vertexNormals = [], vertexIndices = [], vertexTextureCoords = [];

        var buffersByLabels = {
            v: vertices,
            vn: vertexNormals,
            vt: vertexTextureCoords,
            f: vertexIndices
        }

        var lines = objFile.split("\n");

        var vectorExp = /([a-z]+)\s+([\-0-9\.]+)(?:\/.+)?\s+([\-0-9\.]+)(?:\/.+)?\s+([\-0-9\.]+)(?:\/.+)?/ig;

        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];

            if (line[0] == '#') {
                continue;
            }
            else if (line.match(vectorExp)) {
                var tokens = vectorExp.exec(line);

                var label = tokens[1];
                var vector = tokens.slice(2, 2 + 3);

                if (label == 'vt') {
                    buffersByLabels[label].push(+vector[0], +vector[1]);
                }
                else if (buffersByLabels[label] != undefined) {
                    buffersByLabels[label].push(+vector[0], +vector[1], +vector[2]);
                }
            }
        }

        var model = Model.create(name, vertices, vertexIndices, vertexNormals, vertexTextureCoords);

        return model;
    }

    return {
        getResource : getResource,
        parseObj : parseObj
    };
})();
