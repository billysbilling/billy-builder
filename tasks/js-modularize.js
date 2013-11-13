var _ = require('lodash'),
    path = require('path'),
    async = require('async'),
    Modularizer = require('../js-modularizer/js-modularizer'),
    config = require('../config');

module.exports = function(grunt) {
    grunt.registerTask('js-modularize', 'lol and build', function() {
        var done = this.async(),
            versionPrefix = config.getVersionPrefix(grunt);
        
        async.series([
            function(callback) {
                var m = initModularizer(grunt, false);
                bundle(grunt, m, './dist/'+versionPrefix+'js/bundle.js', callback);
            },
            function(callback) {
                var m = initModularizer(grunt, true);

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

function initModularizer(grunt, includeDev) {
    var m = new Modularizer(),
        includedModules = {};

    requireModule(grunt, m, includedModules, '', true);

    m.add('./temp/svg.js', {
        expose: 'svg'
    });

    requireExtraDependencies(grunt, includedModules, m);

    if (includeDev) {
        requireBowerDependencies(grunt, m, includedModules, '', 'devDependencies');
    }
    
    return m;
}

function requireBowerDependencies(grunt, m, includedModules, dir, dependenciesKey) {
    var config = getBowerConfig(grunt, dir).config,
        dependencies = config[dependenciesKey];

    if (dependencies) {
        _.each(dependencies, function(version, dependency) {
            requireModule(grunt, m, includedModules, 'bower_components/'+dependency, false);
        });
    }
}

function requireExtraDependencies(grunt, includedModules, m) {
    var extraDependencyDirs = grunt.config.get('billy-builder.extraDependencyDirs').map(function(dir) {
        return dir + '/*';
    });

    grunt.file.expand(extraDependencyDirs).forEach(function(dir) {
        requireModule(grunt, m, includedModules, dir, false);
    });
}

function requireModule(grunt, m, includedModules, dir, mainIsEntry) {
    if (includedModules[dir]) {
        return;
    }
    includedModules[dir] = true;

    requireBowerDependencies(grunt, m, includedModules, dir, 'dependencies');

    var bower = getBowerConfig(grunt, dir),
        bb = bower.config['billy-builder'];

    if (bb && bb.include) {
        (bb.include instanceof Array ? bb.include : [bb.include]).forEach(function(include) {
            addFiles(grunt, m, path.join(dir, include));
        });
    }

    if (bower.mainFile) {
        m.add('./' + bower.mainFile, {
            expose: path.basename(dir),
            entry: mainIsEntry
        });
    }
}

function getBowerConfig(grunt, dir) {
    var bowerConfig;

    try {
        bowerConfig = JSON.parse(grunt.file.read(path.join(dir, 'bower.json')));
    } catch (e) {
        grunt.fail.fatal('Could not read bower.json from '+dir+': '+e.message);
        return;
    }

    var main = bowerConfig.main,
        mainFile = null;
    if (main) {
        if (main instanceof Array) {
            main = main[0];
        }
        mainFile = path.join(dir, main || '');
    
        if (!grunt.file.exists(mainFile)) {
            grunt.fail.fatal('Main bower file '+mainFile+' does not exist.');
        }

        if (process.env.NODE_ENV === 'production') {
            var minMainFile = path.join(dir, main.replace(/\.js$/, '.min.js'));
            if (grunt.file.exists(minMainFile)) {
                mainFile = minMainFile;
            }
        }
    }
    return {
        config: bowerConfig,
        mainFile: mainFile
    };
}

function addFiles(grunt, m, dir) {
    grunt.file.expand([dir+'/**/*.js', dir+'/**/*.json', dir+'/**/*.hbs']).forEach(function(file) {
        //Don't add files beginning with a .
        if (path.basename(file).substring(0, 1) !== '.') {
            m.add('./' + file);
        }
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