var path = require('path'),
    fs = require('fs'),
    jade = require('jade'),
    async = require('async'),
    _ = require('lodash'),
    config = require('../config');

module.exports = function(grunt) {
    grunt.registerTask('html', 'lol and build', function() {
        var c = config.getAll(grunt),
            versionPrefix = config.getVersionPrefix(grunt),
            commonConfig = {ENV: {releaseDir: '/'+versionPrefix}};
        
        writeHtml(grunt, 'index', {
            title: c.title,
            favicon: c.favicon,
            jsConfig: _.merge({}, commonConfig, c.jsConfig, c.indexJsConfig),
            cssUrls: [
                '/'+versionPrefix+'css/bundle.css'
            ],
            jsUrls: [
                '/'+versionPrefix+'js/bundle.js'
            ]
        }, 'dist/index.html');
        
        writeHtml(grunt, 'tests', {
            title: 'Tests: '+c.title,
            favicon: c.favicon,
            jsConfig: _.merge({}, commonConfig, c.jsConfig, c.testsJsConfig),
            cssUrls: [
                '/'+versionPrefix+'vendor/qunit/qunit.css',
                '/'+versionPrefix+'css/bundle.css'
            ],
            jsUrls: [
                '/'+versionPrefix+'vendor/qunit/qunit.js',
                '/'+versionPrefix+'js/tests-bundle.js'
            ]
        }, 'dist/tests.html');
    });
};

function writeHtml(grunt, viewName, locals, dest) {
    formatJsConfig(locals);
    
    var viewFile = path.join(__dirname, '../views/'+viewName+'.jade');

    var c = grunt.file.read(viewFile);
    
    var template = jade.compile(c, {
        filename: viewFile
    });

    var html = template(locals);
    
    grunt.file.write(dest, html);

    grunt.log.ok('Built '+dest);
}

function formatJsConfig(locals) {
    var jsConfig = locals.jsConfig;
    locals.jsConfig = _.reduce(jsConfig, function(result, obj, name) {
        return result + 'var '+name+'='+JSON.stringify(obj)+';';
    }, '');
}