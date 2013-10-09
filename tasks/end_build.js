module.exports = function(grunt) {
    grunt.registerTask('end_build', 'lol and build', function() {
        grunt.file.delete('dist/building-flag');
        grunt.file.delete('temp');
        grunt.log.ok('Cleaned up after build');
    });
};