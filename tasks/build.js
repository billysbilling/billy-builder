module.exports = function(grunt) {
    grunt.registerTask('build', ['start-build', 'templates', 'svg', 'js-modularize', 'build-js', 'build-css', 'images', 'html', 'end-build']);
};