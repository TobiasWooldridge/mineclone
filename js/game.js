var Game = function () {
    var physics;
    var graphics;

    function tick () {
        graphics.draw();

        var gravity = normalize(graphics.getCameraAngle());

        // Use a fixed value for now while I work out the correct maths for camera-oriented gravity
        gravity = [0, -1, 0];

        physics.tick(gravity);
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

        addEntity(models.sphere, textures.solid, [0, 3, 0], {},  { type: "sphere", radius : sphereScale, velocity : [1, 0, 0.5] });

        var mapScale = 1;

        var plane = createPlane(mapScale);
        for (var i = 0; i < plane.length; i++) {
            addEntity(models.cube.scale([mapScale * 0.9]), textures.box, plane[i], {}, { stationary: true, type: "box", halfSize : [mapScale, mapScale, mapScale] });
        }

        var map = createMap(mapScale);
        for (var i = 0; i < map.length; i++) {
            addEntity(models.cube.scale([mapScale * 0.9]), textures.box, map[i], {}, { stationary: true, type: "box", halfSize : [mapScale, mapScale, mapScale] });
        }

        setInterval(tick, 1000 / 75);
    }

    return {
        start : start
    }
};