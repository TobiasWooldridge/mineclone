function Physics() {
    var lastUpdateTime = 0;

    var entities = [];

    var movingParts = [];

    var collisionDamping = 0.75;

    function tick(gravity) {
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
        var vr, vt;

        for (var i = 0; i < movingParts.length; i++) {
            var movingPart = movingParts[i];

            for (var j = 0; j < entities.length; j++) {
                var entity = entities[j];

                // Things can't collide with themselves
                if (movingPart == entity) continue;

                var normal = detectCollision(movingPart, entity);

                if (normal) {
                    entity.collision(movingPart, normal);
                    movingPart.collision(entity, normal);

                    // Update velocities
                    vr = scaleVector(normal, dot(normal, movingPart.velocity) * collisionDamping);
                    vt = subtractVector(movingPart.velocity, vr);
                    movingPart.velocity = addVector(vt, subtractVector([0, 0, 0], vr));

                    if (!entity.stationary) {
                        // Update velocities
                        vr = scaleVector(normal, dot(normal, velocity.velocity) * collisionDamping);
                        vt = subtractVector(movingPart.velocity, vr);
                        entity.velocity = vec3.add(vt, vec3.negate(vr, vr));
                    }

                    entity.sharedProperties.colliding = 100;
                }
                else {
                    entity.sharedProperties.colliding -= 1;
                }
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
        var relCenter = subtractVector(sphere.position, box.position);

        // SURFACE-SPHERE COLLISION
//        if (!foundCollision) {
//            var surfaceCollision = true;
//
//            for (var i = 0; i < 3; i++) {
//                if (i == maxIdx) {
//                    if (Math.abs(relCenter[i]) > sphere.radius + box.halfSize[i]) {
//                        surfaceCollision = false;
//                        break;
//                    }
//                }
//                else {
//                    if (Math.abs(relCenter[i]) > box.halfSize[i]) {
//                        surfaceCollision = false;
//                        break;
//                    }
//                }
//            }
//            foundCollision = foundCollision || surfaceCollision;
//        }

        var closestPoint = vec3.create();

        for (var i = 0; i < 3; i++) {
            if (relCenter[i] < -box.halfSize[i]) {
                closestPoint[i] = -box.halfSize[i];
            }
            else if (relCenter[i] > box.halfSize[i]) {
                closestPoint[i] = box.halfSize[i]
            }
            else {
                closestPoint[i] = relCenter[i];
            }
        }

        var dist = vec3.distance(relCenter, closestPoint);

        if (dist > sphere.radius) {
            return;
        }

        // Generate collision normal
        var maxIdx = 0;
        for (var i = 0; i < relCenter.length; i++) {
            if (Math.abs(relCenter[i]) > Math.abs(relCenter[maxIdx])) {
                maxIdx = i;
            }
        }

        var sign = relCenter[maxIdx] / (Math.abs(relCenter[maxIdx]));

        var collisionNormal = [0, 0, 0];
        collisionNormal[maxIdx] = sign;


        // COLLISION RESPONSE
        // Move the sphere off of the box
        sphere.position[maxIdx] = box.position[maxIdx] + sign * (sphere.radius + box.halfSize[maxIdx]);

        return collisionNormal;
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

    function reset() {
        lastUpdateTime = 0;
        entities.length = 0;
        movingParts.length = 0;
    }

    return {
        tick: tick,
        addEntity: addEntity,
        addEntities: addEntities,
        reset: reset
    }
};