var path = require('path');

module.exports = function(grunt) {
    if (grunt.config.get('watch')) {
        grunt.fail.fatal('You can currently not set the `watch` config.');
        return;
    }

    grunt.loadTasks(path.join(__dirname, '../node_modules/grunt-contrib-watch/tasks'));
    
    grunt.config.set('watch', {
        scripts: {
            options: {
                atBegin: true,
                interrupt: true,
                spawn: false
            },
            files: [
                'src/**/*.js',
                'bower_components/**/*.js',
                'tests/**/*.js'
            ],
            tasks: ['build']
        }
    });
};