import {expand_to_symbols} from '../src/child/expand_to_symbols'

import * as assert from 'assert';
import fs = require('fs');
// Defines a Mocha test suite to group tests of similar kind together
var fileData1;
var fileData2;
var fileData3;
suite("Tests expand_to_symbols", () => {
    suiteSetup(() => {
        
        fileData1 = fs.readFileSync('./out/test/snippets/symbol_01.txt', 'utf8');
        fileData2 = fs.readFileSync('./out/test/snippets/symbol_02.txt', 'utf8');
        fileData3 = fs.readFileSync('./out/test/snippets/symbol_03.txt', 'utf8');
    });
    test(" test_symbol_inner ", () => {
        let result = expand_to_symbols(fileData1, 7, 10);
        assert.equal(result.startIndex, 1);
        assert.equal(result.endIndex, 10);
        assert.equal(result.selectionText, "foo - bar");
    });

    test(" test_symbol_outer ", () => {
        let result = expand_to_symbols(fileData1, 1, 10);
        assert.equal(result.startIndex, 0);
        assert.equal(result.endIndex, 11);
        assert.equal(result.selectionText, "(foo - bar)");
    });
    test(" test_look_back_dont_hang ", () => {
        let result = expand_to_symbols("   ", 1, 2);
        assert.equal(result, null);
    });
    test(" test_look_ahead_dont_hang ", () => {
        let result = expand_to_symbols("(   ", 2, 2);
        assert.equal(result, null);
    });
    test(" test_fix_look_back ", () => {
        let result = expand_to_symbols(fileData2, 32, 32);
        assert.equal(result.startIndex, 12);
        assert.equal(result.endIndex, 35);
        assert.equal(result.selectionText, "foo.indexOf('bar') > -1");
    });
    test(" test_respect_symbols_in_selection1 ", () => {
        let result = expand_to_symbols("(a['value'])", 6, 11);
        assert.equal(result.startIndex, 1);
        assert.equal(result.endIndex, 11);
        assert.equal(result.selectionText, "a['value']");
    });
    test(" test_respect_symbols_in_selection ", () => {
        let result = expand_to_symbols(fileData3, 10, 61);
        assert.equal(result.startIndex, 5);
        assert.equal(result.endIndex, 66);
        // assert.equal(result.selectionText, "foo.indexOf('bar') > -1")
    });
    test(" test_ignore_symbols_in_texts ", () => {
        let result = expand_to_symbols("{'a(a'+bb+'c)c'}", 8, 8);
        assert.equal(result.startIndex, 1);
        assert.equal(result.endIndex, 15);
        assert.equal(result["type"], "symbol");
    });
});