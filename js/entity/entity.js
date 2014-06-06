function createEntity(model, position, properties) {
    var entity = {
        model: model,
        position: position,
        properties: properties || {}
    }

    return entity;
}
