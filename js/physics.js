var Physics = function Physics() {
    var lastUpdateTime = 0;

    var entities = [];

    var movingParts = [];

    function tick (gravity) {
        var currentTime = (new Date).getTime();
        var timeDelta = Math.min(currentTime - lastUpdateTime, 1000 / 20);
        lastUpdateTime = currentTime;

        for (var entityIndex = 0; entityIndex < movingParts.length; entityIndex++) {
            var entity = movingParts[entityIndex];

            entity.accelerate(gravity, timeDelta);
            entity.move(timeDelta);

            for (var i = 0; i < 3; i++) {
                if (entity.position[i] < -5 || entity.position[i] > 5) {
                    entity.position[i] = Math.max(-5, Math.min(entity.position[i], 5));
                    entity.velocity[i] *= -1;
                }
            }
        }
    }

    function addEntities(newEntities) {
        _.pushAll(entities, newEntities);
        _.pushAll(movingParts, newEntities.filter(function(e) { return !e.attributes.stationary }));

        console.log(movingParts);
    }

    return {
        tick: tick,
        addEntities : addEntities
    }
};