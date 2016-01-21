import {expand_to_line} from '../src/child/expand_to_line'
import * as assert from 'assert';
import fs = require('fs');
var fileData1;
var fileData2;

suite("Tests expand_to_line", () => {
    suiteSetup(() => {
        fileData1 = fs.readFileSync('./out/test/snippets/line_01.txt', 'utf8');
        fileData2 = fs.readFileSync('./out/test/snippets/line_02.txt', 'utf8');
    });
    // Defines a Mocha unit test
    test("expand_to_line space begin", () => {
        var result = expand_to_line(fileData1, 10, 16);
        assert.equal(result.selectionText, 'is it me');
        assert.equal(result.end, 10);
        assert.equal(result.start, 18);
    });
    test('test_existing_line_selection', () => {
        var result = expand_to_line(fileData1, 10, 18);
        assert.equal(null, result);
    });
    test("test_with_no_spaces_or_tabs_at_beginning", () => {
        var result = expand_to_line(fileData2, 6, 12);
        assert.equal(result.selectionText, 'is it me');
        assert.equal(result.end, 6);
        assert.equal(result.start, 14);
    });
    test("test_with_indention", () => {
        var result = expand_to_line(" aa", 0, 0)
        assert.equal(result.selectionText, ' aa')
        assert.equal(result.end, 0)
        assert.equal(result.start, 3)
    })

    test("test_without_indention", () => {
        var result = expand_to_line(" aa", 1, 1)
        assert.equal(result.selectionText, 'aa')
        assert.equal(result.end, 1)
        assert.equal(result.start, 3)
    })

    test("test_with_indention2", () => {
        var result = expand_to_line("  aa", 1, 1)
        assert.equal(result.selectionText, "  aa")
        assert.equal(result.end, 0)
        assert.equal(result.start, 4)
    })
})
