function Physics() {
    var lastUpdateTime = 0;

    var entities = [];

    var movingParts = [];

    function tick (gravity) {
        var currentTime = (new Date).getTime();
        var timeDelta = Math.min(currentTime - lastUpdateTime, 1000 / 20);
        lastUpdateTime = currentTime;


        // Update the velocity for each non-stationary entity
        for (var i = 0; i < movingParts.length; i++) {
            movingParts[i].accelerate(gravity, timeDelta);
        }

        processCollisions();

        // Update the position for each non-stationary entity
        for (var i = 0; i < movingParts.length; i++) {
            movingParts[i].move(timeDelta);
        }
    }

    function processCollisions() {
        for (var i = 0; i < movingParts.length; i++) {
            var movingPart = movingParts[i];

            for (var j = 0; j < entities.length; j++) {
                var entity = entities[j];

                if (movingPart == entity) continue;

                processCollision(movingPart, entity);
            }
        }
    }

    function processCollision(a, b) {
        return;
        if (a.type == "sphere" && b.type == "box") {
            return processSphereBoxCollision(a, b);
        }
        else {
            console.error("Could not process collision between " + a.type + " and " + b.type);
        }
    }

    function processSphereBoxCollision(sphere, box) {
        var center = sphere.position;

        // TODO: Make relCenter correctly reflect the position of the sphere relative to rotation of the box
        var relCenter = center;

        for (var i = 0; i < 3; i++) {
            if (real_abs(relCenter[i]) - sphere.radius > box.halfSize[i]) {
                // No collision
                return;
            }
        }

        var closestPoint = [0, 0, 0];
        for (var i = 0; i < 3; i++) {
            var dist = relCenter[i];
            if (dist > box.halfSize[i]) dist = box.halfSize[i];
            if (dist < -box.halfSize[i]) dist = box.halfSize[i];
            closestPoint[i] = dist;
        }

        var dist = squareMagnitude(subtractVector(closestPoint, relCenter));
        if (dist > (sphere.radius * sphere.radius)) {
            // No collision
            return;
        }

        console.log("OH MY GOD A COLLISION");
    }

    function addEntity(entity) {
        entities.push(entity);

        if (!entity.stationary) {
            movingParts.push(entity);
        }
    }

    function addEntities(newEntities) {
        for (var i = 0; i < newEntities.length; i++) {
            addEntities(newEntities[i]);
        }
    }

    return {
        tick: tick,
        addEntity : addEntity,
        addEntities : addEntities
    }
};