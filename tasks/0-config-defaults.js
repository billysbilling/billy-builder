var config = require('../config');

module.exports = function(grunt) {
    var defaults = {
        port: process.env.PORT || 4401,
        
        version: 'default',

        httpPath: '/',

        extraDependencyDirs: [],
        
        compass: false,
        sass: false,
        
        title: 'Unnamed billy-builder app',
        favicon: grunt.file.exists('src/images/favicon.ico') ? 'images/favicon.ico' : null,
        jsConfig: {},
        indexJsConfig: {},
        testsJsConfig: {
            ENV: {
                isTest: true
            }
        },
        extraCssUrls: [],
        extraJsUrls: []
    };
    
    for (var k in defaults) {
        if (!defaults.hasOwnProperty(k)) continue;
        var configKey = 'billy-builder.'+k;
        if (typeof grunt.config.get(configKey) === 'undefined') {
            grunt.config.set(configKey, defaults[k]);
        }
    }
};