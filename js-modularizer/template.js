require=(function(moduleDefinitions, exposes, entries) {
    var modules = {};
    
    var load = function (moduleName) {
        var definition = moduleDefinitions[moduleName];

        if (!definition) {
            var e = Error('Cannot find module '+moduleName);
            e.code = 'MODULE_NOT_FOUND';
            throw e;
        }

        var module = {
            exports: {}
        };
        definition.call(module.exports, module, relativeRequireFactory(moduleName));
        return module;
    };
    
    var require = function(moduleName) {
        var exposedName = exposes[moduleName];
        if (exposedName) {
            return require(exposedName);
        }
        
        var module = modules[moduleName];
        
        if (!modules[moduleName]) {
            module = load(moduleName);
        }
        
        return module.exports;
    };
    
    var relativeRequireFactory = function(requirerName) {
        var requirerDir = requirerName.replace(/\/[^\/]*$/, '');
        console.log(requirerName, requirerDir);
        return function(moduleName) {
            if (moduleName.substring(0, 2) === './' || moduleName.substring(0, 3) === '../') {
                moduleName = canonicalizePath(requirerDir + '/' + moduleName);
            }
            return require(moduleName);
        };
    };

    var canonicalizePath = function(path) {
        var parts = path.split('/'),
            partCount = parts.length,
            part,
            i,
            canonicalized = [];
        for (i = 0; i < partCount; i++) {
            part = parts[i];
            if (!part || part === '.') {
                continue;
            }
            if (part === '..') {
                canonicalized.pop();
                continue;
            }
            canonicalized.push(part);
        }
        return canonicalized.join('/');
    };
    
    entries.forEach(function(moduleName) {
        require(moduleName);
    });
    
    return require;
})({
//{{moduleDefinitions}}
}, {
//{{exposes}}
}, [
//{{entries}}
]);