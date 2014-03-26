module.exports = function(grunt) {
    var tasks = [];

    if (grunt.config.get('billy-builder.sass')) {
        tasks.push('sass');
    }

    if (grunt.config.get('billy-builder.compass')) {
        tasks.push('compass');
    }

    grunt.registerTask('build-css', tasks);
};
