
import {IResultSelection, getResult} from '../baseexpander';
import {expand_to_regex_set} from './expand_to_regex_set';
export function expand_to_word(text: string, startIndex: number, endIndex: number): IResultSelection {
    const regex = /[\u00BF-\u1FFF\u2C00-\uD7FF\w$]/;
    return expand_to_regex_set(text, startIndex, endIndex, regex, 'word');
}

export function expand_to_word_with_dot(text: string, startIndex: number, endIndex: number): IResultSelection {
    const regex = /[\u00BF-\u1FFF\u2C00-\uD7FF\w\.$]/;
    return expand_to_regex_set(text, startIndex, endIndex, regex, 'word_with_dot');
}
