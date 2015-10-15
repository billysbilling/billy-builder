var path = require('path'),
    config = require('../config');

module.exports = function(grunt) {
    if (grunt.config.get('uglify')) {
        grunt.fail.fatal('You can currently not set the `uglify` config.');
        return;
    }

    grunt.loadNpmTasks('grunt-contrib-uglify');

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
