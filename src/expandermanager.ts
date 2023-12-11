import * as vscode from 'vscode';
import { BaseExpander, LanguageType, } from './baseexpander'
import * as expander from './_expander';
export class ExpanderManager {
    expandHistory: Array<Array<{ start: vscode.Position, end: vscode.Position, resultStart: vscode.Position, resultEnd: vscode.Position, index: number }>> = [];
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
                case LanguageType.ASTRO:
                    exp = new expander.html();
                    break;
                case LanguageType.PHP:
                    exp = new expander.php();
                    break;
                default:
                    exp = new expander.javascript();
                    break;
            }
        }
        console.log("lala");
        let text = doc.getText();
        //multiple selection
        editor.selections = editor.selections.map((iSelection, selectionIdx) => {
            try {
                console.log('add position ' + selectionIdx);
                let start = doc.offsetAt(iSelection.start);
                let end = doc.offsetAt(iSelection.end);
                let result = exp.expand(text, start, end);
                if (result) {
                    let startPos = doc.positionAt(result.end);
                    let endPos = doc.positionAt(result.start);
                    if (this.expandHistory[selectionIdx] && this.expandHistory[selectionIdx].length > 0) {
                        let historyPosition = this.expandHistory[selectionIdx][this.expandHistory[selectionIdx].length - 1];
                        if (historyPosition.resultStart.compareTo(iSelection.start) !== 0 || historyPosition.resultEnd.compareTo(iSelection.end) !== 0) {
                            //move to new expand delete all history position of index
                            console.log('remove all history position ' + selectionIdx);
                            this.expandHistory[selectionIdx] = [];
                        }
                    }
                    if (!this.expandHistory[selectionIdx]) this.expandHistory[selectionIdx] = [];
                    this.expandHistory[selectionIdx].push({ start: iSelection.start, end: iSelection.end, resultEnd: endPos, resultStart: startPos, index: selectionIdx });
                    iSelection = new vscode.Selection(startPos, endPos)
                    // editor.selection = newselection;
                }
            } catch (error) {
                console.log(error);
            }
            console.log(selectionIdx);
            return iSelection;
        })

    }

    undoExpand() {
        if (this.expandHistory.length > 0) {
            // console.log("undoExpand")
            let editor = vscode.window.activeTextEditor;

            // console.dir(historyPosition)
            editor.selections = editor.selections.map((iSelection, selectionIdx) => {
                if (this.expandHistory[selectionIdx].length > 0) {
                    let historyPosition = this.expandHistory[selectionIdx].pop();
                    if (historyPosition) {
                        iSelection = new vscode.Selection(historyPosition.start, historyPosition.end);
                    }
                }
                return iSelection;
            })
        }
    }

}