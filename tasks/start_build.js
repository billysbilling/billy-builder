var path = require('path'),
    config = require('../config');

module.exports = function(grunt) {
    grunt.registerTask('start_build', 'lol and build', function() {
        var versionPrefix = config.getVersionPrefix(grunt);
        
        grunt.file.delete('dist');

        grunt.file.mkdir('dist');

        grunt.file.mkdir('temp');
        
        grunt.file.write('dist/building-flag', '');

        grunt.file.copy(path.join(__dirname, '../qunit/qunit-1.12.0.js'), 'dist/'+versionPrefix+'vendor/qunit/qunit.js');
        grunt.file.copy(path.join(__dirname, '../qunit/qunit-1.12.0.css'), 'dist/'+versionPrefix+'vendor/qunit/qunit.css');
        
        grunt.log.ok('Starting build...');
    });
};