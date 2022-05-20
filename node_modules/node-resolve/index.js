/**
 * Copyright (C) 2016 yanni4night.com
 * index.js
 *
 * changelog
 * 2016-06-14[16:03:54]:revised
 * 2016-07-28[13:43:53]:support browser spec
 *
 * @author yanni4night@gmail.com
 * @version 1.3.3
 * @since 1.0.0
 */

'use strict';
var path = require('path');
var fs = require('fs');

var startsWith = require('lodash/startsWith');
var isPlainObject = require('lodash/isPlainObject');
var isString = require('lodash/isString');
var isBuiltinModule = require('is-builtin-module');

var isCore = exports.isCore = isBuiltinModule;

var loadAsFile = exports.loadAsFile = function (module) {

    if (fs.existsSync(module) && fs.statSync(module).isFile()) {
        return module;
    }

    if (fs.existsSync(module + '.js') && fs.statSync(module + '.js').isFile()) {
        return module + '.js';
    }

    if (fs.existsSync(module + '.json') && fs.statSync(module + '.json').isFile()) {
        return module + '.json';
    }

};

var loadAsDirectory = exports.loadAsDirectory = function (module, browser) {

    if (!fs.existsSync(module)) {
        return;
    }

    var stat = fs.statSync(module);

    if (stat.isDirectory()) {
        var packagePath = module + '/package.json';
        if (fs.existsSync(packagePath) && fs.statSync(packagePath).isFile()) {
            var pkg = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
            var main = path.join(module, (browser && isString(pkg.browser) ? pkg.browser : pkg.main) || 'index.js');
            return loadAsFile(main) || loadAsDirectory(main, browser);
        } else if (fs.existsSync(module + '/index.js') && fs.statSync(module + '/index.js').isFile()) {
            return path.join(module, '/index.js');
        } else if (fs.existsSync(module + '/index.json') && fs.statSync(module + '/index.json').isFile()) {
            return path.join(module, '/index.json');
        }
    } else if (stat.isFile()) {
        return loadAsFile(module);
    }
};

var nodeModulesPaths = exports.nodeModulesPaths = function (start) {
    var parts = start.split(path.sep);

    if (!parts[parts.length - 1]) {
        parts.pop();
    }

    var i = parts.length - 1;
    var dirs = [];
    while (i >= 0) {
        if ('node_modules' === parts[i]) {
            i -= 1;
            continue;
        }
        var dir = path.join(parts.slice(0, i + 1).join(path.sep) || path.sep, 'node_modules');
        dirs.push(dir);
        i -= 1;
    }
    return dirs;
};

var loadNpmModules = exports.loadNpmModules = function (module, start, browser) {
    var target;
    var paths = nodeModulesPaths(start);

    for (var i = 0; i < paths.length; ++i) {
        var dependencyPath = path.join(paths[i], module);
        target = loadAsFile(dependencyPath) || loadAsDirectory(dependencyPath, browser);

        if (target) {
            break;
        }
    }
    return target;
};

function shim(target) {
    var current = path.dirname(target);
    var last = current;

    do {
        var pack = path.join(current, 'package.json');
        if (fs.existsSync(pack)) {
            var stat = fs.statSync(pack);
            if (stat.isFile()) {
                var json = JSON.parse(fs.readFileSync(pack, 'utf-8'));
                if (isPlainObject(json.browser)) {
                    for (var key in json.browser) {
                        var shimed = path.join(current, key);
                        if (shimed === target) {
                            if (isString(json.browser[key])) {
                                return path.join(current, json.browser[key]);
                            } else if (false === json.browser[key]) {
                                return undefined;
                            }
                        }
                    }
                }
            }
        }
        last = current;
        current = path.join(current, '..');
    } while (current !== last);

    return target;
}

exports.resolve = function (script, dependency, cwd, browser) {
    var target;

    if (isCore(dependency)) {
        return null;
    }

    cwd = cwd || '.';

    if (startsWith(dependency, './') || startsWith(dependency, '/') || startsWith(dependency, '../')) {
        var dependencyPath = path.join(cwd, path.dirname(script), dependency);
        target = loadAsFile(dependencyPath) || loadAsDirectory(dependencyPath, browser);
    } else {
        target = loadNpmModules(dependency, path.join(cwd, path.dirname(script)), browser);
    }

    if (target) {
        target = shim(target);
    }

    if (target) {
        target = path.relative(cwd, target);
    }
    return target;
};