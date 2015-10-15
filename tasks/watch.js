var path = require('path');

module.exports = function(grunt) {
    if (grunt.config.get('watch')) {
        grunt.fail.fatal('You can currently not set the `watch` config.');
        return;
    }

    grunt.loadNpmTasks('grunt-contrib-watch');

    var jsFiles = [
        'src/**/*.js',
        'src/**/*.hbs',
        'src/**/*.svg',
        'tests/**/*.js'
    ];

    var cssFiles = [
        'src/**/*.scss'
    ];

    var dependencyDirs = ['bower_components'].concat(grunt.config.get('billy-builder.extraDependencyDirs'));
    dependencyDirs.forEach(function(dir) {
        jsFiles.push(dir+'/**/*.js');
        jsFiles.push(dir+'/**/*.json');
        jsFiles.push(dir+'/**/*.hbs');
        jsFiles.push(dir+'/**/*.svg');

        cssFiles.push(dir+'/**/*.scss');
    });

    grunt.config.set('watch', {
        all: {
            options: {
                atBegin: true,
                interrupt: true,
                spawn: false,
                interval: 500
            },
            files: [
                //Don't really watch
            ],
            tasks: ['build']
        },
        js: {
            options: {
                interrupt: true,
                spawn: false,
                interval: 500
            },
            files: jsFiles,
            tasks: ['start-build', 'build-js', 'end-build']
        },
        css: {
            options: {
                interrupt: true,
                spawn: false,
                interval: 500
            },
            files: cssFiles,
            tasks: ['start-build', 'build-css', 'end-build']
        }
    });
};
