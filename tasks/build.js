module.exports = function(grunt) {
    grunt.registerTask('build', ['start_build', 'handlebars', 'svg', 'browserify', 'uglify', 'compass', 'images', 'html', 'end_build']);
};