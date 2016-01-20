import {BaseExpander, IResultSelection} from './baseexpander'
import * as vscode from 'vscode';
export class typescript extends BaseExpander {

    expand(text: string, start: number, end: number): IResultSelection {
        return null;
    }
}