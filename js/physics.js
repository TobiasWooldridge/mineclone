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
            movingParts[i].move(timeDelta);
            movingParts[i].accelerate(gravity, timeDelta);
        }

        processCollisions();

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
        if (a.type == "sphere" && b.type == "box") {
            return processSphereBoxCollision(a, b);
        }
        else {
            console.error("Could not process collision between " + a.type + " and " + b.type);
        }
    }

    function processSphereBoxCollision(sphere, box) {
        // Detect a collision
        var relCenter = subtractVector(sphere.position, box.position);

        for (var i = 0; i < 3; i++) {
            if (Math.abs(relCenter[i]) - sphere.radius > box.halfSize[i]) {
                // No collision
                return;
            }
        }

        // Determine which point in the box is closest to the sphere
        var closestPoint = [0, 0, 0];
        for (var i = 0; i < 3; i++) {
            var dist = relCenter[i];
            if (dist > box.halfSize[i]) dist = box.halfSize[i];
            if (dist < -box.halfSize[i]) dist = box.halfSize[i];
            closestPoint[i] = dist;
        }

        var dist = squareMagnitude(subtractVector(closestPoint, relCenter));
        if (dist >= (sphere.radius * sphere.radius)) {
            // No collision
            return;
        }

        var collisionMultiplier = [ 1, 1, 1 ];
        var absMax = 0;
        var absMaxIdx = 0;

        var idx = 0;
        for (var i = 0; i < 3; i++) {
            if (Math.abs(relCenter[i]) > absMax) {
                absMax = Math.abs(relCenter[i]);
                absMaxIdx = i;
            }
        }

        console.log(relCenter, absMax);

        collisionMultiplier[absMaxIdx] *= -0.95;
        console.log(collisionMultiplier);

        sphere.velocity = multiplyVector(sphere.velocity, collisionMultiplier);

//        // Now generate a contact
//        var contactNormal = normalize(subtractVector(sphere.position, closestPoint));
//
//        var vr = scaleVector(contactNormal, dot(contactNormal, sphere.velocity));
//        var vt = subtractVector(sphere.velocity, vr);
//
//        console.log(contactNormal);
//        console.log(sphere.velocity, vr, vt);
//
//        sphere.velocity = addVector(vt, subtractVector([0, 0, 0], vr));
//
//        for (var i = 0; i < 3; i++) {
//            sphere.position[i] += contactNormal[i] * dist;
//        }
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