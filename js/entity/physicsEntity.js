function createPhysicsEntity(baseEntity, properties) {

    var physicsEntity = {
        position: baseEntity.position,
        model: baseEntity.model,
        sharedProperties: baseEntity.properties,
        velocity: [0, 0, 0],
        move: function move(time) {
            this.position[0] += this.velocity[0] * (time / 500);
            this.position[1] += this.velocity[1] * (time / 500);
            this.position[2] += this.velocity[2] * (time / 500);
        },
        accelerate: function accelerate(acceleration, time) {
            this.velocity[0] += acceleration[0] * (time / 500);
            this.velocity[1] += acceleration[1] * (time / 500);
            this.velocity[2] += acceleration[2] * (time / 500);
        }
    };

    for (var property in properties) {
        if (properties.hasOwnProperty(property)) {
            physicsEntity[property] = properties[property];
        }
    }


    return physicsEntity;
}