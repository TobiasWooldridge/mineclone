var Game = function () {
    var physics;
    var graphics;

    function tick () {
        graphics.tick();

        var gravity = normalize(graphics.getCameraAngle());

        // Use a fixed value for now while I work out the correct maths for camera-oriented gravity
        gravity = [0, -20, 0];

        physics.tick(gravity);
    }

    function createMap() {
        var offsets = [];

        for (var i = -10; i <= 10; i++) {
            for (var j = -10; j <= 10; j++) {
                offsets.push([i * 2, 0, j * 2]);

                if (Math.abs(i) == 10 || Math.abs(j) == 10) {
                    offsets.push([i * 2, 2, j * 2]);
                }
            }
        }

        return offsets;
    }

    function addEntity(model, texture, position, graphicsProperties, physicsProperties) {
        var baseEntity = createEntity(model, position);

        var physicsEntity = createPhysicsEntity(baseEntity);
        physics.addEntity(physicsEntity);

        var graphicsEntity = createGraphicsEntity(baseEntity, texture);
        graphics.addEntity(graphicsEntity);
    }

    function start(models, images) {
        physics = Physics();

        graphics = Graphics();
        graphics.start();
        var textures = graphics.initTextures(images);

        addEntity(models.sphere, textures.solid, [0, 5, 0], {}, { type: "sphere" });

        var map = createMap(models.block);
        for (var i = 0; i < map.length; i++) {
           addEntity(models.block, textures.grassblock, map[i], {}, { stationary: true, type: "box" });
        }

        setInterval(tick, 1000 / 60);
    }

    return {
        start : start
    }
};