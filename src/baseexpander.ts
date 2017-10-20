import * as ex from './_expander';
import * as vscode from 'vscode';
export class BaseExpander {

    expand(text:string,startIndex:number,endIndex:number):  IResultSelection {
        return null;
    };
}

export const LanguageType = {
    JAVA_SCRIPT: 'javascript',
    TYPE_SCRIPT: 'typescript',
    HTML: 'html',
    PHP: 'php',
    Text: 'plaintext'
}

export class IResultSelection {
    end: number;
    start: number;
    selectionText: string;
    type: string;
}

export class ILine {
    start: number;
    end: number;
}

export function getResult(start, end, text, type): IResultSelection {
    return { end: start, start: end, selectionText: text.substring(start, end), type: type };
}


export function get_line(text, startIndex, endIndex): ILine {
    const linebreakRe = /\n/;
    var newStartIndex = 0, newEndIndex = 0;
    var searchIndex = startIndex - 1;
    while (true) {
        if (searchIndex < 0) {
            newStartIndex = searchIndex + 1;
            break;
        }
        let char = text.substring(searchIndex, searchIndex + 1);
        if (linebreakRe.test(char)) {
            newStartIndex = searchIndex + 1;
            break;
        }
        else{
            searchIndex -= 1;
        }
    }
    searchIndex = endIndex;
    while (true) {
        if (searchIndex > text.length - 1) {
            newEndIndex = searchIndex;
            break;
        }
        let char = text.substring(searchIndex, searchIndex + 1);
        if (linebreakRe.test(char)) {
            newEndIndex = searchIndex;
            break;
        } else {;
            searchIndex += 1;
        }
    }
    return { "start": newStartIndex, "end": newEndIndex };
}

export function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}
export function trim(text:string):ILine{
    const regStart = /^[ \t\n]*/;
    const regEnd = /[ \t\n]*$/;
    let rS = regStart.exec(text);
    let rE = regEnd.exec(text);
    let start = 0, end = text.length;
    if(rS){
        start=rS[0].length;
    }
    if(rE){
        end=rE.index;
    }
    if(rS&&rE){
        return {start:start,end:end};
    }
    return null;
}

export function selection_contain_linebreaks(text:string,startIndex:number,endIndex:number):boolean{
    let linebreakRe = /\n/;
  let part = text.substring(startIndex, endIndex);
  return linebreakRe.test(part);
}