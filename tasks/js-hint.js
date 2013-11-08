var path = require('path'),
    config = require('../config');

module.exports = function(grunt) {
    if (grunt.config.get('jshint')) {
        grunt.fail.fatal('You can currently not set the `jshint` config in your `Gruntfile.js`. You can add options in the `billy-builder.jshint` key.');
        return;
    }

    grunt.loadTasks(path.join(__dirname, '../node_modules/grunt-contrib-jshint/tasks'));
    
    grunt.config.set('jshint', {
        options: grunt.config.get('billy-builder.jshint'),
        all: ['src/**/*.js', 'tests/**/*.js']
    });
};