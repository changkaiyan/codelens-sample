import * as vscode from 'vscode';

//装载传递的函数代码文本
export class FunctionCodeLens extends vscode.CodeLens{
    public text="";
    public range2:vscode.Range=new vscode.Range(new vscode.Position(0,0),new vscode.Position(0,0));
    public beginline=new vscode.Position(0,0);
    public endline=new vscode.Position(0,0);//(beginline,endline]
    public document:vscode.TextDocument|undefined;
}
/**
 * CodelensProvider
 */
export class CodelensProvider implements vscode.CodeLensProvider {

    private codeLenses: vscode.CodeLens[] = [];
    private regex: RegExp;
    private _onDidChangeCodeLenses: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
    public readonly onDidChangeCodeLenses: vscode.Event<void> = this._onDidChangeCodeLenses.event;

    constructor() {
        this.regex = /def\s/g;
        
        vscode.workspace.onDidChangeConfiguration((_) => {
            this._onDidChangeCodeLenses.fire();
        });
    }

    public provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.CodeLens[] | Thenable<vscode.CodeLens[]> {

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
                const indent=document.lineAt(document.positionAt(matches.index).line+1).firstNonWhitespaceCharacterIndex;
                const beginline=document.positionAt(matches.index).line;
                let linecount=document.positionAt(matches.index).line+1;
                while(linecount<document.lineCount&&document.lineAt(linecount).firstNonWhitespaceCharacterIndex==indent){
                    linecount+=1;
                }
                // console.log("range:",beginline," ",linecount);
                const beginposition=new vscode.Position(beginline,0);
                const endposition=new vscode.Position(linecount,0);
                const range=new vscode.Range(beginposition,endposition);
                
                if (range1) {
                    const functionlens=new FunctionCodeLens(range1);
                    functionlens.text=document.getText(range);
                    functionlens.beginline=beginposition;
                    functionlens.endline=endposition;
                    functionlens.range2=range;
                    functionlens.document=document;
                    
                    this.codeLenses.push(functionlens);
                }
            }
            return this.codeLenses;
        }
        return [];
    }

    public resolveCodeLens(codeLens: vscode.CodeLens, token: vscode.CancellationToken) {
        if (vscode.workspace.getConfiguration("codelens-sample").get("enableCodeLens", true)&&codeLens instanceof FunctionCodeLens) {
            
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

