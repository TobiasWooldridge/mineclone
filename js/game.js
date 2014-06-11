var Game = function () {
    var physics;
    var graphics;

    function tick () {
        graphics.getCameraAngle()[1] -= 0.2;

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
    }

    function start(models, images) {
        physics = Physics();

        graphics = Graphics();
        graphics.start();
        var textures = graphics.initTextures(images);

        var sphereScale = 1;

        addEntity(models.sphere, textures.solid, [0, 3, 0], {}, { type: "sphere", radius: sphereScale, velocity: [0, 0, 0] });

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