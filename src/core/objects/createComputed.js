
dop.core.createComputed = function (object, prop, f, shallWeSet, oldValue) {
    var data_path = dop.data.path,
    computed_id = dop.data.computed_inc++,
    computed = {
        object_root: dop.getObjectRoot(object),
        prop: prop,
        function: f,
        derivations: []
    },
    path = dop.getObjectPath(object, false);

    computed.path = path.slice(1);
    computed.pathid = dop.core.getPathId(path.concat(prop));

    if (data_path[computed.pathid] === undefined)
        data_path[computed.pathid] = {};
    
    if (data_path[computed.pathid].computeds === undefined)
        data_path[computed.pathid].computeds = [];

    dop.data.computed[computed_id] = computed;
    value = dop.core.updateComputed(computed_id, computed, object, oldValue);

    // Setting value
    if (shallWeSet)
        dop.core.set(object, prop, value);

    return value;
};