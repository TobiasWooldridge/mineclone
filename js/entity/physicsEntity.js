function createPhysicsEntity(baseEntity, properties) {

    var physicsEntity = {
        position: baseEntity.position,
        model: baseEntity.model,
        velocity: [0, 0, 0],
        move: function move(dt) {
            this.position[0] += this.velocity[0] * (dt / 1000);
            this.position[1] += this.velocity[1] * (dt / 1000);
            this.position[2] += this.velocity[2] * (dt / 1000);
        },
        accelerate: function accelerate(dv, dt) {
            this.velocity[0] += dv[0] * (dt / 1000);
            this.velocity[1] += dv[1] * (dt / 1000);
            this.velocity[2] += dv[2] * (dt / 1000);
        }
    };

    for (var property in properties) {
        if (properties.hasOwnProperty(property)) {
            physicsEntity[property] = properties[property];
        }
    }


    return physicsEntity;
}