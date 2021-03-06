var childProcess = require('child_process'),
    path = require('path');

module.exports = function(grunt) {
    grunt.registerTask('test-runner', 'run run run', function() {
        var done = this.async();

        var testNumber = grunt.option('testNumber'),
            module = grunt.option('module'),
            url = 'http://localhost:'+grunt.config.get('billy-builder.port')+'/tests.html?';
        if (testNumber) {
            url += 'testNumber='+testNumber+'&';
        }
        if (module) {
            url += 'module='+encodeURIComponent(module)+'&';
        }
        
        var phantomjs = childProcess.spawn('phantomjs', [path.join(__dirname, '../phantom-test-runner.js'), url]);
        phantomjs.stdout.pipe(process.stdout);
        phantomjs.stderr.pipe(process.stderr);
        phantomjs.on('error', function(err) {
            grunt.fail.fatal('Could not run `phantomjs`: '+err+'\n\nPlease make sure that you have PhantomJS (http://phantomjs.org/) installed and that it\'s accessible in your PATH as `phantomjs`.');
        });
        phantomjs.on('exit', function(code) {
            if (code !== 0) {
                grunt.fail.fatal('Test runner exited with code '+code);
            }
            done();
        });
    });
};