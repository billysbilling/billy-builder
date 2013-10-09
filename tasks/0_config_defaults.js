var config = require('../config');

module.exports = function(grunt) {
    var defaults = {
        version: 'default',
        title: 'Unnamed billy-builder app',
        favicon: grunt.file.exists('src/images/favicon.ico') ? config.getVersionPrefix(grunt)+'images/favicon.ico' : null,
        jsConfig: null,
        indexJsConfig: null,
        testsJsConfig: null
    };
    
    for (var k in defaults) {
        if (!defaults.hasOwnProperty(k)) continue;
        var configKey = 'billy_builder.'+k;
        if (typeof grunt.config.get(configKey) === 'undefined') {
            grunt.config.set(configKey, defaults[k]);
        }
    }
};