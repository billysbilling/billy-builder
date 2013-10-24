var path = require('path'),
    config = require('../config');

module.exports = function(grunt) {
    if (grunt.config.get('compass')) {
        grunt.fail.fatal('You can currently not set the `compass` config in your `Gruntfile.js`.');
        return;
    }

    grunt.loadTasks(path.join(__dirname, '../node_modules/grunt-contrib-compass/tasks'));
    
    var versionPrefix = config.getVersionPrefix(grunt);
    
    var importPaths = grunt.config.get('billy-builder.dependencyDirs').map(function(dir) {
        return path.resolve(dir);
    });
    
    grunt.config.set('compass', {
        dist: {
            options: {
                sassDir: grunt.config.get('billy-builder.compass.sassDir'),
                cssDir: 'dist/'+versionPrefix+'css',
                imagesDir: 'src/images',
                httpImagesPath: '/'+config.getVersionPrefix(grunt)+'images',
                environment: process.env.NODE_ENV || 'development',
                importPath: importPaths
            }
        }
    });
};