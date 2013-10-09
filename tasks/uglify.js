var path = require('path'),
    config = require('../config');

module.exports = function(grunt) {
    if (grunt.config.get('uglify')) {
        grunt.fail.fatal('You can currently not set the `uglify` config.');
        return;
    }
    
    grunt.loadTasks(path.join(__dirname, '../node_modules/grunt-contrib-uglify/tasks'));

    var versionPrefix = config.getVersionPrefix(grunt);
    
    var files = {};
    files['dist/'+versionPrefix+'js/bundle.js'] = 'dist/'+versionPrefix+'js/bundle.js';
    
    grunt.config.set('uglify', {
        options: {
            compress: false
        },
        dist: {
            files: files
        }
    });
};