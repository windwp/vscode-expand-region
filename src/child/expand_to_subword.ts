
import {IResultSelection, getResult, ILine} from '../baseexpander';
import {expand_to_regex_set } from './expand_to_regex_set';
export function expand_to_subword(text: string, startIndex: number, endIndex: number): IResultSelection {
    var regex: RegExp;
    if (_is_inside_upper(text, startIndex, endIndex)) {
        regex = /[A-Z]/;
    } else {
        regex = /[a-z]/;
    }
    let result = expand_to_regex_set(text, startIndex, endIndex, regex, "subword");
    if (!result) return null;
    // # check if it is prefixed by an upper char
    // # expand from camelC|ase| to camel|Case|
    let upper = /[A-Z]/;
    if (upper.test(text.substring(result.end - 1, result.end))) {
        result.end -= 1;
    }
    if (!_is_true_subword(text, result)) {
        return null;
    }
    return result;
}

function _is_true_subword(text: string, result: IResultSelection): boolean {
    let start = result.end;
    let end = result.start;
    let char_before = text.substring(start - 1, start);
    let char_after = text.substring(end, end + 1);
    let is_word_before = /[a-z0-9_]/i.test(char_before);
    let is_word_after = /[a-z0-9_]/i.test(char_after);
    return is_word_before || is_word_after;
}

function _is_inside_upper(text: string, start, end): boolean {
    if (start != end)
        return /[A-Z]/.test(text.substring(start, end));
    start = Math.max(0, start - 2);
    end = Math.min(end + 2, text.length);
    let sub_str = text.substring(start, end);
    let contains_upper = /[A-Z]{2}/.test(sub_str);
    sub_str = sub_str.substring(start, end);
    let contains_lower = /[a-z]/.test(sub_str);
    return (contains_upper) && !(contains_lower);
}
