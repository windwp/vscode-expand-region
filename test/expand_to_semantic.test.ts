import {expand_to_semantic_unit} from '../src/child/expand_to_semantic_unit'
import * as assert from 'assert';
import fs = require('fs');
var fileData1;
var fileData2;
var fileData3;
var fileData4;
var fileData5;
var fileData6;
var fileData7;
var fileData8;
var fileData9;

suite("Tests expand_to_semantic_unit", () => {
    suiteSetup(() => {
        fileData1 = fs.readFileSync('./out/test/snippets/semantic_unit_01.txt', 'utf8');
        fileData2 = fs.readFileSync('./out/test/snippets/semantic_unit_02.txt', 'utf8');
        fileData3 = fs.readFileSync('./out/test/snippets/semantic_unit_03.txt', 'utf8');
        fileData4 = fs.readFileSync('./out/test/snippets/semantic_unit_04.txt', 'utf8');
        fileData5 = fs.readFileSync('./out/test/snippets/semantic_unit_05.txt', 'utf8');
        fileData6 = fs.readFileSync('./out/test/snippets/semantic_unit_06.txt', 'utf8');
        fileData7 = fs.readFileSync('./out/test/snippets/semantic_unit_07.txt', 'utf8');
        fileData8 = fs.readFileSync('./out/test/snippets/semantic_unit_08.txt', 'utf8');
        fileData9 = fs.readFileSync('./out/test/snippets/semantic_unit_09.txt', 'utf8');
    })
    test(" test_1", () => {
        let result = expand_to_semantic_unit(fileData1, 13, 13);
        assert.equal(result.selectionText, "foo.bar['property'].getX()")
        assert.equal(result.end, 7)
        assert.equal(result.start, 33)

    });
    test(" test_2", () => {
        let result = expand_to_semantic_unit(fileData2, 13, 13);
        assert.equal(result.selectionText, "foo.bar['prop,erty'].getX()")
        assert.equal(result.end, 7)
        assert.equal(result.start, 34)
    });
    test(" test_3", () => {
        let result = expand_to_semantic_unit(fileData3, 13, 13);
        assert.equal(result.selectionText, "foo.bar['property'].getX()")
        assert.equal(result.end, 13)
        assert.equal(result.start, 39)
    });
    test(" test_4", () => {
        let result = expand_to_semantic_unit(fileData4, 11, 11);
        assert.equal(result.end, 7)
        assert.equal(result.start, 51)
    });
    test(" test_5", () => {
        let result = expand_to_semantic_unit(fileData4, 6, 52);
        assert.equal(result.end, 2)
        assert.equal(result.start, 52)
    });
    test(" test_6", () => {
        let result = expand_to_semantic_unit(fileData5, 15, 15);
        assert.equal(result.selectionText, "o.getData(\"bar\")")
        assert.equal(result.end, 8)
        assert.equal(result.start, 24)
    });
    test(" test_7", () => {
        let result = expand_to_semantic_unit("if (foo.get('a') && bar.get('b')) {", 6, 6);
        assert.equal(result.selectionText, "foo.get('a')")
        assert.equal(result.end, 4)
        assert.equal(result.start, 16)
    });
    test(" test_8", () => {
        let result = expand_to_semantic_unit("if (foo.get('a') || bar.get('b')) {", 6, 6);
        assert.equal(result.selectionText, "foo.get('a')")
        assert.equal(result.end, 4)
        assert.equal(result.start, 16)
    });
    test(" test_9", () => {
        let result = expand_to_semantic_unit(fileData9, 0, 14);
        assert.equal(result.selectionText, "if(foo || bar) {\n}")
        assert.equal(result.end, 0)
        assert.equal(result.start, 18)
    });
    test(" test_should_none", () => {
        let result = expand_to_semantic_unit("aaa", 1, 1);
        assert.equal(result, null)
    });
    test(" test_should_none_2", () => {
        let result = expand_to_semantic_unit(fileData6, 6, 23);
        assert.equal(result, null)
    });
    test(" test_should_none_3", () => {
        let result = expand_to_semantic_unit(fileData7, 17, 33);
        assert.equal(result, null)
    });
    test(" test_should_none_4", () => {
        let result = expand_to_semantic_unit(fileData8, 16, 16);
        assert.equal(result, null)
    });
    test(" test_should_none_5", () => {
        let result = expand_to_semantic_unit("aa || bb", 3, 3);
        assert.equal(result, null)
    });

})