import {IResultSelection, getResult} from '../baseexpander';
export function expand_to_regex_set(text: string, startIndex: number, endIndex: number, regex: RegExp, type: string): IResultSelection {
    //add modifier
    const globalRegex = new RegExp(regex.source, "g");
    //if{there is a selection (and not only a blinking cursor)
    if (startIndex != endIndex) {
        let selection = text.substring(startIndex, endIndex)
        // make sure, that every character of the selection meets the regex rules,
        // if not return here
        if ((selection.match(globalRegex) || []).length != selection.length) {
            return null;
        }
    }
    // look back
    let searchIndex = startIndex - 1;
    var newStartIndex = 0, newEndIndex = 0;
    while (true) {
        // begin of text is reached
        if (searchIndex < 0) {
            newStartIndex = searchIndex + 1
            break
        }
        let char = text.substring(searchIndex, searchIndex + 1)
        // character found, that does not fit into the search set 
        if (!regex.test(char)) {
            newStartIndex = searchIndex + 1
            break
        }
        else {
            searchIndex -= 1
        }
    }
    // look forward
    searchIndex = endIndex;
    while (true) {
        // end of text reached
        if (searchIndex > text.length - 1) {
            newEndIndex = searchIndex
            break
        }
        let char = text.substring(searchIndex, searchIndex + 1)
        // character found, that does not fit into the search set 
        if (!regex.test(char)) {
            newEndIndex = searchIndex
            break
        }
        else {
            searchIndex += 1
        }
    }
    if (startIndex == newStartIndex && endIndex == newEndIndex) return null;
    return getResult(newStartIndex, newEndIndex, text, type);
}