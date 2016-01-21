import {is_within_tag, get_tag_properties, find_tag} from '../src/child/expand_to_xml_node'
import * as assert from 'assert';
import fs = require('fs');

suite("Tests expand_to_xml_node", () => {
    test(" test_within_node_true ", () => {
        let result = is_within_tag("<input>", 2, 2);
        assert.equal(result.start, 0);
        assert.equal(result.end, 7);
    });

    test(" test_within_node_false1 ", () => {
        let result = is_within_tag(">input<", 2, 2);
        assert.equal(result, false);
    });
    test(" test_within_node_false2 ", () => {
        let result = is_within_tag("input", 2, 2);
        assert.equal(result, false);
    });
    test(" test_get_tag_name1 ", () => {
        let result = get_tag_properties("<input class='test'>");
        assert.equal(result["name"], "input");
        assert.equal(result["type"], "self_closing");
				});
    test(" test_get_tag_name2 ", () => {
        let result = get_tag_properties("< input class='test'>");
        assert.equal(result["name"], "input");
    });
    test(" test_get_tag_name3 ", () => {
        let result = get_tag_properties("<  input class='test'>");
        assert.equal(result["name"], "input");
    });
    test(" test_get_tag_name4 ", () => {
        let result = get_tag_properties("<input>");
        assert.equal(result["name"], "input");
    });
    test(" test_get_tag_name5 ", () => {
        let result = get_tag_properties("</input>");
        assert.equal(result["name"], "input");
        assert.equal(result["type"], "closing");
    });
    test(" test_get_tag_name6 ", () => {
        let result = get_tag_properties("<magic />");
        assert.equal(result["name"], "magic");
        assert.equal(result["type"], "self_closing");

    });
    test(" test_get_tag_name7 ", () => {
        let result = get_tag_properties("<div>");
        assert.equal(result["name"], "div");
        assert.equal(result["type"], "opening");
    });
    test(" test_find_closing_tag1 ", () => {
        let result = find_tag("<div>test</div></div>", "forward", "div");
        assert.equal(result.start, 15);
        assert.equal(result.end, 21);

    });
    test(" test_find_closing_tag2 ", () => {
        let result = find_tag("test</div>", "forward", "div");
        assert.equal(result.start, 4);
        assert.equal(result.end, 10);
    });
    test(" test_find_opening_tag1 ", () => {
        let result = find_tag("  <div><div>test</div>", "backward", "div");
        assert.equal(result.start, 2);
        assert.equal(result.end, 7);
    });
    test(" test_find_previous_open_tag1 ", () => {
        let result = find_tag("<div></div><div><a href='#'></a>", "backward");
        assert.equal(result.start, 11);
        assert.equal(result.end, 16);
        assert.equal(result["name"], "div");
    });
    test(" test_find_previous_open_tag2 ", () => {
        let result = find_tag("<div></div><div style='color: red;'><a href='#'></a>", "backward");
        assert.equal(result.start, 11);
        assert.equal(result.end, 36);
        assert.equal(result["name"], "div");
    });
    test(" test_find_previous_open_tag3 ", () => {
        let result = find_tag("<div><img />", "backward");
        assert.equal(result.start, 0);
        assert.equal(result.end, 5);
        assert.equal(result["name"], "div");
    });
    test(" test_find_previous_open_tag4 ", () => {
        let result = find_tag("<div><img>", "backward");
        assert.equal(result.start, 0);
        assert.equal(result.end, 5);
        assert.equal(result["name"], "div");
    });

});