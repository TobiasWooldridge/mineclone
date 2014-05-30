var gl;

var renderer = (function () {

    var canvas;

    var mvMatrix;
    var shaderProgram;
    var vertexPositionAttribute;
    var vertexNormalAttribute;
    var textureCoordAttribute;
    var perspectiveMatrix;

    var lastUpdateTime = 0;

    var entities = [];
    var lines = [];
    var textures = {};

    var gravity = [0, -20, 0];


    function initWebGL() {
        gl = null;

        try {
            gl = canvas.getContext("webgl");
        }
        catch (e) {
        }

        // If we don't have a GL context, give up now
        if (!gl) {
            alert("Unable to initialize WebGL. Your browser may not support it.");
        }
    }

    var angle = 20;

    function drawEntities() {

        var currentTime = (new Date).getTime();
        var timeDelta = Math.min(currentTime - lastUpdateTime, 1000 / 20);
        lastUpdateTime = currentTime;


        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


        var cameraPosition = [0.0, 2, -30.0];

        loadIdentity();
        mvTranslate(cameraPosition);
        mvPushMatrix();
        mvRotate(20, [1, 0, 0]);
        mvRotate(angle++, [0, 1, 0]);


        var fieldOfView = 45;
        var aspectRatio = 16 / 9;
        var minRenderDistance = 0.1;
        var maxRenderDistance = 100;
        perspectiveMatrix = makePerspective(fieldOfView, aspectRatio, minRenderDistance, maxRenderDistance);

        // Draw all entities
        for (var entityIndex = 0; entityIndex < entities.length; entityIndex++) {
            mvPushMatrix();

            var entity = entities[entityIndex];

            if (!entity.attributes.stationary) {
                entity.accelerate(gravity, timeDelta);
                entity.move(timeDelta);

                for (var i = 0; i < 3; i++) {
                    if (entity.position[i] < -10 || entity.position[i] > 10) {
                        entity.position[i] = Math.max(-10, Math.min(entity.position[i], 10));
                        entity.velocity[i] *= -1;
                    }
                }
            }

            mvTranslate(entity.position);

            gl.bindBuffer(gl.ARRAY_BUFFER, entity.vertexBuffer);
            gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, entity.normalBuffer);
            gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, entity.textureCoordBuffer);
            gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

            // Set the texture
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, textures["stone"]);
            gl.uniform1i(shaderProgram.samplerUniform, 0);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, entity.vertexIndexBuffer);

            setMatrixUniforms();
            gl.drawElements(gl.TRIANGLES, entity.triangles * 3, gl.UNSIGNED_SHORT, 0);

            mvPopMatrix();
        }


        // Draw all lines
        mvPushMatrix();

        for (var lineIndex = 0; lineIndex < lines.length; lineIndex++) {
            var line = lines[lineIndex];

            gl.bindBuffer(gl.ARRAY_BUFFER, line.vertexBuffer);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, line.indexBuffer);

            gl.vertexAttribPointer(shaderProgram.aposAttrib, 3, gl.FLOAT, false, 0, 0);
            gl.lineWidth(1.0);
            gl.uniform4f(shaderProgram.colorUniform, 1, 0, 0, 1);

            setMatrixUniforms();
            gl.drawElements(gl.LINES, 2, gl.UNSIGNED_SHORT, 0);
        }

        mvPopMatrix();


        mvPopMatrix();
    }

    function initShaders() {
        var fragmentShader = getShader(gl, "blinnPhong-fs");
        var vertexShader = getShader(gl, "blinnPhong-vs");

        // Create the shader program

        shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        // If creating the shader program failed, alert

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Unable to initialize the shader program.");
        }

        gl.useProgram(shaderProgram);

        vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(vertexPositionAttribute);

        vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
        gl.enableVertexAttribArray(vertexNormalAttribute);

        textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
        gl.enableVertexAttribArray(textureCoordAttribute);
    }

    function getShader(gl, id) {
        var shaderScript = document.getElementById(id);

        // Didn't find an element with the specified ID; abort.
        if (!shaderScript) {
            return null;
        }

        // Walk through the source element's children, building the
        // shader source string.
        var theSource = "";
        var currentChild = shaderScript.firstChild;

        while (currentChild) {
            if (currentChild.nodeType == 3) {
                theSource += currentChild.textContent;
            }

            currentChild = currentChild.nextSibling;
        }

        // Now figure out what type of shader script we have,
        // based on its MIME type.

        var shader;

        if (shaderScript.type == "x-shader/x-fragment") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (shaderScript.type == "x-shader/x-vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;  // Unknown shader type
        }

        // Send the source to the shader object
        gl.shaderSource(shader, theSource);

        // Compile the shader program
        gl.compileShader(shader);

        // See if it compiled successfully

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }

    function initTextures(images) {
        for (var imageName in images) {
            if (!images.hasOwnProperty(imageName)) {
                continue;
            }

            var texture = gl.createTexture();
            texture.image = images[imageName];

            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images[imageName]);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.bindTexture(gl.TEXTURE_2D, null);

            textures[imageName] = texture;
        }
    }

    //
    // Matrix utility functions
    //

    function loadIdentity() {
        mvMatrix = Matrix.I(4);
    }

    function multMatrix(m) {
        mvMatrix = mvMatrix.x(m);
    }

    function mvTranslate(v) {
        multMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
    }

    function setMatrixUniforms() {
        var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));

        var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
        gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix.flatten()));

        var normalMatrix = mvMatrix.inverse();
        normalMatrix = normalMatrix.transpose();
        var nUniform = gl.getUniformLocation(shaderProgram, "uNormalMatrix");
        gl.uniformMatrix4fv(nUniform, false, new Float32Array(normalMatrix.flatten()));
    }

    var mvMatrixStack = [];

    function mvPushMatrix(m) {
        if (m) {
            mvMatrixStack.push(m.dup());
            mvMatrix = m.dup();
        } else {
            mvMatrixStack.push(mvMatrix.dup());
        }
    }

    function mvPopMatrix() {
        if (!mvMatrixStack.length) {
            throw("Can't pop from an empty matrix stack.");
        }

        mvMatrix = mvMatrixStack.pop();
        return mvMatrix;
    }

    function mvRotate(angle, v) {
        var inRadians = angle * Math.PI / 180.0;

        var m = Matrix.Rotation(inRadians, $V([v[0], v[1], v[2]])).ensure4x4();
        multMatrix(m);
    }


    function start(models, images) {
        canvas = document.getElementById("glcanvas");

        initWebGL(canvas);

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        initShaders();
        initTextures(images);

        entities = [
//            createCube(2, palette.red, [-5, 5, 5], [0, 0, 0]),
            createScaledEntity(2, models.cube, [0, 5, 0]),
            createScaledEntity(2, createSphere(2.5), [-5, 5, 0])
//            createPlatform(100, palette.green, [0, -11, 0], [0, 0, 0], { stationary: true })
        ];

        lines = [];

        setInterval(drawEntities, 1000 / 75);
    }

    return {
        start: start
    }

})();