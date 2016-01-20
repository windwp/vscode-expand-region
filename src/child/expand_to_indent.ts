import {IResultSelection, ILine, getResult, get_line} from '../baseexpander';
const indentReg = /^(\s*)/;

function empty_line(text: string, line: ILine): boolean {
    return text.substring(line.start, line.end).trim() === '';
}
function get_indent(text: string, line: ILine): number {
    let line_str = text.substring(line.start, line.end)
    let m = line_str.match(indentReg);
    console.log(m);
    if (m) {
        return m[0].length;
    }
    return 0;
}

export function expand_to_indent(text: string, startIndex: number, endIndex: number): IResultSelection {
    let line = get_line(text, startIndex, endIndex);
    let indent = get_indent(text, line);
    let start = line.start;
    let end = line.end;
    let before_line = line;
    while (true) {
        let pos = before_line.start - 1;
        if (pos <= 0) break;
        before_line = get_line(text, pos, pos);
        let before_indent = get_indent(text, before_line);
        //done if the line has a lower indent
        if (!(indent <= before_indent) && !empty_line(text, before_line)) {
            break;
        }
        if (!empty_line(text, before_line) && indent == before_indent) {
            start = before_line.start;
        }
    }
    let after_line = line;
    while (true) {
        //get the line after_line
        let pos = after_line.end + 1;
        if (pos >= text.length) break;
        after_line = get_line(text, pos, pos);
        let after_indent = get_indent(text, after_line);
        //done if the line has a lower indent
        if (!(indent <= after_indent) && !empty_line(text, after_line)) {
            break;
        }
        //move the end
        if (!empty_line(text, after_line)) {
            end = after_line.end;
        }
    }
    return getResult(start, end, text, "indent");
}