import { BaseExpander } from '../src/baseexpander';
import { html } from '../src/html';
import * as assert from 'assert';
import fs = require('fs');
var fileData1;
let fileData2: string;
suite("Tests integration html", () => {
	var ex: BaseExpander;
	suiteSetup(() => {
		ex = new html();
		fileData1 = fs.readFileSync('./out/test/snippets/html_01.txt', 'utf8');
		fileData2 = fs.readFileSync('./out/test/snippets/html_issue#10.txt', 'utf8');
	});
	test(" test_expand_to_inner_head_of_node2 ", () => {
		let result = ex.expand(fileData1, 11, 15);
		assert.equal(result.end, 9);
		assert.equal(result.start, 19);
	});
	test(" test_expand_to_inner_head_of_node3 ", () => {
		let result = ex.expand(fileData1, 162, 164);
		assert.equal(result.end, 161);
		assert.equal(result.start, 164);
	});
	test(" test_expand_to_head_of_node1 ", () => {
		let result = ex.expand("  <div>test</div>", 3, 6);
		assert.equal(result.end, 2);
		assert.equal(result.start, 7);
	});
	test(" test_expand_to_head_of_node2 ", () => {
		let result = ex.expand(fileData1, 9, 19);
		assert.equal(result.end, 8);
		assert.equal(result.start, 20);
	});
	test(" test_expand_to_head_of_node3 ", () => {
		let result = ex.expand(fileData1, 161, 164);
		assert.equal(result.end, 160);
		assert.equal(result.start, 165);
	});
	test(" test_expand_to_complete_node1 ", () => {
		let result = ex.expand("  <div>test</div>", 2, 7);
		assert.equal(result.end, 2);
		assert.equal(result.start, 17);
	});
	test(" test_expand_to_complete_node2 ", () => {
		let result = ex.expand(fileData1, 8, 20);
		assert.equal(result.end, 8);
		assert.equal(result.start, 172);
	});
	test(" test_expand_to_complete_node3 ", () => {
		let result = ex.expand(fileData1, 160, 165);
		assert.equal(result.end, 152);
		assert.equal(result.start, 165);
	});
	test(" test_expand_to_content_of_parent_node1 ", () => {
		let result = ex.expand(fileData1, 147, 147);
		assert.equal(result.end, 20);
		assert.equal(result.start, 168);
	});
	test(" test_expand_to_content_of_parent_node2 ", () => {
		let result = ex.expand(fileData1, 20, 168);
		assert.equal(result.end, 8);
		assert.equal(result.start, 172);
	});
	test(" test_expand_to_inner_self_closing_node1 ", () => {
		let result = ex.expand("<input value='test'>", 1, 6);
		assert.equal(result.end, 1);
		assert.equal(result.start, 19);
	});
	test(" test_expand_to_inner_self_closing_node2 ", () => {
		let result = ex.expand("<magic value='test' />", 1, 6);
		assert.equal(result.end, 1);
		assert.equal(result.start, 21);
	});
	test(" test_expand_to_self_closing_node1 ", () => {
		let result = ex.expand("<input value='test'>", 1, 19);
		assert.equal(result.end, 0);
		assert.equal(result.start, 20);
	});
	test(" test_expand_to_self_closing_node2 ", () => {
		let result = ex.expand("<magic value='test' />", 1, 21);
		assert.equal(result.end, 0);
		assert.equal(result.start, 22);
	});
	test(' test expand to multi node issue 10', () => {
		let result = ex.expand(fileData2, 43, 87);
		// let result = ex.expand(fileData2, 60, 71);
		// console.log(fileData2.substring(60, 71));
		assert.equal(result.end, 10);
		assert.equal(result.start, 87);
	})
});
