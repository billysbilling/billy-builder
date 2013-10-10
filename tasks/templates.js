var fs = require('fs'),
    async = require('async'),
    path = require('path'),
    handlebars = require('handlebars');

module.exports = function(grunt) {
    grunt.registerTask('templates', 'lol and build', function() {
        var c = 'var templates = {};\n\n';
        
        c += compileTemplatesFromDir(grunt, '.');
        
        grunt.file.expand(['bower_components/*']).forEach(function(dir) {
            c += compileTemplatesFromDir(grunt, dir);
        });

        c += 'module.exports = templates;';
        
        grunt.file.write('temp/templates.js', c);

        grunt.log.ok('Compiled Handlebars templates');
    });
};

function compileTemplatesFromDir(grunt, dir) {
    var templatesDir = path.join(dir || '', 'src/templates');
    
    if (!grunt.file.isDir(templatesDir)) {
        return '';
    }
    
    var c = '';
    grunt.file.recurse(templatesDir, function(abspath, rootdir, subdir, filename) {
        var match = filename.match(/^(.+)\.hbs$/);
        if (match) {
            var name = path.join(subdir || '', match[1]);
            c += compileTemplate(grunt, abspath, name);
        }
    });
    return c;
}


function compileTemplate(grunt, abspath, name) {
    return 'templates[\''+name+'\'] = Ember.Handlebars.compile('+JSON.stringify(grunt.file.read(abspath))+');\n\n'
}