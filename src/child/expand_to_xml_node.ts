import { IResultSelection, getResult } from '../baseexpander';
export function expand_to_xml_node(text: string, start: number, end: number): IResultSelection {
    let tag_properties = get_tag_properties(text.substring(start, end));
    //if we are selecting a tag, then select the matching tag
    let tag_name;
    if (tag_properties) {
        tag_name = tag_properties["name"];
        if (tag_properties["type"] == "closing") {
            let stringStartToTagStart = text.substring(0, start);

            let openingTagPosition = find_tag(stringStartToTagStart, "backward", tag_name);
            if (openingTagPosition) {
                return getResult(openingTagPosition["start"], end, text, "complete_node");
            }
        }
        //if it's a opening tag, find opening tag and return positions
        else if (tag_properties["type"] == "opening") {
            // check this tag already have closing tag inside
            if (!is_text_close_tag(text.substring(start, end), tag_name)) {
                let stringNodeEndToStringEnd = text.substring(end, text.length);
                let closingTagPosition = find_tag(stringNodeEndToStringEnd, "forward", tag_name);
                if (closingTagPosition) {
                    return getResult(start, end + closingTagPosition["end"], text, "complete_node");
                }
            }
        }
        //else it's self closing and there is no matching tag
    }
    //check if current selection is within a tag, if it is expand to the tag
    //first expand to inside the tag and then to the whole tag
    let is_within_tag_result = is_within_tag(text, start, end);
    if (is_within_tag_result) {
        let inner_start = is_within_tag_result["start"] + 1;
        let inner_end = is_within_tag_result["end"] - 1;
        if (start == inner_start && end == inner_end)
            return getResult(is_within_tag_result["start"], is_within_tag_result["end"], text, "complete_node");
        else
            return getResult(inner_start, inner_end, text, "inner_node");
    }
    //expand selection to the "parent" node of the current selection
    let stringStartToSelectionStart = text.substring(0, start);
    let parent_opening_tag = find_tag(stringStartToSelectionStart, "backward");
    let newStart = 0, newEnd = 0;
    if (parent_opening_tag) {
        //find closing tag
        let stringNodeEndToStringEnd = text.substring(parent_opening_tag["end"], text.length);
        let closingTagPosition = find_tag(stringNodeEndToStringEnd, "forward", parent_opening_tag["name"]);
        if (closingTagPosition) {
            //set positions to content of node, w / o the node tags
            newStart = parent_opening_tag["end"];
            newEnd = parent_opening_tag["end"] + closingTagPosition["start"];
        }
        //if this is the current selection, set positions to content of node including start and end tags
        if (newStart == start && newEnd == end) {
            newStart = parent_opening_tag["start"];
            newEnd = parent_opening_tag["end"] + closingTagPosition["end"];
        }
        return getResult(newStart, newEnd, text, "parent_node_content");
    }
    return null;
}
export function is_within_tag(text: string, startIndex, endIndex): any {
    let openingRe = /</;
    let closingRe = />/;

    //// look back
    let searchIndex = startIndex - 1;
    let newStartIndex = 0;
    while (true) {
        ////begin of text is reached, let's return here
        if (searchIndex < 0) {
            return false;
        }
        let char = text.substring(searchIndex, searchIndex + 1);
        //# tag start found!
        if (openingRe.test(char)) {
            newStartIndex = searchIndex;
            break;
        }
        //# closing tag found, let's return here
        if (closingRe.test(char)) {
            return false;
        }
        searchIndex -= 1;
    }
    //# look forward
    searchIndex = endIndex;
    while (true) {
        //# end of text is reached, let's return here
        if (searchIndex > text.length - 1) {
            return false;
        }
        let char = text.substring(searchIndex, searchIndex + 1);
        //# tag start found!
        if (closingRe.test(char)) {
            return { "start": newStartIndex, "end": searchIndex + 1 };
        }
        //# closing tag found, let's return here
        if (openingRe.test(char)) {
            return false;
        }
        searchIndex += 1;
    }
}
export function get_tag_properties(text: string): any {
    var regex = /<\s*(\/?)\s*([^\s\/]*)\s*(?:.*?)(\/?)\s*>/;
    var tag_name, tag_type;
    let void_elements = ["area", "base", "br", "col", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr"];
    var result = regex.exec(text);
    if (!result) return null;
    tag_name = result[2];
    if (result[1]) {
        tag_type = "closing";
    }
    else if (result[3]) {
        tag_type = "self_closing";
    }
    else if (void_elements.indexOf(tag_name) !== -1) {
        tag_type = "self_closing";
    }
    else {
        tag_type = "opening";
    }

    return { "name": tag_name, "type": tag_type };
}
export function find_tag(text: string, direction: string, tag_name = ""): any {
    // search for opening and closing tag with a tag_name.If tag_name = "", search
    // for all tags.
    let regexString = "<\s*" + tag_name + ".*?>|<\/\s*" + tag_name + "\s*>";
    let regex = new RegExp(regexString, 'g');
    // direction == "forward" implies that we are looking for closing tags (and
    // vice versa
    let target_tag_type = (direction == "forward" ? "closing" : "opening");
    // set counterpart
    let target_tag_type_counterpart = (direction == "forward" ? "opening" : "closing");

    // found tags will be added/ removed from the stack to eliminate complete nodes
    // (opening tag + closing tag).
    let symbolStack = [];
    // since regex can't run backwards, we reverse the result
    var tArr = [];
    var r: any;
    while ((r = regex.exec(text)) !== null) {
        let tag_name = r[0];
        let start = r.index;
        let end = regex.lastIndex;
        tArr.push({ name: tag_name, start: start, end: end });
    }
    if (direction == "backward") {
        tArr.reverse();
    }
    var result = null;
    tArr.forEach(value => {
        let tag_string = <string>value.name;
        // ignore comments
        if (result) {
            return;
        }
        if (tag_string.indexOf("<!--") === 0 || tag_string.indexOf("<![") === 0) {
            return;
        }
        let tag_type = get_tag_properties(tag_string)["type"];
        if (tag_type == target_tag_type) {
            if (symbolStack.length === 0) {
                result = { "start": value.start, "end": value.end, "name": get_tag_properties(tag_string)["name"] };
                return;
            }
            symbolStack.pop();
        }
        else if (tag_type == target_tag_type_counterpart) {
            symbolStack.push(tag_type);
        }
    });
    return result;
}

// check is text string have xml node closing ex:<div>aaa</div>
export function is_text_close_tag(text: string, tag_name = ""): boolean {
    // search for opening and closing tag with a tag_name.If tag_name = "", search
    // for all tags.
    let regexString = "<\s*" + tag_name + ".*?>|<\/\s*" + tag_name + "\s*>";
    let regex = new RegExp(regexString, 'g');
    // direction == "forward" implies that we are looking for closing tags (and
    // vice versa
    let target_tag_type = "closing";
    // set counterpart
    let target_tag_type_counterpart = "opening";

    // found tags will be added/ removed from the stack to eliminate complete nodes
    // (opening tag + closing tag).
    let symbolStack = [];
    // since regex can't run backwards, we reverse the result
    var tArr = [];
    var r: any;
    while ((r = regex.exec(text)) !== null) {
        let tag_name = r[0];
        let start = r.index;
        let end = regex.lastIndex;
        tArr.push({ name: tag_name, start: start, end: end });
    }
    var result = null;
    tArr.forEach(value => {
        let tag_string = <string>value.name;
        // ignore comments
        if (result) {
            return;
        }
        if (tag_string.indexOf("<!--") === 0 || tag_string.indexOf("<![") === 0) {
            return;
        }
        let tag_type = get_tag_properties(tag_string)["type"];
        if (tag_type == target_tag_type) {
            symbolStack.pop();
        }
        else if (tag_type == target_tag_type_counterpart) {
            symbolStack.push(tag_type);
        }
    });
    return symbolStack.length == 0;
}