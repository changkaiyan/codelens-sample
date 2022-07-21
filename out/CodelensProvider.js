"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodelensProvider = exports.FunctionCodeLens = void 0;
const vscode = require("vscode");
//装载传递的函数代码文本
class FunctionCodeLens extends vscode.CodeLens {
    constructor() {
        super(...arguments);
        this.text = "";
        this.range2 = new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 0));
        this.beginline = new vscode.Position(0, 0);
        this.endline = new vscode.Position(0, 0); //(beginline,endline]
    }
}
exports.FunctionCodeLens = FunctionCodeLens;
/**
 * CodelensProvider
 */
class CodelensProvider {
    constructor() {
        this.codeLenses = [];
        this._onDidChangeCodeLenses = new vscode.EventEmitter();
        this.onDidChangeCodeLenses = this._onDidChangeCodeLenses.event;
        this.regex = /def\s/g;
        vscode.workspace.onDidChangeConfiguration((_) => {
            this._onDidChangeCodeLenses.fire();
        });
    }
    provideCodeLenses(document, token) {
        if (vscode.workspace.getConfiguration("codelens-sample").get("enableCodeLens", true)) {
            this.codeLenses = [];
            const regex = new RegExp(this.regex);
            const text = document.getText();
            let matches;
            while ((matches = regex.exec(text)) !== null) {
                const line = document.lineAt(document.positionAt(matches.index).line);
                const indexOf = line.text.indexOf(matches[0]);
                const position = new vscode.Position(line.lineNumber, indexOf);
                const range1 = document.getWordRangeAtPosition(position, new RegExp(this.regex));
                //获取def的函数范围，使用基于缩进的方法获取
                const indent = document.lineAt(document.positionAt(matches.index).line + 1).firstNonWhitespaceCharacterIndex;
                const beginline = document.positionAt(matches.index).line;
                let linecount = document.positionAt(matches.index).line + 1;
                while (linecount < document.lineCount && document.lineAt(linecount).firstNonWhitespaceCharacterIndex == indent) {
                    linecount += 1;
                }
                // console.log("range:",beginline," ",linecount);
                const beginposition = new vscode.Position(beginline, 0);
                const endposition = new vscode.Position(linecount, 0);
                const range = new vscode.Range(beginposition, endposition);
                if (range1) {
                    const functionlens = new FunctionCodeLens(range1);
                    functionlens.text = document.getText(range);
                    functionlens.beginline = beginposition;
                    functionlens.endline = endposition;
                    functionlens.range2 = range;
                    functionlens.document = document;
                    this.codeLenses.push(functionlens);
                }
            }
            return this.codeLenses;
        }
        return [];
    }
    resolveCodeLens(codeLens, token) {
        if (vscode.workspace.getConfiguration("codelens-sample").get("enableCodeLens", true) && codeLens instanceof FunctionCodeLens) {
            codeLens.command = {
                title: "Tensor Go",
                tooltip: "Tensorize this function.",
                command: "codelens-sample.codelensAction",
                arguments: [codeLens]
            };
            return codeLens;
        }
        return null;
    }
}
exports.CodelensProvider = CodelensProvider;
//# sourceMappingURL=CodelensProvider.js.map