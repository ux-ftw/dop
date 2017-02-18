
dop.core.injectMutationInAction = function(action, mutation, isUnaction) {

    var isMutationArray = mutation.splice!==undefined || mutation.swaps!==undefined,
        path = dop.getObjectDop(mutation.object).slice(0),
        prop = mutation.name,
        value = (isUnaction) ? mutation.oldValue : mutation.value,
        typeofValue = dop.util.typeof(value),
        index = 1;

    // If is an array or an object we must make a copy
    if (typeofValue == "object")
        value = dop.util.merge({}, value);
    else if (typeofValue == "array")
        value = dop.util.merge([], value);


    if (!isMutationArray)
        path.push(prop);

    // Going deep
    for (;index<path.length-1; ++index) {
        prop = path[index];
        action = isObject(action[prop]) ? action[prop] : action[prop]={};
    }

    prop = path[index];

    // Its a new array like {myarray:[1,2,3]} we must apply mutations
    if (isMutationArray && isArray(action[prop])) {
        // Swaps
        if (mutation.swaps!==undefined) {
            dop.util.swap(action[prop], mutation.swaps.slice(0))
        }
        // Splice
        else if (mutation.splice!==undefined) {
            var splice;
            if (isUnaction) {
                splice = (mutation.spliced) ? mutation.spliced.slice(0) : [];
                splice.unshift(mutation.splice[0], mutation.splice.length-2);
            }
            else
                splice = mutation.splice.slice(0);

            Array.prototype.splice.apply(action[prop], splice);
        }
    }

    else if (isArray(action)) {
        action[prop] = value;
    }

    // Its an array and we must apply mutations
    else if (isMutationArray || isArray(mutation.object)) {

        if (path.length>1) {
            if (isMutationArray && !isObject(action[prop])) 
                action[prop] = {};

            if (isMutationArray)
                action = action[prop];
        }

        if (!isObject(action[dop.cons.DOP]))
            action[dop.cons.DOP] = [];
            
        var mutations = action[dop.cons.DOP];

        // swap
        if (mutation.swaps!==undefined) {
            var swaps = mutation.swaps.slice(0);
            if (isUnaction)
                swaps.reverse();
            // var tochange = (swaps[0]>0) ? 0 : 1;
            // swaps[tochange] = swaps[tochange]*-1;
            swaps.unshift(0); // 0 mean swap
            mutations.push(swaps);
        }

        // splice
        else if (mutation.splice!==undefined) {
            var splice;
            if (isUnaction) {
                splice = (mutation.spliced) ? mutation.spliced.slice(0) : [];
                splice.unshift(mutation.splice[0], mutation.splice.length-2);
            }
            else
                splice = mutation.splice.slice(0);
            
            splice.unshift(1); // 1 mean splice
            mutations.push(splice);
        }

        // length
        else if (isArray(mutation.object) && mutation.name==='length')
            mutations.push([2, value]); // 2 means length

        // set
        else
            mutations.push([1, prop, 1, value]);
    }

    // set
    else
        action[prop] = value;
};