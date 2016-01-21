import {trim} from '../src/baseexpander'
import * as assert from 'assert';
import fs = require('fs');
var fileData1;
var fileData2;
suite("Tests trim", () => {
    suiteSetup(() => {
        fileData1 = fs.readFileSync('./out/test/snippets/trim_01.txt', 'utf8');
        fileData2 = fs.readFileSync('./out/test/snippets/trim_02.txt', 'utf8');
    });

    test(" test_1", () => {
        let result = trim("  aa  ");
        assert.equal(result.start, 2)
        assert.equal(result.end, 4)

    });
    test(" test_2", () => {
        let result = trim("  'a a'  ");
        assert.equal(result.start, 2)
        assert.equal(result.end, 7)

    });
    test(" test_3", () => {
        let result = trim(fileData1);
        assert.equal(result.start, 2)
        assert.equal(result.end, 11)

    });
    test(" test_4", () => {
        let result = trim(" foo.bar['property'].getX()");
        assert.equal(result.start, 1)
        assert.equal(result.end, 27)

    });
    test(" test_5", () => {
        let result = trim(fileData2);
        assert.equal(result.start, 2)
        assert.equal(result.end, 49)
    })
});