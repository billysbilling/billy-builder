var path = require('path'),
    fs = require('fs'),
    async = require('async'),
    config = require('../config');

module.exports = function(grunt) {
    grunt.registerTask('fonts', 'lol and build', function() {
        var fonts = {};
        
        copyFonts(grunt, fonts, '.');
        grunt.file.expand(['bower_components/*']).forEach(function(dir) {
            copyFonts(grunt, fonts, dir);
        });
    });
};

function copyFonts(grunt, fonts, dir) {
    var fontsDir = path.join(dir || '', 'src/fonts');

    if (!grunt.file.isDir(fontsDir)) {
        return;
    }
    
    grunt.file.recurse(fontsDir, function(abspath, rootdir, subdir, filename) {
        if (filename.match(/\.(ttf|woff|otf)$/)) {
            var name = path.join(subdir || '', filename);
            
            if (fonts[name]) {
                grunt.log.warn('The font name `'+name+'` is ambiguous. It was found in both `'+fonts[name]+'` and `'+abspath+'`.');
                return;
            }
            
            fonts[name] = abspath;
            
            grunt.file.copy(abspath, path.join('dist', config.getVersionPrefix(grunt), 'fonts', name));

            grunt.log.ok('Copied '+name+' from '+rootdir);
        }
    })
}