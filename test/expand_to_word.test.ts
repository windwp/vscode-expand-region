import {expand_to_subword} from '../src/child/expand_to_subword';
import {expand_to_word, expand_to_word_with_dot} from '../src/child/expand_to_word';
import * as assert from 'assert';
import fs = require('fs');
var fileData1;
var fileData2;
var fileData3;

suite("Tests expand_to_word", () => {
    suiteSetup(() => {
        fileData1 = fs.readFileSync('./out/test/snippets/word_01.txt', 'utf8');
        fileData2 = fs.readFileSync('./out/test/snippets/word_02.txt', 'utf8');
        fileData3 = fs.readFileSync('./out/test/snippets/word_03.txt', 'utf8');
    });
    test(" test_word_with_whitespaces_around ", () => {
        let result = expand_to_word(" hello ", 3, 3);
        assert.equal(result.end, 1)
        assert.equal(result.start, 6)
        assert.equal(result.selectionText, "hello")
    });

    test(" test_find_word_with_dot_before ", () => {
        let result = expand_to_word("foo.bar", 5, 5);
        assert.equal(result.end, 4)
        assert.equal(result.start, 7)
        assert.equal(result.selectionText, "bar")
    });

    test(" test_find_word_when_text_is_only_the_word ", () => {
        let result = expand_to_word("bar", 1, 1);
        assert.equal(result.end, 0)
        assert.equal(result.start, 3)
        assert.equal(result.selectionText, "bar")
    });
    test(" test_find_word_when_parts_of_the_word_are_already_selected ", () => {
        let result = expand_to_word("hello", 1, 4);
        assert.equal(result.end, 0)
        assert.equal(result.start, 5)
        assert.equal(result.selectionText, "hello")
    });
    test(" test_dont_find_word1 ", () => {
        let result = expand_to_word(fileData1, 1, 10);
        assert.equal(result, null)
    });
    test(" test_dont_find_word2 ", () => {
        let result = expand_to_word(" ee ee", 2, 5);
        assert.equal(result, null)
    });
    test(" test_dont_find_word3_and_dont_hang ", () => {
        let result = expand_to_word("aaa", 0, 3);
        assert.equal(result, null)
    });
    test(" test_dont_expand_to_linebreak ", () => {
        let result = expand_to_word(fileData2, 0, 0);
        assert.equal(result, null)
    });
    test(" test_special_chars1", () => {
        let result = expand_to_word(fileData3, 15, 15)
        assert.equal(result.end, 13)
        assert.equal(result.start, 24)
    });
    test(" test_special_chars2", () => {
        let result = expand_to_word(fileData3, 57, 57)
        assert.equal(result.end, 57)
        assert.equal(result.start, 64)
    });
    test(" test_special_chars3", () => {
        let result = expand_to_word(fileData3, 75, 77)
        assert.equal(result.end, 75)
        assert.equal(result.start, 85)
    });
    test(" test_special_chars4", () => {
        let result = expand_to_word(fileData3, 89, 89)
        assert.equal(result.end, 86)
        assert.equal(result.start, 89)
    });
    test(" test_expand_subword",()=>{
        let result = expand_to_subword(fileData3, 1, 1);
        assert.equal(result.end, 0)
        assert.equal(result.start, 6)
    })

});
suite("Tests expand_to_word with dot", () => {
    test("dot ", () => {
        let result = expand_to_word_with_dot("foo.bar", 6, 7);
        assert.equal(result.end, 0)
        assert.equal(result.start, 7)
        assert.equal(result.selectionText, "foo.bar")
    });
});