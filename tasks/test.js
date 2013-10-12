module.exports = function(grunt) {
    grunt.registerTask('test', ['build', 'express', 'test-runner']);
};