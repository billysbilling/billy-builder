module.exports = function(grunt) {
    grunt.registerTask('build', ['start-build', 'build-js', 'build-css', 'images', 'html', 'end-build']);
};