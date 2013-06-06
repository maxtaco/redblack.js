var assert = require('assert');
var helpers = require('./helpers');
var redblack = require('../redblack.js');

describe('Tree', function() {
    var n = 10000;
    var tree;
    
    beforeEach(function() {
        tree = redblack.tree();
        helpers.loop(n, function(i) {
            tree.insert(i, i);
        });
    });
    
    it('maps key/value pairs', function() {
        helpers.loop(n, function(i) {
            assert.equal(tree.get(i), i);
        });
    });
    
    it('deletes key/value pairs', function() {
        var deleted = helpers.deleteRandom(n, tree);
        
        helpers.loop(n, function(i) {
            assert.equal(tree.get(i), deleted[i] ? null : i);
        });
    });
    
    it('remains balanced', function() {
        helpers.assertBalanced(tree);
        helpers.deleteRandom(n, tree);
        helpers.assertBalanced(tree);
    });
    
    it('traverses nodes in order', function() {
        var i = 0;
        
        tree.forEach(function(value, key) {
            assert.equal(key, i++);
        });
        
        assert.equal(i, n);
    });
    
    it('maps nodes in order', function() {
        var mapped = tree.map(function(value, key) {
             return key;
        });
        
        helpers.loop(n, function(i) {
            assert.equal(mapped[i], i);
        });
    });
    
    it('walks node ranges in order', function() {
        // Start and end
        var i = 123;
        tree.range(123, 4567).forEach(function(value, key) {
            assert.equal(key, i++);
        });
        assert.equal(i, 4568);
        
        // Start
        i = 123;
        tree.range(123).forEach(function(value, key) {
            assert.equal(key, i++);
        });
        assert.equal(i, n);
        
        // End
        i = 0;
        tree.range(undefined, 4567).forEach(function(value, key) {
            assert.equal(key, i++);
        });
        assert.equal(i, 4568);
    });

    it('procedural-style traversal', function () {
        var i = 0;
        var x;
        for (x = tree.minimum(); x; x = x.next()) {
            assert.equal(x.key, i++);
        }
    });

    it('delete by node', function () {
        var tree2 = redblack.tree();
        var delete_indices = { 44 : true, 49 : true, 88 : true};
        var delete_objs = [];
        var special_obj;
        for (var i = 0; i < 100; i++) {
            obj = { key : i };
            if (delete_indices[i]) {
                delete_objs.push(obj);
            }
            obj.node = tree2.insert(obj.key, obj);
        }
        for (var x in delete_objs) {
            tree2.delete_node(delete_objs[x].node);
        }
        var i = 0;
        var x;
        for (x = tree2.minimum(); x; x = x.next()) {
            while (delete_indices[i]) { i++; }
            assert.equal(x.key, i++);
        }
    });

});