var path = require('path'),
    async = require('async'),
    Modularizer = require('../js-modularizer/js-modularizer'),
    config = require('../config');

module.exports = function(grunt) {
    grunt.registerTask('js-modularize', 'lol and build', function() {
        var done = this.async(),
            versionPrefix = config.getVersionPrefix(grunt);
        
        async.series([
            function(callback) {
                var m = initModularizer(grunt);
                bundle(grunt, m, './dist/'+versionPrefix+'js/bundle.js', callback);
            },
            function(callback) {
                var m = initModularizer(grunt);

                if (grunt.file.isDir('tests')) {
                    grunt.file.recurse('tests', function(abspath) {
                        m.add('./' + abspath, {entry: true});
                    });
                }
                
                bundle(grunt, m, './dist/'+versionPrefix+'js/tests-bundle.js', callback);
            }
        ], done);
    });
};


function initModularizer(grunt) {
    var m = new Modularizer();

    requireBowerComponents(grunt, m);

    addFiles(grunt, m, 'src/js');

    m.add('./src/js/index.js', {
        entry: true
    });
    
    m.add('./temp/templates.js', {
        expose: 'templates'
    });
    m.add('./temp/svg.js', {
        expose: 'svg'
    });
    
    return m;
}

function requireBowerComponents(grunt, m) {
    grunt.file.expand(['bower_components/*']).forEach(function(dir) {
        var bower = getBowerConfig(grunt, dir),
            bb = bower.config.billyBuilder;
        
        if (bb && bb.include) {
            addFiles(grunt, m, path.join(dir, bb.include));
        }
        
        m.add('./' + bower.mainFile, {
            expose: path.basename(dir)
        });
    });
}

function getBowerConfig(grunt, dir) {
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
    return {
        config: bowerConfig,
        mainFile: mainFile
    };
}

function addFiles(grunt, m, dir) {
    grunt.file.expand([dir+'/**/*.js']).forEach(function(file) {
        m.add('./' + file);
    });
}

function bundle(grunt, m, dest, callback) {
    m.bundle(function(err, src) {
        if (err) {
            grunt.log.error('Modularizer compilation failed:');
            grunt.fail.fatal(err);
            return;
        }

        grunt.file.write(dest, src);
        grunt.log.ok('Bundled '+dest);

        callback();
    });
}