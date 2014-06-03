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

    function createMap(cube) {
        var offsets = [];

        for (var i = -10; i <= 10; i++) {
            for (var j = -10; j <= 10; j++) {
                offsets.push([i, 0, j]);

                if (Math.abs(i) == 10 || Math.abs(j) == 10) {
                    offsets.push([i, 1, j]);
                }
            }
        }

        var model = Model.create("Moo", [], [], [], []);

        for (var i = 0; i < offsets.length; i++) {
            var addition = cube.clone().shift(offsets[i].map(function(x) { return x * 2 }));
            model = Model.combine(model, addition);
        }

        return model;
    }

    function start(models, images) {
        physics = Physics();

        graphics = Graphics();
        graphics.start();
        var textures = graphics.initTextures(images);

        var entities = [
            createScaledEntity(0.5, createMap(models.cube), textures.box, [0, -6, 0], [0, 0, 0], { stationary: true }),
            createScaledEntity(0.5, models.sphere, textures.solid, [0, 5, 0])
        ];

        physics.addEntities(entities);
        graphics.addEntities(entities);

        setInterval(tick, 1000 / 60);

    }

    return {
        start : start
    }
};