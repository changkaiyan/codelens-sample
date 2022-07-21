"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode_1 = require("vscode");
const CodelensProvider_1 = require("./CodelensProvider");
const node_fetch_1 = require("node-fetch");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
let disposables = [];
function activate(context) {
    const codelensProvider = new CodelensProvider_1.CodelensProvider();
    const docstring = {
        language: 'python',
        scheme: 'file',
    };
    vscode_1.languages.registerCodeLensProvider(docstring, codelensProvider);
    vscode_1.commands.registerCommand("codelens-sample.enableCodeLens", () => {
        vscode_1.workspace.getConfiguration("codelens-sample").update("enableCodeLens", true, true);
    });
    vscode_1.commands.registerCommand("codelens-sample.disableCodeLens", () => {
        vscode_1.workspace.getConfiguration("codelens-sample").update("enableCodeLens", false, true);
    });
    vscode_1.commands.registerCommand("codelens-sample.codelensAction", async (args) => {
        // window.showInformationMessage(`CodeLens action clicked with args=${args}`);
        //向7070端口发送HTTP POST
        if (args instanceof CodelensProvider_1.FunctionCodeLens) {
            const response = await (0, node_fetch_1.default)("http://localhost:7070", {
                method: 'POST',
                body: JSON.stringify({ functiontext: args.text }),
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok) {
                vscode_1.window.showInformationMessage("The tensorpilot server has not start!");
            }
            else if (response.status >= 400) {
                vscode_1.window.showInformationMessage('HTTP Error: ' + response.status + ' - ' + response.statusText);
            }
            else {
                response.text().then((data) => {
                    console.log(data);
                    //获取返回的json字符串
                    //提取新的函数
                    //替换老函数，插入到文档中
                    vscode_1.window.activeTextEditor?.edit(editBuilder => {
                        editBuilder.replace(args.range2, data);
                    });
                });
            }
        }
    });
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
    if (disposables) {
        disposables.forEach(item => item.dispose());
    }
    disposables = [];
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map