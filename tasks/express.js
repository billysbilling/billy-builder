var express = require('express'),
    connect = require('connect'),
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
    app.use(express.errorHandler());

    app.use('/tests.html', htmlRouteFactory('dist/tests.html'));
    
    app.use('/', express.static('dist'));
    
    app.get('*', htmlRouteFactory('dist/index.html'));
    
    return app;
}

function startServer(app, callback) {
    var server = http.createServer(app);
    server.listen(app.get('port'), function() {
        callback(null, app);
    });
}

function htmlRouteFactory(file) {
    return function(req, res, callback) {
        async.series([
            function(callback) {
                waitForBuild(1, callback);
            },
            function(callback) {
                res.set('Content-Type', 'text/html; charset=utf-8');
                res.send(fs.readFileSync(file));
                callback();
            }
        ], function(err) {
            if (err) return callback(err);
        });
    };
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