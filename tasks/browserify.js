var browserify = require('browserify'),
    path = require('path'),
    fs = require('fs'),
    async = require('async'),
    config = require('../config');

module.exports = function(grunt) {
    grunt.registerTask('browserify', 'lol and build', function() {
        var done = this.async(),
            versionPrefix = config.getVersionPrefix(grunt);
        
        async.series([
            function(callback) {
                var b = initBundle(grunt);
                bundle(grunt, b, './dist/'+versionPrefix+'js/bundle.js', callback);
            },
            function(callback) {
                var b = initBundle(grunt);

                if (grunt.file.exists('tests')) {
                    grunt.file.recurse('tests', function(abspath) {
                        b.add('./' + abspath);
                    });
                }
                
                bundle(grunt, b, './dist/'+versionPrefix+'js/tests-bundle.js', callback);
            }
        ], done);
    });
};


function initBundle(grunt) {
    var b = browserify({
        ignoreMissing: true
    });

    addBowerRequires(grunt, b);

    b.add('./src/js/index.js');
    b.add('./temp/handlebars.js');
    b.add('./temp/svg.js');
    
    return b;
}

function addBowerRequires(grunt, b) {
    grunt.file.expand(['bower_components/*']).forEach(function(dir) {
        b.require('./' + getBowerMainFile(grunt, dir), {
            expose: path.basename(dir)
        });
    });
}

function getBowerMainFile(grunt, dir) {
    var bowerConfig;

    try {
        bowerConfig = JSON.parse(grunt.file.read(path.join(dir, 'bower.json')));
    } catch (e) {
        grunt.fail.fatal('Could not read bower.json from '+dir+': '+e.message);
        return;
    }

    var main = bowerConfig.main;
    if (main instanceof Array) {
        main = main[0];
    }
    var mainFile = path.join(dir, main);

    if (!grunt.file.exists(mainFile)) {
        grunt.fail.fatal('Main bower file '+mainFile+' does not exist.');
    }

    if (process.env.NODE_ENV === 'production') {
        var minMainFile = path.join(dir, main.replace(/\.js$/, '.min.js'));
        if (grunt.file.exists(minMainFile)) {
            mainFile = minMainFile;
        }
    }
    return mainFile;
}

function bundle(grunt, b, dest, callback) {
    b.bundle({
        detectGlobals: false,
        debug: process.env.NODE_ENV !== 'production'
    }, function(err, src) {
        if (err) {
            grunt.log.error('Browserify compilation failed:');
            grunt.fail.fatal(err);
            return;
        }

        grunt.file.write(dest, src);
        grunt.log.ok('Bundled '+dest);

        callback();
    });
}