

synko.stringify = function(data) {

    var that = this, tof;

    return JSON.stringify(data, function(k, v) {

        tof = typeof v;

        if (tof == 'undefined')
            return that.options.stringify_undefined;

        else if (tof == 'function' && v.name !== synko.name_remote_function)
            return that.options.stringify_function;

        else if (tof == 'object' && v instanceof RegExp)
            return that.options.stringify_regexp + v.toString();

        return v;

    });

};


// types = [
//     123,
//     false,
//     'my string',
//     'string to be deleted',
//     undefined, 
//     null, 
//     function caca() {}, 
//     /^A\wB$/g, 
//     new RegExp("AB", "gi"),
//     new Date(),
//     {a: 12},
//     Symbol("caca"), 
// ];
// delete types[3];

// instance = {stringify_function:'~F', stringify_undefined:'~U', stringify_regexp:'~R'}
// stringify=synko.stringify.bind(instance);
// to = stringify(types);
// parse=synko.parse.bind(instance);
// from = parse(to);


// console.log(types);
// console.log(to);
// console.log(from);





