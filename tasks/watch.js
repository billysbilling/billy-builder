var path = require('path');

module.exports = function(grunt) {
    if (grunt.config.get('watch')) {
        grunt.fail.fatal('You can currently not set the `watch` config.');
        return;
    }

    grunt.loadTasks(path.join(__dirname, '../node_modules/grunt-contrib-watch/tasks'));
    
    grunt.config.set('watch', {
        all: {
            options: {
                atBegin: true,
                interrupt: true,
                spawn: false
            },
            files: [
                //Don't really watch
            ],
            tasks: ['build']
        },
        js: {
            options: {
                interrupt: true,
                spawn: false
            },
            files: [
                'src/**/*.js',
                'src/**/*.hbs',
                'src/**/*.svg',
                'bower_components/**/*.js',
                'bower_components/**/*.hbs',
                'bower_components/**/*.svg',
                'tests/**/*.js'
            ],
            tasks: ['start-build', 'build-js', 'end-build']
        },
        css: {
            options: {
                interrupt: true,
                spawn: false
            },
            files: [
                'src/**/*.scss',
                'bower_components/**/*.scss'
            ],
            tasks: ['start-build', 'build-css', 'end-build']
        }
    });
};