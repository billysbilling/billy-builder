var browserify = require('browserify'),
    path = require('path'),
    fs = require('fs'),
    async = require('async'),
    config = require('../config');

var envOptions = {
    development: {
        bowerEntry: [
            'index.js',
            'src/js/index.js'
        ]
    },
    production: {
        bowerEntry: [
            'index.min.js',
            'src/js/index.min.js',
            'index.js',
            'src/js/index.js'
        ]
    }
};

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
        grunt.util._.find(envOptions[process.env.NODE_ENV || 'development'].bowerEntry, function(suffix) {
            var indexFile = path.join(dir, suffix);
            if (grunt.file.isFile(indexFile)) {
                b.require('./' + indexFile, {entry: true, expose: path.basename(dir)});
                return true;
            }
        });
    });
}

function bundle(grunt, b, dest, callback) {
    b.bundle({
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