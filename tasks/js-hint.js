var path = require('path'),
    config = require('../config');

module.exports = function(grunt) {
    if (grunt.config.get('jshint')) {
        grunt.fail.fatal('You can currently not set the `jshint` config in your `Gruntfile.js`. You can add options in the `billy-builder.jshint` key.');
        return;
    }

    grunt.loadNpmTasks('grunt-contrib-jshint');

    if (grunt.option('jshint') !== 0) {
        grunt.config.set('jshint', {
            options: grunt.config.get('billy-builder.jshint'),
            all: ['src/**/*.js', 'tests/**/*.js']
        });
    } else {
        grunt.config.set('jshint', {
            all: []
        });
    }
};
