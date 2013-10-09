module.exports = function(grunt) {
    var tasks = ['start_build', 'templates', 'svg', 'browserify'];
    
    if (process.env.NODE_ENV === 'production') {
        tasks.push('uglify');
    }

    if (grunt.config.get('billy_builder.sass')) {
        tasks.push('sass');
    }

    if (grunt.config.get('billy_builder.compass')) {
        tasks.push('compass');
    }

    tasks = tasks.concat(['images', 'html', 'end_build']);

    grunt.registerTask('build', tasks);
};