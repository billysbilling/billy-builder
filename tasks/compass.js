var path = require('path'),
    config = require('../config');

module.exports = function(grunt) {
    if (grunt.config.get('compass')) {
        grunt.fail.fatal('You can currently not set the `compass` config in your `Gruntfile.js`.');
        return;
    }

    grunt.loadNpmTasks('grunt-contrib-compass');

    var dependencyDirs = ['bower_components'].concat(grunt.config.get('billy-builder.extraDependencyDirs'));
    var importPaths = dependencyDirs.map(function(dir) {
        return path.resolve(dir);
    });

    grunt.config.set('compass', {
        dist: {
            options: {
                sassDir: grunt.config.get('billy-builder.compass.sassDir'),
                cssDir: 'dist/'+config.getVersionPrefix(grunt)+'css',
                imagesDir: 'src/images',
                httpImagesPath: config.getReleaseHttpPath(grunt)+'images',
                environment: process.env.NODE_ENV || 'development',
                importPath: importPaths
            }
        }
    });
};
