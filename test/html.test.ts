import {BaseExpander} from '../src/baseexpander';
import {html} from '../src/html';
import * as assert from 'assert';
import fs = require('fs');
// Defines a Mocha test suite to group tests of similar kind together
var fileData1;

suite("Tests integration html", () => {
    var ex: BaseExpander;
    suiteSetup(() => {
        ex = new html();
        fileData1 = fs.readFileSync('./out/test/snippets/html_01.txt', 'utf8');
    });
	test(" test_expand_to_inner_head_of_node2 ", () => {
		let result = ex.expand(fileData1, 11, 15);
		assert.equal(result.startIndex, 9);
		assert.equal(result.endIndex, 19);
	});
	test(" test_expand_to_inner_head_of_node3 ", () => {
		let result = ex.expand(fileData1, 162, 164);
		assert.equal(result.startIndex, 161);
		assert.equal(result.endIndex, 164);
	});
	test(" test_expand_to_head_of_node1 ", () => {
		let result = ex.expand("  <div>test</div>", 3, 6);
		assert.equal(result.startIndex, 2);
		assert.equal(result.endIndex, 7);
	});
	test(" test_expand_to_head_of_node2 ", () => {
		let result = ex.expand(fileData1, 9, 19);
		assert.equal(result.startIndex, 8);
		assert.equal(result.endIndex, 20);
	});
	test(" test_expand_to_head_of_node3 ", () => {
		let result = ex.expand(fileData1, 161, 164);
		assert.equal(result.startIndex, 160);
		assert.equal(result.endIndex, 165);
	});
	test(" test_expand_to_complete_node1 ", () => {
		let result = ex.expand("  <div>test</div>", 2, 7);
		assert.equal(result.startIndex, 2);
		assert.equal(result.endIndex, 17);
	});
	test(" test_expand_to_complete_node2 ", () => {
		let result = ex.expand(fileData1, 8, 20);
		assert.equal(result.startIndex, 8);
		assert.equal(result.endIndex, 172);
	});
	test(" test_expand_to_complete_node3 ", () => {
		let result = ex.expand(fileData1, 160, 165);
		assert.equal(result.startIndex, 152);
		assert.equal(result.endIndex, 165);
	});
	test(" test_expand_to_content_of_parent_node1 ", () => {
		let result = ex.expand(fileData1, 147, 147);
		assert.equal(result.startIndex, 20);
		assert.equal(result.endIndex, 168);
	});
	test(" test_expand_to_content_of_parent_node2 ", () => {
		let result = ex.expand(fileData1, 20, 168);
		assert.equal(result.startIndex, 8);
		assert.equal(result.endIndex, 172);
	});
	test(" test_expand_to_inner_self_closing_node1 ", () => {
		let result = ex.expand("<input value='test'>", 1, 6);
		assert.equal(result.startIndex, 1);
		assert.equal(result.endIndex, 19);
	});
	test(" test_expand_to_inner_self_closing_node2 ", () => {
		let result = ex.expand("<magic value='test' />", 1, 6);
		assert.equal(result.startIndex, 1);
		assert.equal(result.endIndex, 21);
	});
	test(" test_expand_to_self_closing_node1 ", () => {
		let result = ex.expand("<input value='test'>", 1, 19);
		assert.equal(result.startIndex, 0);
		assert.equal(result.endIndex, 20);
	});
	test(" test_expand_to_self_closing_node2 ", () => {
		let result = ex.expand("<magic value='test' />", 1, 21);
		assert.equal(result.startIndex, 0);
		assert.equal(result.endIndex, 22);
	});
});