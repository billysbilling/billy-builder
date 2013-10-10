var express = require('express'),
    connect = require('connect'),
    connectLivereload = require('connect-livereload'),
    http = require('http'),
    path = require('path'),
    async = require('async'),
    fs = require('fs');

module.exports = function(grunt) {
    grunt.registerTask('express', 'serve and lol', function() {
        var done = this.async();
        
        var app = createApp();

        startServer(app, function(err, app) {
            if (err) {
                grunt.log.error('Express server startup failed:');
                grunt.fail.fatal(err);
                return;
            }
            
            grunt.log.ok('Express server listening on port ' + app.get('port'));
            done();
        });
    });
};

function createApp() {
    var app = express();
    
    app.set('port', process.env.PORT || 4499);
    app.use(connectLivereload({
        port: 35729
    }));
    app.use('/tests.html', express.static('dist/tests.html'));
    app.use('/', express.static('dist'));
    app.use(express.errorHandler());
    
    setupCatchAll(app);
    
    return app;
}

function startServer(app, callback) {
    var server = http.createServer(app);
    server.listen(app.get('port'), function() {
        callback(null, app);
    });
}

function setupCatchAll(app) {
    app.get('*', function(req, res) {
        async.series([
            function(callback) {
                waitForBuild(1, callback);
            },
            function(callback) {
                res.set('Content-Type', 'text/html');
                res.send(fs.readFileSync('dist/index.html'));
                callback();
            }
        ], function(err) {
            if (err) return callback(err);
        });
    });
}

function waitForBuild(attempt, callback) {
    if (attempt > 200) { //10 seconds
        return callback(new Error('Timeout waiting for build task to complete.'));
    }
    fs.exists('dist/building-flag', function(exists) {
        if (!exists) {
            callback();
        } else {
            setTimeout(function() {
                waitForBuild(attempt+1, callback);
            }, 50);
        }
    })
}