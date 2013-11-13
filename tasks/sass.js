var path = require('path'),
    config = require('../config');

module.exports = function(grunt) {
    if (grunt.config.get('sass')) {
        grunt.fail.fatal('You can currently not set the `sass` config.');
        return;
    }

    grunt.loadTasks(path.join(__dirname, '../node_modules/grunt-sass/tasks'));

    var dependencyDirs = ['bower_components'].concat(grunt.config.get('billy-builder.extraDependencyDirs'));
    var includePaths = dependencyDirs.map(function(dir) {
        return path.resolve(dir);
    });
    
    var versionPrefix = config.getVersionPrefix(grunt);

    var files = {};
    files['dist/'+versionPrefix+'css/bundle.css'] = grunt.config.get('billy-builder.sass.sassFile');
    
    grunt.config.set('sass', {
        dist: {
            options: {
                includePaths: includePaths
            },
            files: files
        }
    });
};