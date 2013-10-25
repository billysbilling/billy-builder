module.exports = function(grunt) {
    grunt.registerTask('build', ['start-build', 'build-js', 'build-css', 'images', 'fonts', 'html', 'end-build']);
};