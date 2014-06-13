var gl;

var Graphics = function Graphics() {
    var canvas;

    var shaderProgram;
    var mvMatrix;
    var perspectiveMatrix;

    var entities = [];
    var textures = {};

    var cameraAngle = [35, 45, 0];
    var cameraPosition = [0.0, -2, -50.0];

    var focus = { position: [0, 0, 0] };

    function initWebGL() {
        gl = null;

        try {
            gl = canvas.getContext("webgl");
        }
        catch (e) {
            alert("Unable to initialize WebGL. Your browser may not support it.");
            throw e;
        }
    }

    function updatePerspectiveMatrix() {
        var fieldOfView = 45;
        var aspectRatio = canvas.width/canvas.height;
        var minRenderDistance = 0.1;
        var maxRenderDistance = 200;

        var ymax = minRenderDistance * Math.tan(fieldOfView * Math.PI / 360.0);
        var ymin = -ymax;
        var xmin = ymin * aspectRatio;
        var xmax = ymax * aspectRatio;

        perspectiveMatrix = makeFrustum(xmin, xmax, ymin, ymax, minRenderDistance, maxRenderDistance);
    }

    function draw () {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        loadCameraMatrix();
        setPerspectiveMatrixUniform();

        var tickStart = performance.now();

        var model, oldModel;
        var texture, oldTexture;

        // Draw all entities
        for (var entityIndex = 0; entityIndex < entities.length; entityIndex++) {
            var entity = entities[entityIndex];

            model = entity.model;
            texture = entity.sharedProperties.colliding > 0 ? textures.boxRed : entity.texture;

            mvScope(function renderEntity() {
                if (model != oldModel) {
                    gl.bindBuffer(gl.ARRAY_BUFFER, entity.vertexBuffer);
                    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

                    gl.bindBuffer(gl.ARRAY_BUFFER, entity.normalBuffer);
                    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

                    gl.bindBuffer(gl.ARRAY_BUFFER, entity.textureCoordBuffer);
                    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, entity.vertexIndexBuffer);
                }

                if (texture != oldTexture) {
                    // Set the texture
                    gl.activeTexture(gl.TEXTURE0);
                    gl.bindTexture(gl.TEXTURE_2D, texture);
                    gl.uniform1i(shaderProgram.samplerUniform, 0);
                }

                mvTranslate(entity.position);
                mvTranslate(focus.position.map(function (x) {
                    return (-1 * x);
                }));
                setMatrixUniforms();
                gl.drawElements(gl.TRIANGLES, entity.triangles * 3, gl.UNSIGNED_SHORT, 0);
            });

            oldModel = model;
            oldTexture = texture;
        }
//        console.log("Graphics: ", performance.now() - tickStart);
    }

    function loadCameraMatrix() {
        loadIdentity();

        mvTranslate(cameraPosition);
        mvRotate(cameraAngle[0], [1, 0, 0]);
        mvRotate(cameraAngle[1], [0, 1, 0]);
        mvRotate(cameraAngle[2], [0, 0, 1]);

        return mvMatrix;
    }

    function getCameraAngle() {
        return cameraAngle;
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

        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

        shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
        gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

        shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
        gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

        shaderProgram.pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        shaderProgram.mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
        shaderProgram.nUniform = gl.getUniformLocation(shaderProgram, "uNormalMatrix");
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

        return textures;
    }

    function loadIdentity() {
        mvMatrix = Matrix.I(4);
    }

    function multMatrix(m) {
        mvMatrix = mvMatrix.x(m);
    }

    function mvTranslate(v) {
        multMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
    }

    function setPerspectiveMatrixUniform() {
        gl.uniformMatrix4fv(shaderProgram.pUniform, false, new Float32Array(perspectiveMatrix));
    }

    function setMatrixUniforms() {
        gl.uniformMatrix4fv(shaderProgram.mvUniform, false, new Float32Array(mvMatrix.flatten()));
        gl.uniformMatrix4fv(shaderProgram.nUniform, false, new Float32Array(mvMatrix.inverse().transpose().flatten()));
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

    function mvScope(fn) {
        mvPushMatrix();
        fn();
        mvPopMatrix();
    }

    function start() {
        canvas = document.getElementById("glcanvas");

        initWebGL(canvas);

        gl.clearColor(0.509, 0.792, 0.98, 1.0);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        function resize(event) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            gl.viewport(0, 0, window.innerWidth, window.innerHeight);
            updatePerspectiveMatrix();
        }

        // Update canvas size whenever window is resized
        window.addEventListener("resize", resize, false);
        resize();

        initShaders();
    }

    function zoom(by) {
        cameraPosition[2] = Math.max(-100, Math.min(cameraPosition[2] + by, -10));
        console.log(by, cameraPosition[2]);
    }

    function addEntity(entity) {
        entities.push(entity);
    }

    function addEntities(newEntities) {
        _.pushAll(entities, newEntities);
    }

    function setFocus(newFocus) {
        focus = newFocus;
    }

    function getCanvas() {
        return canvas;
    }

    return {
        start: start,
        draw : draw,
        initTextures : initTextures,
        getCameraAngle : getCameraAngle,
        zoom: zoom,
        getViewMatrix: loadCameraMatrix,
        addEntity : addEntity,
        addEntities: addEntities,
        setFocus: setFocus,
        getCanvas: getCanvas
    }
};