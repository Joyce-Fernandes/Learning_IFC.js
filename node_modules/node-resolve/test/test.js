/**
 * Copyright (C) 2016 yanni4night.com
 * test.js
 *
 * changelog
 * 2016-06-14[18:11:14]:revised
 * 2016-07-28[13:43:35]:support browser spec
 *
 * @author yanni4night@gmail.com
 * @version 1.3.3
 * @since 1.0.0
 */
'use strict';
var nodeResolve = require('../');
var assert = require('assert');
var path = require('path');
var fs = require('fs');

describe('node-resolve', function () {
    describe('#isCore', function () {
        it('should return true if "fs"', function () {
            assert.ok(nodeResolve.isCore('fs'));
        });
    });
    describe('#nodeModulesPaths', function () {
        it('should return all paths', function () {
            var paths = nodeResolve.nodeModulesPaths(__dirname);
            assert.deepEqual(paths.length, __dirname.split(path.sep).length);
        });
        it('should return all paths when last is "/"', function () {
            var paths = nodeResolve.nodeModulesPaths(__dirname + '/');
            assert.deepEqual(paths.length, __dirname.split(path.sep).length);
        });
        it('should return all paths when last is "node_modules"', function () {
            var paths = nodeResolve.nodeModulesPaths(__dirname + '/node_modules');
            assert.deepEqual(paths.length, __dirname.split(path.sep).length);
        });
    });
    describe('#loadNpmModules', function () {
        it('should get is-builtin-module', function () {
            var target = nodeResolve.loadNpmModules('is-builtin-module', __dirname);
            assert.ok(fs.existsSync(target));
        });

        it('should get lodash/fp/extend', function () {
            var extend = nodeResolve.loadNpmModules('lodash/fp/extend', __dirname);
            assert.ok(fs.existsSync(extend));
        });
    });
    describe('#loadAsFile', function () {
        it('should load test.js', function () {
            var test = nodeResolve.loadAsFile(__dirname + '/test.js');
            assert.ok(fs.existsSync(test));
        });
    });
    describe('#loadAsDirectory', function () {
        it('should get index.js', function () {
            var test = nodeResolve.loadAsDirectory(path.join(__dirname, '..'));
            assert.ok(fs.existsSync(test));
        });
        it('should get moon', function () {
            var test = nodeResolve.loadAsDirectory(path.join(__dirname, './moon'));
            assert.ok(fs.existsSync(test));
        });
    });
    describe('#resolve', function () {
        var cwd = __dirname;

        it('should resolve is-builtin-module', function () {
            var target = nodeResolve.resolve('test.js', 'is-builtin-module', cwd);
            assert.ok(fs.existsSync(__dirname + '/' + target));
        });
        it('should resolve test', function () {
            var test = nodeResolve.resolve('test.js', './foo/index.js', cwd);
            assert.ok(fs.existsSync(__dirname + '/' + test));
        });
        it('should get null if builtin', function () {
            var fs = nodeResolve.resolve('test.js', 'fs', cwd);
            assert.equal(fs, null);
        });
        it('should get null if undefined', function () {
            var no = nodeResolve.resolve('test.js', './no', cwd);
            assert.equal(no, undefined);
        });
        it('should get sub dir', function () {
            var foo = nodeResolve.resolve('test.js', 'lodash/fp/extend', cwd);
            assert.ok(fs.existsSync(__dirname + '/' + foo));
        });
        it('should get dir', function () {
            var foo = nodeResolve.resolve('test.js', './foo/', cwd);
            assert.ok(fs.existsSync(__dirname + '/' + foo));
        });
        it('should get json', function () {
            var pack = nodeResolve.resolve('test.js', './pack', cwd);
            assert.ok(fs.existsSync(__dirname + '/' + pack));
        });
        it('should get json under dir', function () {
            var bar = nodeResolve.resolve('test.js', './bar/', cwd);
            assert.ok(fs.existsSync(__dirname + '/' + bar));
        });
        it('should get file', function () {
            var bar = nodeResolve.resolve('test.js', './moon', cwd);
            assert.ok(fs.existsSync(__dirname + '/' + bar));
        });
        it('should resolve in node_modules', function () {
            var lodash = nodeResolve.resolve('../node_modules/lodash/extend.js', 'lodash', cwd);
            assert.ok(fs.existsSync(__dirname + '/' + lodash));
        });
        it('should resolve in browser', function () {
            var inherits = nodeResolve.resolve('test.js', 'inherits', cwd, true);
            assert.deepEqual(path.basename(inherits), 'inherits_browser.js');
            assert.ok(fs.existsSync(__dirname + '/' + inherits));
        });
        it('should resolve from browser', function () {
            var index = nodeResolve.resolve('test.js', '../index.js', cwd, true);
            assert.deepEqual(path.basename(index), 'empty.js');
        });
        it('should resolve null from browser', function () {
            var useless = nodeResolve.resolve('test.js', 'useless', cwd, true);
            assert.deepEqual(useless, undefined);
        });
    });
});