module.exports = function(grunt) {
    grunt.registerTask('server', ['build', 'express', 'watch']);
};