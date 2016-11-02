// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {ExpanderManager} from './expandermanager';
import * as expander from './_expander';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    var exp = new ExpanderManager();
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "expand-region" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    var expandSub = vscode.commands.registerCommand('expand_region', () => {
        // The code you place here will be executed every time your command is executed
        if (!exp) {
            exp = new ExpanderManager()
        }
        exp.expand();
    });

    var undoExpandSub = vscode.commands.registerCommand('undo_expand_region', () => {
        if (exp) {
            exp.undoExpand();
        }
    });

    context.subscriptions.push(expandSub);
    context.subscriptions.push(undoExpandSub);

}

// this method is called when your extension is deactivated
export function deactivate() {

}