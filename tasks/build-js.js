module.exports = function(grunt) {
    var tasks = ['svg', 'js-modularize'];
    
    if (process.env.NODE_ENV === 'production') {
        tasks.push('uglify');
    }

    grunt.registerTask('build-js', tasks);
};