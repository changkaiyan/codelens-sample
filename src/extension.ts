// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { ExtensionContext, languages, commands, Disposable, workspace, window } from 'vscode';
import { CodelensProvider, FunctionCodeLens } from './CodelensProvider';
import fetch from 'node-fetch';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

let disposables: Disposable[] = [];

export function activate(context: ExtensionContext) {
    const codelensProvider = new CodelensProvider();

    const docstring = {
        language: 'python',
        scheme: 'file',
    };

    languages.registerCodeLensProvider(docstring, codelensProvider);

    commands.registerCommand("codelens-sample.enableCodeLens", () => {
        workspace.getConfiguration("codelens-sample").update("enableCodeLens", true, true);
    });

    commands.registerCommand("codelens-sample.disableCodeLens", () => {
        workspace.getConfiguration("codelens-sample").update("enableCodeLens", false, true);
    });

    commands.registerCommand("codelens-sample.codelensAction", async (args: any) => {
        // window.showInformationMessage(`CodeLens action clicked with args=${args}`);


        //向7070端口发送HTTP POST
        if (args instanceof FunctionCodeLens) {
            const response = await fetch("http://localhost:7070", {
                method: 'POST',
                body: JSON.stringify({ functiontext:  args.text }),
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                window.showInformationMessage("The tensorpilot server has not start!");
            }
            else if (response.status >= 400) {
                window.showInformationMessage('HTTP Error: ' + response.status + ' - ' + response.statusText);
            }
            else {
                response.text().then((data) => {
                    console.log(data);
                    //获取返回的json字符串
                    //提取新的函数
                    //替换老函数，插入到文档中
                    window.activeTextEditor?.edit(editBuilder => {
 
                        editBuilder.replace(args.range2, data);

                    });
                });
            }
        }
    });
}

// this method is called when your extension is deactivated
export function deactivate() {
    if (disposables) {
        disposables.forEach(item => item.dispose());
    }
    disposables = [];
}

