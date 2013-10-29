module.exports = function(grunt) {
    grunt.registerTask('server', ['express', 'watch']);
    
    //`grunt s` shortcut
    grunt.registerTask('s', ['server']);
};