var fs = require('fs'),
    async = require('async'),
    path = require('path'),
    _ = require('lodash');

var Modularizer = function() {
    this._files = {};
};

module.exports = Modularizer;

Modularizer.prototype.add = function(file, opts) {
    file = path.relative('.', file);
    opts = opts || {};
    this._files[file] = opts;
};

Modularizer.prototype.bundle = function(callback) {
    var self = this;
    
    async.waterfall([
        function(callback) {
            self._buildFileContents(callback);
        },
        function(contents, callback) {
            self._compile(contents, self._getExposes(), self._getEntries(), callback);
        }
    ], callback)
};

Modularizer.prototype._buildFileContents = function(callback) {
    async.reduce(Object.keys(this._files), [], this._pushFileContents.bind(this), callback);
};

Modularizer.prototype._pushFileContents = function(contents, file, callback) {
    fs.readFile(file, function(err, fileContents) {
        if (err) return callback(err);

        fileContents = fileContents.toString();
        
        var extension = path.extname(file),
            transform = transforms[extension];
        fileContents = transform(fileContents);
        
        contents.push('\''+toName(file)+'\': function(module, exports, require) {\n'+fileContents+'\n}')
        callback(null, contents);
    });
};

Modularizer.prototype._getExposes = function() {
    var exposes = [];
    _.each(this._files, function(opts, file) {
        var expose = opts.expose;
        if (expose) {
            exposes.push('\''+expose+'\': \''+toName(file)+'\'');
        }
    });
    return exposes;
};

Modularizer.prototype._getEntries = function() {
    var entries = [];
    _.each(this._files, function(opts, file) {
        if (opts.entry) {
            entries.push('\''+toName(file)+'\'');
        }
    });
    return entries;
};

Modularizer.prototype._compile = function(contents, exposes, entries, callback) {
    fs.readFile(path.join(__dirname, 'template.js'), function(err, c) {
        if (err) return callback(err);
        var template = [],
            s;

        s = c.toString().split('//{{moduleDefinitions}}', 2);
        template[0] = s[0];

        s = s[1].split('//{{exposes}}', 2);
        template[1] = s[0];

        s = s[1].split('//{{entries}}', 2);
        template[2] = s[0];
        template[3] = s[1];
        
        var compiled = template[0] + contents.join(',\n') + template[1] + exposes.join(',\n') + template[2] + entries.join(',\n') + template[3];
        callback(null, compiled);
    });
};


function toName(file) {
    return file.replace(/\.[^\.]*$/, '');
}

var transforms = {};

transforms['.js'] = function(contents) {
    return contents;
};

transforms['.hbs'] = transforms['.handlebars'] = function(contents) {
    return 'module.exports = Ember.Handlebars.compile('+JSON.stringify(contents)+');';
};