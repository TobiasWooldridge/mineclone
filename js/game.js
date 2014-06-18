var Game = function () {
    var physics;
    var graphics;

    var models;
    var textures;

    var levelTick;

    var fpsTimes = [];
    var fpsIdx = 0;
    var fpsSample = 15;

    function tick() {
        var start = window.performance.now();
        var mvMatrix = graphics.getViewMatrix();
        gravity = scaleVector(normalize([-mvMatrix[1], -mvMatrix[5], -mvMatrix[9]]), 5);

        physics.tick(gravity);
        var physicsEnd = window.performance.now();

        graphics.draw();
        var graphicsEnd = window.performance.now();


        if (levelTick != undefined) {
            levelTick();
        }


        // Calculate average FPS time over [fpsSample] frames
        var fpsTime = window.performance.now();
        fpsTimes[fpsIdx] = fpsTime;
        fpsIdx++;
        if (fpsIdx >= fpsSample) {
            fpsIdx = 0;

            // Display FPS/physics time/graphics time every [fpsSample] frames
            var fps = Math.round((fpsSample * 1000) / (fpsTimes[fpsSample - 1] - fpsTimes[0]));
            document.getElementById("fps").textContent = fps;
            document.getElementById("physicsTime").textContent = (physicsEnd - start).toFixed(2);
            document.getElementById("graphicsTime").textContent = (graphicsEnd - physicsEnd).toFixed(2);
        }

        window.requestAnimationFrame(tick);
    }

    // Add an entity to the graphics/physics engines
    function addEntity(model, texture, position, graphicsProperties, physicsProperties) {
        var baseEntity = createEntity(model, position);

        var physicsEntity = createPhysicsEntity(baseEntity, physicsProperties);
        physics.addEntity(physicsEntity);
        baseEntity.physics = physicsEntity;

        var graphicsEntity = createGraphicsEntity(baseEntity, texture, graphicsProperties);
        graphics.addEntity(graphicsEntity);
        baseEntity.graphics = graphicsEntity;

        return baseEntity;
    }

    // Attach UI events, e.g. mouse drag/camera move events
    function attachUIEvents(canvas) {
        var mouseSens = 750;

        function getPoint(event, canvas) {
            return [event.clientX, event.clientY];
        }

        function handleMovement(toPoint) {
            var movement = subtractVector(startPoint, toPoint);

            graphics.getCameraAngle()[1] += (movement[0] / mouseSens * -180);
            graphics.getCameraAngle()[0] += (movement[1] / mouseSens * -180);

            startPoint = toPoint;
        }


        var mouseDown = false;

        var startPoint = [0, 0];

        canvas.addEventListener("mousedown", function (event) {
            mouseDown = true;

            startPoint = getPoint(event, canvas);
        }, false);

        canvas.addEventListener("mousemove", function (event) {
            if (!mouseDown) {
                return;
            }

            handleMovement(getPoint(event, canvas));
        }, false);

        canvas.addEventListener("mouseup", function (event) {
            mouseDown = false;

            handleMovement(getPoint(event, canvas));
        }, false);

        canvas.addEventListener("mousewheel", function (event) {
            graphics.zoom(event.wheelDelta > 0 ? 3 : -3);
        }, false);

        canvas.addEventListener("DOMMouseScroll", function (event) {
            graphics.zoom(event.detail < 0 ? 3 : -3);
        }, false);

        document.getElementById("blend").addEventListener("change", function () {
            graphics.setBlending(document.getElementById("blend").checked)
        });
    }

    // Load a simple map
    function loadLevel1() {
        graphics.reset();
        physics.reset();

        function createMap(halfSize, off, map) {
            var size = halfSize * 2;
            var offsets = [];

            for (var i = -10; i <= 10; i++) {
                for (var j = -10; j <= 10; j++) {
                    if (map[i + 10][j + 10]) {
                        offsets.push([off[0] + i * size, off[1] + size, off[2] + j * size]);
                    }
                }
            }

            return offsets;
        }

        var sphereScale = 1;

        var sphere = addEntity(models.sphere, textures.solid, [0, 3, 0], { shininess: 0.75 }, { type: "sphere", radius: sphereScale, velocity: [0, 0, 0] });

        graphics.setFocus(sphere.graphics);

        var mapScale = 1;

        var map;

        map = createMap(mapScale, [0, -6, 0],
            [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ]);
        for (var i = 0; i < map.length; i++) {
            addEntity(models.cube, textures.box, map[i], {}, { stationary: true, type: "box", halfSize: [mapScale, mapScale, mapScale] });
        }

        map = createMap(mapScale, [0, -4, 0],
            [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
                [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
                [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
                [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
                [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
                [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
                [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
                [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
                [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
                [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
                [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
                [1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            ]);
        for (var i = 0; i < map.length; i++) {
            addEntity(models.cube, textures.box, map[i], {}, { stationary: true, type: "box", halfSize: [mapScale, mapScale, mapScale] });
        }

        map = createMap(mapScale, [0, -2, 0],
            [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            ]);
        for (var i = 0; i < map.length; i++) {
            addEntity(models.cube, textures.box, map[i], {}, { stationary: true, type: "box", halfSize: [mapScale, mapScale, mapScale] });
        }

        map = createMap(mapScale, [0, 0, 0],
            [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
                [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
                [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
                [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
                [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
                [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
                [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
                [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
                [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
                [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
                [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
                [1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            ]);
        for (var i = 0; i < map.length; i++) {
            addEntity(models.cube, textures.box, map[i], { }, { stationary: true, type: "box", halfSize: [mapScale, mapScale, mapScale] });
        }


        levelTick = function level1Tick() {
            if (vec3.distance(sphere.position, [0, 0, 0]) > 50) {
                loadLevel1();
            }
        }

        var smallTeapot = models.teapot.scale([0.1]);
        addEntity(smallTeapot, textures.solid, [-8, 8, 0], { tint: [1, 1, 1, 0.5], shininess: 0.2 }, { stationary: true, type: "box", halfSize: [1, 1, 1] });
//        addEntity(smallTeapot, textures.solid, [-4, 8, 0], { tint: [1, 1, 1, 0.5], shininess: 0.425 }, { stationary: true, type: "box", halfSize: [1, 1, 1] });
        addEntity(smallTeapot, textures.solid, [0, 8, 0], { tint: [1, 1, 1, 0.5], shininess: 0.5 }, { stationary: true, type: "box", halfSize: [1, 1, 1] });
//        addEntity(smallTeapot, textures.solid, [4, 8, 0], { tint:  [1, 1, 1, 0.5], shininess: 0.75 }, { stationary: true, type: "box", halfSize: [1, 1, 1] });
        addEntity(smallTeapot, textures.solid, [8, 8, 0], { tint: [1, 1, 1, 0.5], shininess: 1 }, { stationary: true, type: "box", halfSize: [1, 1, 1] });

        var goal = addEntity(models.block.scale([0.5]), textures.cubeDims, [0, -2, 0], { tint: [1, 1, 1, 1] }, { stationary: true, type: "box", halfSize: [0.5, 0.5, 0.5] });

        goal.physics.addCollisionEvent(function () {
            loadLevel2();
        });
    }

    // Automagically generate a level using maze.js
    function loadLevel2() {
        graphics.reset();
        physics.reset();

        function createPlane(w, h) {

            var plane = [];
            for (var r = 0; r < h; r++) {
                var row = [];
                for (var c = 0; c < w; c++) {
                    row.push(true);
                }
                plane.push(row);
            }

            return plane;
        }

        function createMap(halfSize, off, map) {
            var size = halfSize * 2;
            var offsets = [];

            for (var i = 0; i < map.length; i++) {
                for (var j = 0; j < map[i].length; j++) {
                    if (map[i][j]) {
                        offsets.push([off[0] + i * size, off[1] + size, off[2] + j * size]);
                    }
                }
            }

            return offsets;
        }


        var dimensions = [30, 30];

        var start = [1, 1];
        var end = [28, 28];

        var sphereScale = 0.9;
        var sphere = addEntity(models.sphere.scale([0.95]), textures.solid, [start[0], 2, start[1]], { shininess: 0.75 }, { type: "sphere", radius: sphereScale, velocity: [0, 0, 0] });

        graphics.setFocus(sphere);

        var mapScale = 1;

        map = createMap(mapScale, [0, -2, 0], createPlane(dimensions[0], dimensions[1]));
        for (var i = 0; i < map.length; i++) {
            addEntity(models.cube, textures.box, map[i], {}, { stationary: true, type: "box", halfSize: [mapScale, mapScale, mapScale] });
        }

        map = createMap(mapScale, [0, 0, 0], maze.generateMaze(maze.Point(start[0], start[1]), maze.Point(end[0], end[1]), dimensions[0], dimensions[1]));
        for (var i = 0; i < map.length; i++) {
            addEntity(models.cube, textures.box, map[i], {}, { stationary: true, type: "box", halfSize: [mapScale, mapScale, mapScale] });
        }

        levelTick = function level1Tick() {
            if (vec3.distance(sphere.position, [0, 0, 0]) > 100) {
                loadLevel2();
            }
        }


        var goal = addEntity(models.cube.scale([0.5]), textures.box, [end[0] * 2, 2, end[1] * 2], { tint: [1, 1, 0, 1] }, { stationary: true, type: "box", halfSize: [0, 0, 0] });

        goal.physics.addCollisionEvent(function () {
            loadLevel2();
        });
    }

    function start(m, images) {
        physics = Physics();

        graphics = Graphics();
        graphics.start();

        models = m;
        textures = graphics.initTextures(images);

        attachUIEvents(graphics.getCanvas());

        loadLevel1();

        // Start ticking (tick method will be responsible for calling second etc. tick)
        tick();
    }

    return {
        start: start
    }
};
