
var canWeProxy = typeof Proxy == 'function';
dop.core.configureObject = function(object, path, parent) {

    // Creating a copy if is another object registered
    if (dop.isRegistered(object))
        return dop.core.configureObject(
            dop.util.merge( Array.isArray(object)?[]:{}, object),
            path,
            parent
        );

    // Recursion
    var property, value, object_dop;
    for (property in object) {
        value = object[property];
        if (value && value !== object && (value.constructor === Object || (Array.isArray(value))))
            object[property] = dop.core.configureObject(value, path.concat(property), object);
    }

    // Setting ~dop object
    Object.defineProperty(object, CONS.dop, {value:path.slice(0)});
    object_dop = dop.getObjectDop(object);
    object_dop.m = []; // mutations
    object_dop.o = []; // observers
    object_dop.op = {}; // observers by property


    if (dop.util.isObject(parent))
        object_dop._ = (dop.isRegistered(parent)) ? dop.getObjectTarget(parent) : parent;


    // Making proxy object
    if (canWeProxy) {
        var target = object;
        object = new Proxy(object, dop.core.proxyObjectHandler);
        // Adding proxy and target alias
        object_dop.p = object;
        object_dop.t = target;
    }
    else
        object_dop.p = object_dop.t = object;


    // Adding traps for mutations methods of arrays
    if (dop.util.typeof(object) == 'array')
        Object.defineProperties(object, dop.core.proxyArrayHandler);


    return object;
};