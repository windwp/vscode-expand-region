import {BaseExpander} from '../src/baseexpander';
import {javascript} from '../src/javascript';
import * as assert from 'assert';
import fs = require('fs');
var fileData1;
var fileData2;
var fileData3;
var fileData4;
suite("Tests integration javascript", () => {
    var ex: BaseExpander;
    suiteSetup(() => {
        ex = new javascript();
        fileData1 = fs.readFileSync('./out/test/snippets/integration_01.txt', 'utf8');
        fileData2 = fs.readFileSync('./out/test/snippets/integration_02.txt', 'utf8');
        fileData3 = fs.readFileSync('./out/test/snippets/integration_03.txt', 'utf8');
        fileData4 = fs.readFileSync('./out/test/snippets/integration_04.txt', 'utf8');
    });
    test(" test_subword", () => {
        let result = ex.expand(fileData1, 7, 7);
        assert.equal(result.end, 6);
        assert.equal(result.start, 9);
        assert.equal(result.selectionText, "bar");
        // assert.equal(result["type"], "subword");
        //assert.equal(result["expand_stack"], ["subword"]);

    });
    test(" test_word", () => {
        let result = ex.expand(fileData1, 6, 9);
        assert.equal(result.end, 2);
        assert.equal(result.start, 9);
        assert.equal(result.selectionText, "foo_bar");
        // assert.equal(result["type"], "word")
        // assert.equal(result["expand_stack"], ["subword", "word"])

    });
    test(" test_quotes_inner", () => {
        let result = ex.expand(fileData1, 2, 9);
        assert.equal(result.end, 2);
        assert.equal(result.start, 17);
        assert.equal(result.selectionText, "foo_bar foo bar");
        //assert.equal(result["type"], "quotes")
        //assert.equal(result["expand_stack"], ["subword", "word", "quotes"])

    });
    test(" test_quotes_outer", () => {
        let result = ex.expand(fileData1, 2, 17);
        assert.equal(result.end, 1);
        assert.equal(result.start, 18);
        assert.equal(result.selectionText, "\"foo_bar foo bar\"");
        //assert.equal(result["type"], "quotes")
        // assert.equal(result["expand_stack"], ["subword", "word", "quotes"])

    });
    test(" test_symbol_inner", () => {
        let result = ex.expand(fileData1, 1, 10);
        assert.equal(result.end, 1);
        assert.equal(result.start, 24);
        assert.equal(result.selectionText, "\"foo_bar foo bar\" + \"x\"");
        //assert.equal(result["type"], "semantic_unit")
        // assert.equal(result["expand_stack"], ["subword", "word", "quotes", "semantic_unit"])
    });
    test("test_dont_expand_to_dots", () => {
        let result = ex.expand(fileData2, 2, 5);
        assert.equal(result.end, 1);
        assert.equal(result.start, 10);
        assert.equal(result.selectionText, " foo.bar ");
        //assert.equal(result["type"], "quotes")
        //assert.equal(result["expand_stack"], ["subword", "word", "quotes"])
    });
    //   # test(" tst_expand_to_line", () => {
    //   #  let result = ex.expand(fileData3, 30, 35);
    //   #   assert.equal(result.startIndex, 28)
    //   #   assert.equal(result.endIndex, 37)
    //   #   assert.equal(result.selectionText, "foo: true")
    //   #   assert.equal(result["type"], "line")
    //   #   assert.equal(result["expand_stack"], ["subword", "word", "quotes", "semantic_unit", "symbols", "line"])

    test("test_expand_to_symbol_from_line", () => {
        let result = ex.expand(fileData3, 28, 37);
        assert.equal(result.end, 23);
        assert.equal(result.start, 40);
        assert.equal(result.selectionText, "\n    foo: true\n  ");
        //assert.equal(result["type"], "symbol")
        // assert.equal(result["expand_stack"], ["semantic_unit", "symbols"])
    });
    test("test_skip_some_because_of_linebreak", () => {
        let result = ex.expand(fileData3, 22, 41);
        assert.equal(result.end, 15);
        assert.equal(result.start, 41);
        assert.equal(result.selectionText, "return {\n    foo: true\n  }")
        // assert.equal(result["type"], "semantic_unit")
        //assert.equal(result["expand_stack"], ["semantic_unit"])
    });
    test("test_skip_some_because_of_linebreak_2", () => {
        let result = ex.expand(fileData3, 15, 41);
        assert.equal(result.end, 12);
        assert.equal(result.start, 42);
        //assert.equal(result["type"], "symbol")
        //assert.equal(result["expand_stack"], ["semantic_unit", "symbols"])
    });
    test("test_symbols_in_text_01", () => {
        let result = ex.expand(fileData4, 35, 42);
        assert.equal(result.end, 30);
        assert.equal(result.start, 42);
        // assert.equal(result["type"], "semantic_unit")
        //assert.equal(result["expand_stack"], ["semantic_unit"])
    });
    test("test_symbols_in_text_02", () => {
        let result = ex.expand(fileData4, 30, 42);
        assert.equal(result.end, 29);
        assert.equal(result.start, 43);
        //assert.equal(result["type"], "symbol")
        //assert.equal(result["expand_stack"], ["semantic_unit", "symbols"])
    });
    test("test_symbols_in_text_03", () => {
        let result = ex.expand(fileData4, 29, 43);
        assert.equal(result.end, 29);
        assert.equal(result.start, 46);
        //assert.equal(result["type"], "semantic_unit")
        //assert.equal(result["expand_stack"], ["semantic_unit"])
    });
    test("test_symbols_in_text_04", () => {
        let result = ex.expand(fileData4, 29, 46);
        assert.equal(result.end, 28);
        assert.equal(result.start, 47);
        //assert.equal(result["type"], "symbol")
        //assert.equal(result["expand_stack"], ["semantic_unit", "symbols"])
    });
    test("test_symbols_in_text_05", () => {
        let result = ex.expand(fileData4, 28, 47);
        assert.equal(result.end, 23);
        assert.equal(result.start, 55);
        //assert.equal(result["type"], "quotes")
        // assert.equal(result["expand_stack"], ["subword", "word", "quotes"])
    });

});
