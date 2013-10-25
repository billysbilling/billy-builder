module.exports = {
    getAll: getAll,
    getVersionPrefix: getVersionPrefix,
    getReleaseHttpPath: getReleaseHttpPath
};


function getAll(grunt) {
    return grunt.config.get('billy-builder');
}

function getVersionPrefix(grunt) {
    var version = grunt.config.get('billy-builder.version');
    return version ? 'releases/' + version + '/' : '';
}

function getReleaseHttpPath(grunt) {
    return grunt.config.get('billy-builder.httpPath') + getVersionPrefix(grunt);
}