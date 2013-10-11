module.exports = {
    getAll: function(grunt) {
        return grunt.config.get('billy-builder');
    },
    
    getVersionPrefix: function(grunt) {
        var version = grunt.config.get('billy-builder.version');
        return version ? 'releases/' + version + '/' : '';
    }
}