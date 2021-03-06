
dop.set = function(object, property, value) {
    // dop.util.invariant(dop.isRegistered(object), 'Object passed to dop.set must be a registered object');
    (dop.isRegistered(object)) ?
        dop.core.set(object, property, value)
    :
        object[property] = value;
    return value;
};