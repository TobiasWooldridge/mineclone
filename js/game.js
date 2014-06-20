var Game = function () {
    var physics;
    var graphics;

    var models;
    var textures;

    var levelTick;

    var fpsTimes = [];
    var fpsIdx = 0;
    var fpsSample = 15;

    var gravity = vec3.clone([0, -2, 0]);

    function tick() {
        var mvMatrix = graphics.getViewMatrix();

        var start = window.performance.now();

        // Process physics. Done immediately before graphics to reduce frame latency
        physics.tick(gravity);
        var physicsEnd = window.performance.now();

        // Draw everything to canvas
        graphics.draw();
        var graphicsEnd = window.performance.now();

        // Process general events
        if (levelTick != undefined) {
            levelTick();
        }


        // Calculate average FPS time over [fpsSample] frames
        fpsTimes[fpsIdx] = window.performance.now();
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

        map = createMap(mapScale, [0, -2, 0],
            [
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
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            ]);
        for (var i = 0; i < map.length; i++) {
            addEntity(models.cube, textures.box, map[i], {}, { stationary: true, type: "box", halfSize: [mapScale, mapScale, mapScale] });
        }
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
