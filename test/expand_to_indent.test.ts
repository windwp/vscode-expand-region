import {expand_to_indent} from '../src/child/expand_to_indent'
import * as assert from 'assert';
import fs = require('fs');
// Defines a Mocha test suite to group tests of similar kind together
var fileData1;
var fileData2;

suite("Tests expand_to_indent", () => {
    suiteSetup(() => {
        fileData1 = fs.readFileSync('./out/test/snippets/line_01.txt', 'utf8');
        fileData2 = fs.readFileSync('./out/test/snippets/line_02.txt', 'utf8');
    });
    // Defines a Mocha unit test
});
