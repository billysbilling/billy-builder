var path = require('path'),
    fs = require('fs'),
    jade = require('jade'),
    async = require('async'),
    _ = require('lodash'),
    config = require('../config');

module.exports = function(grunt) {
    grunt.registerTask('html', 'lol and build', function() {
        var c = config.getAll(grunt),
            releaseHttpPath = config.getReleaseHttpPath(grunt),
            commonConfig = {ENV: {releasePath: releaseHttpPath}},
            favicon = c.favicon ? releaseHttpPath + c.favicon : null,
            preHeadHtml = formatHeadHtml(grunt, c.preHeadHtml),
            postHeadHtml = formatHeadHtml(grunt, c.postHeadHtml);
        
        writeHtml(grunt, 'index', {
            preHeadHtml: preHeadHtml,
            postHeadHtml: postHeadHtml,
            title: c.title,
            favicon: favicon,
            jsConfig: _.merge({}, commonConfig, c.jsConfig, c.indexJsConfig),
            cssUrls: [
                releaseHttpPath+'css/bundle.css'
            ].concat(c.extraCssUrls),
            jsUrls: [
                releaseHttpPath+'js/bundle.js'
            ].concat(c.extraJsUrls)
        }, 'dist/index.html');
        
        writeHtml(grunt, 'tests', {
            preHeadHtml: preHeadHtml,
            postHeadHtml: postHeadHtml,
            title: 'Tests: '+c.title,
            favicon: favicon,
            jsConfig: _.merge({}, commonConfig, c.jsConfig, c.testsJsConfig),
            cssUrls: [
                releaseHttpPath+'vendor/qunit/qunit.css',
                releaseHttpPath+'css/bundle.css'
            ].concat(c.extraJsUrls),
            jsUrls: [
                releaseHttpPath+'vendor/qunit/qunit.js',
                releaseHttpPath+'js/tests-bundle.js'
            ].concat(c.extraJsUrls)
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

function formatHeadHtml(grunt, html) {
    html = html || '';
    html = html.replace(/\{\{releaseHttpPath\}\}/g, config.getReleaseHttpPath(grunt));
    return html;
}