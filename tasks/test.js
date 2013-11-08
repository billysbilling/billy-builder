module.exports = function(grunt) {
    var tasks = ['build', 'express'];
    
    if (grunt.config.get('billy-builder.jshint')) {
        tasks.push('jshint');
    }
    
    tasks.push('test-runner');
    
    grunt.registerTask('test', tasks);
};