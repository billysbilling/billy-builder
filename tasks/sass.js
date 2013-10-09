var path = require('path'),
    config = require('../config');

module.exports = function(grunt) {
    if (grunt.config.get('sass')) {
        grunt.fail.fatal('You can currently not set the `sass` config.');
        return;
    }

    grunt.loadTasks(path.join(__dirname, '../node_modules/grunt-sass/tasks'));
    
    var versionPrefix = config.getVersionPrefix(grunt);

    var files = {},
        source = 'src/scss/index.scss';
    if (grunt.file.exists(source)) {
        files['dist/'+versionPrefix+'css/bundle.css'] = source;
    }
    
    grunt.config.set('sass', {
        dist: {
            files: files
        }
    });
};