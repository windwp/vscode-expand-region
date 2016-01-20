import * as vscode from 'vscode';
import {BaseExpander, LanguageType} from './baseexpander'
import * as expander from './_expander';
export class ExpanderManager {
    expand() {
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        var exp: BaseExpander;
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
        let text=doc.getText();
        let start=doc.offsetAt(editor.selection.start);
        let end=doc.offsetAt(editor.selection.end);
        var result=exp.expand(text,start,end);
        if(result){
            var startPos=doc.positionAt(result.startIndex);
            var endPos=doc.positionAt(result.endIndex);
            var newselection=new vscode.Selection(startPos,endPos)
            editor.selection=newselection;
        }
    }


}