var Game = function () {
    var physics;
    var graphics;

    function tick () {
        var mvMatrix = graphics.getViewMatrix().elements;
        gravity = scaleVector(normalize([-mvMatrix[1][0], -mvMatrix[1][1], -mvMatrix[1][2]]), 5);

        physics.tick(gravity);
        graphics.draw();
    }

    function createPlane(halfSize) {
        var size = halfSize * 2;
        var offsets = [];

        for (var i = -10; i <= 10; i++) {
            for (var j = -10; j <= 10; j++) {
                offsets.push([i * size, 0, j * size]);
            }
        }

        return offsets;
    }

    function createMap(halfSize) {
        var size = halfSize * 2;
        var offsets = [];

        var map = [
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
        ];

        for (var i = -10; i <= 10; i++) {
            for (var j = -10; j <= 10; j++) {
                if (map[i+10][j+10]) {
                    offsets.push([i * size, size, j * size]);
                }
            }
        }

        return offsets;
    }

    function addEntity(model, texture, position, graphicsProperties, physicsProperties) {
        var baseEntity = createEntity(model, position);

        var physicsEntity = createPhysicsEntity(baseEntity, physicsProperties);
        physics.addEntity(physicsEntity);

        var graphicsEntity = createGraphicsEntity(baseEntity, texture);
        graphics.addEntity(graphicsEntity, graphicsProperties);

        return baseEntity;
    }

    function attachUIEvents(canvas) {
        function getPoint(event, canvas) {
            return [event.x / canvas.width, event.y / canvas.height];
        }

        function handleMovement(toPoint) {
            var movement = subtractVector(startPoint, toPoint);

            graphics.getCameraAngle()[1] -= (movement[0] * 180);
            graphics.getCameraAngle()[0] -= (movement[1] * 180);

            startPoint = toPoint;
        }

        var mouseDown = false;

        var startPoint = [0, 0];

        canvas.addEventListener("mousedown", function (event) {
            mouseDown = true;
            startPoint = getPoint(event, canvas);
            console.log(startPoint);
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
    }

    function start(models, images) {
        physics = Physics();

        graphics = Graphics();
        graphics.start();
        var textures = graphics.initTextures(images);
        attachUIEvents(graphics.getCanvas());

        var sphereScale = 1;

        var sphere = addEntity(models.sphere, textures.solid, [0, 3, 0], {}, { type: "sphere", radius: sphereScale, velocity: [0, 0, 0] });

        graphics.setFocus(sphere);

        var mapScale = 1;

        var plane = createPlane(mapScale);
        for (var i = 0; i < plane.length; i++) {
            addEntity(models.cube.scale([mapScale]), textures.box, plane[i], {}, { stationary: true, type: "box", halfSize : [mapScale, mapScale, mapScale] });
        }

        var map = createMap(mapScale);
        for (var i = 0; i < map.length; i++) {
            addEntity(models.cube.scale([mapScale]), textures.box, map[i], {}, { stationary: true, type: "box", halfSize : [mapScale, mapScale, mapScale] });
        }

        setInterval(tick, 1000 / 75);
    }

    return {
        start : start
    }
};