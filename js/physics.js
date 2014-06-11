function Physics() {
    var lastUpdateTime = 0;

    var entities = [];

    var movingParts = [];

    function tick (gravity) {
        var currentTime = (new Date).getTime();
        var timeDelta = Math.min(currentTime - lastUpdateTime, 50);
        lastUpdateTime = currentTime;


        // Update the velocity for each non-stationary entity
        for (var i = 0; i < movingParts.length; i++) {
            movingParts[i].move(timeDelta);
        }

        processCollisions();

        for (var i = 0; i < movingParts.length; i++) {
            movingParts[i].accelerate(gravity, timeDelta);
        }
    }

    function processCollisions() {
        for (var i = 0; i < movingParts.length; i++) {
            var movingPart = movingParts[i];

            var normals = [];

            for (var j = 0; j < entities.length; j++) {
                var entity = entities[j];

                // Things can't collide with themselves
                if (movingPart == entity) continue;

                var normal = detectCollision(movingPart, entity);

                if (normal) {
                    normals.push(normal);
                }
            }

            if (normals.length) {
                var contactNormal = normals.reduce(addVector, [0, 0, 0]);

                for (var i = 0; i < 3; i++) {
                    if (contactNormal[i] != 0) {
                        movingPart.velocity[i] *= -0.99;
                    }
                }

//                var vr = scaleVector(contactNormal, dot(contactNormal, movingPart.velocity) * 0.99);
//                var vt = subtractVector(movingPart.velocity, vr);
//
//                movingPart.velocity = addVector(vt, subtractVector([0, 0, 0], vr));
            }
        }
    }

    function detectCollision(a, b) {
        if (a.type == "sphere" && b.type == "box") {
            return detectSphereBoxCollision(a, b);
        }
        else {
            console.error("Could not process collision between " + a.type + " and " + b.type);
        }
    }

    function detectSphereBoxCollision(sphere, box) {
        // Detect a collision
        var relCenter = subtractVector(sphere.position, box.position);

        for (var i = 0; i < 3; i++) {
            if (Math.abs(relCenter[i]) - sphere.radius > box.halfSize[i]) {
                // No collision
                box.sharedProperties.colliding -= 1;
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
            box.sharedProperties.colliding -= 1;
            return;
        }

        // Calculate the collision normal
        var oldNormal = normalize(subtractVector(sphere.position, box.position));

        var maxIdx = 0;
        for (var i = 0; i < oldNormal.length; i++) {
            if (Math.abs(oldNormal[i]) > Math.abs(oldNormal[maxIdx])) {
                maxIdx = i;
            }
        }


        var sign = oldNormal[maxIdx]/(Math.abs(oldNormal[maxIdx]));

        contactNormal = [0, 0, 0];
        contactNormal[maxIdx] = sign;


        // Move the sphere off of the box
//        console.log(maxIdx);
//        console.log(oldNormal);
//        console.log(contactNormal);
//        console.log(sphere.position);
        sphere.position[maxIdx] = box.position[maxIdx] + sign * (sphere.radius + box.halfSize[maxIdx]);
//        console.log(sphere.position);
//        console.log("Box: " + box.position);
//        console.log("----");

        box.sharedProperties.colliding = 20;

        detectSphereBoxCollision(sphere, box);

        return contactNormal;
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