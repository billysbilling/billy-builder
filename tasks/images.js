var path = require('path'),
    fs = require('fs'),
    async = require('async'),
    config = require('../config');

module.exports = function(grunt) {
    grunt.registerTask('images', 'lol and build', function() {
        var images = {};
        
        copyImages(grunt, images, '.');
        grunt.file.expand(['bower_components/*']).forEach(function(dir) {
            copyImages(grunt, images, dir);
        });
    });
};

function copyImages(grunt, images, dir) {
    var imagesDir = path.join(dir || '', 'src/images');

    if (!grunt.file.isDir(imagesDir)) {
        return;
    }
    
    grunt.file.recurse(imagesDir, function(abspath, rootdir, subdir, filename) {
        if (filename.match(/\.(png|jpg|jpeg|gif|ico)$/)) {
            var name = path.join(subdir || '', filename);
            
            if (images[name]) {
                grunt.log.warn('The image name `'+name+'` is ambiguous. It was found in both `'+images[name]+'` and `'+abspath+'`.');
                return;
            }
            
            images[name] = abspath;
            
            grunt.file.copy(abspath, path.join('dist', config.getVersionPrefix(grunt), 'images', name));

            grunt.log.ok('Copied '+name+' from '+rootdir);
        }
    })
}