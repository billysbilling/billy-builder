var fs = require('fs'),
    async = require('async'),
    path = require('path');

module.exports = function(grunt) {
    grunt.registerTask('svg', 'lol and build', function() {
        var c = 'var svg = {};\n\n';

        c += addSvgFromDir(grunt, '.');

        grunt.file.expand(['bower_components/*']).forEach(function(dir) {
            c += addSvgFromDir(grunt, dir);
        });

        c += 'module.exports = svg;';

        grunt.file.write('temp/svg.js', c);

        grunt.log.ok('Built SVG');
    });
};

function addSvgFromDir(grunt, dir) {
    var imagesDir = path.join(dir || '', 'src/images');

    if (!grunt.file.isDir(imagesDir)) {
        return '';
    }

    var c = '';
    grunt.file.recurse(imagesDir, function(abspath, rootdir, subdir, filename) {
        var match = filename.match(/^(.+)\.svg$/);
        if (match) {
            var name = path.join(subdir || '', match[1]);
            c += addSvg(grunt, abspath, name);
        }
    });
    return c;
}


function addSvg(grunt, abspath, name) {
    return 'svg[\''+name+'\'] = '+JSON.stringify(grunt.file.read(abspath))+';\n\n';
}