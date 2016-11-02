import * as vscode from 'vscode';
import {BaseExpander, LanguageType, } from './baseexpander'
import * as expander from './_expander';
export class ExpanderManager {
    expandHistory: Array<{ start: vscode.Position, end: vscode.Position, resultStart: vscode.Position, resultEnd: vscode.Position }> = [];
    expand() {
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        let exp: BaseExpander;
        let doc = editor.document;
        if (doc.languageId) {
            switch (doc.languageId) {
                case LanguageType.HTML:
                    exp = new expander.html();
                    break;
                default:
                    exp = new expander.javascript();
                    break;
            }
        }
        let text = doc.getText();
        let start = doc.offsetAt(editor.selection.start);
        let end = doc.offsetAt(editor.selection.end);
        let result = exp.expand(text, start, end);
        if (result) {
            let startPos = doc.positionAt(result.end);
            let endPos = doc.positionAt(result.start);
            if (this.expandHistory.length > 0) {
                let historyPosition = this.expandHistory[this.expandHistory.length - 1];
                if (historyPosition.resultStart.compareTo(editor.selection.start) !== 0 || historyPosition.resultEnd.compareTo(editor.selection.end) !== 0) {
                    //move to new expand
                    this.expandHistory = [];
                }
            }
            this.expandHistory.push({ start: editor.selection.start, end: editor.selection.end, resultEnd: endPos, resultStart: startPos });
            let newselection = new vscode.Selection(startPos, endPos)
            editor.selection = newselection;
        }
    }

    undoExpand() {
        if (this.expandHistory.length > 0) {
            // console.log("undoExpand")
            let editor = vscode.window.activeTextEditor;
            let historyPosition = this.expandHistory.pop();
            console.dir(historyPosition)
            editor.selection = new vscode.Selection(historyPosition.start, historyPosition.end)
        }
    }

}