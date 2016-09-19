
dop.core.configureObject = (function() {

    var canWeProxy = typeof Proxy == 'function';

    return function( object, path, shallWeProxy ) {

        // Creating a copy if is another object registered
        if (dop.isRegistered(object))
            return dop.core.configureObject( dop.util.merge({},object), path, shallWeProxy);

        // Recursion
        var property, value, object_dop;
        for (property in object) {
            value = object[property];
            if ( value && value !== object && (value.constructor === Object || (Array.isArray(value))) )
                object[property] = dop.core.configureObject(value, path.concat(property), shallWeProxy, object);
        }

        // Setting ~dop object
        Object.defineProperty( object, dop.specialprop.dop, {value:path.slice(0)} );
        object_dop = dop.getObjectDop(object);
        object_dop.o = []; // observers
        object_dop.op = {}; // observers by property


        // Making proxy object
        if ( shallWeProxy && canWeProxy ) {

            var target = object;

            // Adding traps for mutations methods of arrays
            if ( dop.util.typeof( object ) == 'array' )
                Object.defineProperties(object, dop.core.proxyArrayHandler);

            object = new Proxy(object, dop.core.proxyObjectHandler);

            // Adding proxy and target alias
            object_dop.p = object;
            object_dop.t = target;
        }

        return object;

    };

})();