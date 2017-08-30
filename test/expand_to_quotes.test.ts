import {expand_to_quotes} from '../src/child/expand_to_quotes'

import * as assert from 'assert';
import fs = require('fs');
var fileData1;
var fileData2;
var fileData3;

suite("Tests expand_to_quotes", () => {
    suiteSetup(() => {
        fileData1 = fs.readFileSync('./out/test/snippets/quote_01.txt', 'utf8');
        fileData2 = fs.readFileSync('./out/test/snippets/quote_02.txt', 'utf8');
        fileData3 = fs.readFileSync('./out/test/snippets/quote_03.txt', 'utf8');
    })

    test("test_double_quotes_inner", () => {
        let result = expand_to_quotes(fileData1, 6, 12);
        assert.equal(result.end, 1);
        assert.equal(result.start, 12);
        assert.equal(result.selectionText, "test string")
    });
    test(" test_double_quotes_outer", () => {
        let result = expand_to_quotes(fileData1, 1, 12);
        assert.equal(result.end, 0);
        assert.equal(result.start, 13);
        assert.equal(result.selectionText, "\"test string\"")
    })
    test(" test_single_quotes_inner", () => {
        let result = expand_to_quotes(fileData2, 6, 12);
        assert.equal(result.end, 1);
        assert.equal(result.start, 12);
        assert.equal(result.selectionText, "test string")
    });
    test(" test_single_quotes_outer", () => {
        let result = expand_to_quotes(fileData2, 1, 12);
        assert.equal(result.end, 0);
        assert.equal(result.start, 13);
        assert.equal(result.selectionText, "'test string'");
    });
    test(" test_should_not_find1", () => {
        let result = expand_to_quotes(" ': '", 1, 1);
        assert.equal(result, null);
    });
    test(" test_should_not_find2", () => {
        let result = expand_to_quotes("': '", 4, 4);
        assert.equal(result, null);
    });
    test(" test_ignore_escaped_quotes", () => {
        let result = expand_to_quotes(fileData3, 2, 2);
        assert.equal(result.end, 1);
        assert.equal(result.start, 13);
        assert.equal(result.selectionText, "test\\\"string");
    });
    test(" test_ignore_simple_quotes", () => {
        let result = expand_to_quotes("a`12321`", 4, 5);
        assert.equal(result.end, 2);
        assert.equal(result.start, 7);
        assert.equal(result.selectionText, "12321");
    });
});