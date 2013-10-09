module.exports = {
    getAll: function(grunt) {
        return grunt.config.get('billy_builder');
    },
    
    getVersionPrefix: function(grunt) {
        var version = grunt.config.get('billy_builder.version');
        return version ? 'releases/' + version + '/' : '';
    }
}