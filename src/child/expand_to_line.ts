import {IResultSelection, getResult} from '../baseexpander';
export function expand_to_line(text: string, startIndex: number, endIndex: number): IResultSelection {
    const lineReg = /\n/;
    const spacesAndTabsRe = /(\s|\t)*/
    var newStartIndex = 0, newEndIndex = 0;
    let i = 0;
    let searchIndex = startIndex - 1;
    while (true) {
        if (searchIndex < 0) {
            newStartIndex = searchIndex + 1;
            break;
        }
        let char = text.substring(searchIndex, searchIndex + 1);
        if (lineReg.test(char)) {
            newStartIndex = searchIndex + 1;
            break;
        } else {
            searchIndex -= 1;
        }
        i++;
    }
    searchIndex = endIndex;
    while (true) {
        if (searchIndex > text.length - 1) {
            newEndIndex = searchIndex;
            break;
        }
        let char = text.substring(searchIndex, searchIndex + 1);
        if (lineReg.test(char)) {
            newEndIndex = searchIndex;
            break;
        } else {
            searchIndex += 1;
        }
    }
    //remove blank space in top
    var s = text.substring(newStartIndex, newEndIndex);
    var r = spacesAndTabsRe.exec(s);
    if (r && r[0].length <= startIndex) {
        newStartIndex += r[0].length;
    }
    if (startIndex == newStartIndex && endIndex == newEndIndex) {
        return null;
    }
    return getResult(newStartIndex, newEndIndex, text, 'line');

}