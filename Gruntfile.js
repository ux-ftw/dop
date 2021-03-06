module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        watch: {
            scripts: {
                files: ['src/**', 'package.json'],
                tasks: ['default'],
                options: {
                    spawn: false,
                },
            },
        },

        copy: {
            main: {
                src: 'node_modules/dop-transports/connect/websocket.js',
                dest: 'src/env/browser/websocket.js',
            },
        },

        concat: {
            options: {
                banner: '/*\n' +
                ' * dop@<%= pkg.version %>\n' +
                ' * www.distributedobjectprotocol.org\n' +
                ' * (c) 2016 Josema Gonzalez\n' +
                ' * MIT License.\n' +
                ' */\n',
                process: function(src, filepath) {
                    return '\n//////////  ' + filepath + '\n' + src + '\n\n\n';
                }
            },
            nodejs: {
                src: [
                    'src/dop.js',
                    'src/env/nodejs/**', // needed here dop.core.listener.prototype = Object.create( dop.util.emitter.prototype );
                    'src/util/*',
                    'src/api/*',
                    'src/core/**',
                    'src/protocol/*',
                    'src/node/*',
                    'src/umd.js'
                ],
                dest: 'dist/dop.nodejs.js'
            },
            browser: {
                src: [
                    'src/dop.js',
                    'src/env/browser/**', // needed here dop.core.listener.prototype = Object.create( dop.util.emitter.prototype );
                    'src/util/*',
                    'src/api/*',
                    'src/core/**',
                    'src/protocol/*',
                    'src/node/*',
                    'src/umd.js'
                ],
                dest: 'dist/dop.js'
            }
        },

        uglify: {
            build: {
                src: 'dist/dop.js',
                dest: 'dist/dop.min.js'
            },
            options: {
                banner: '/* dop@<%= pkg.version %> - (c) 2016 Josema Gonzalez - MIT Licensed */\n'
            }
        },

        replace: {
            dist: {
                options: {
                    patterns: [
                        {
                            match: /\.core\./g,
                            replacement: '.c.'
                        },
                        {
                            match: /\.util\./g,
                            replacement: '.u.'
                        },
                        {
                            match: /\.protocol\./g,
                            replacement: '.p.'
                        }
                    ]
                },
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: 'dist/dop.min.js',
                        dest: 'dist'
                    }
                ]
            }
        },

        'optimize-js': {
            options: {
                sourceMap: false,
                silent: false
            },
            dist: {
                files: {
                    'dist/dop.min.opt.js': 'dist/dop.min.js'
                }
            }
        }

    });



    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-optimize-js');


    var tasks = ['copy', 'concat:nodejs', 'concat:browser', 'uglify', /*'replace', 'optimize-js'*/];
    if (grunt.option('build') === undefined)
        tasks.push('watch');
    grunt.registerTask('default', tasks);


};
