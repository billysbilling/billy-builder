module.exports = function(grunt) {
    var tasks = ['start_build', 'handlebars', 'svg', 'browserify', 'uglify'];

    if (grunt.config.get('billy_builder.sass')) {
        tasks.push('sass');
    }

    if (grunt.config.get('billy_builder.compass')) {
        tasks.push('compass');
    }

    tasks = tasks.concat(['images', 'html', 'end_build']);
    console.log(tasks);

    grunt.registerTask('build', tasks);
};