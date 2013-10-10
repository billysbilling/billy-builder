var childProcess = require('child_process'),
    path = require('path');

module.exports = function(grunt) {
    grunt.registerTask('test-runner', 'run run run', function() {
        var done = this.async();
        
        var phantomjs = childProcess.spawn('phantomjs', [path.join(__dirname, '../phantom-test-runner.js')]);
        phantomjs.stdout.pipe(process.stdout);
        phantomjs.stderr.pipe(process.stderr);
        phantomjs.on('exit', function(code) {
            if (code !== 0) {
                grunt.fail.fatal('Test runner exited with code '+code);
            }
            done();
        });
    });
};