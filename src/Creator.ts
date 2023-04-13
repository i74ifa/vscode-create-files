import * as vscode from 'vscode';
import * as fs from 'fs';
import NamespaceResolver from './NamespaceResolver';
import path = require('path');
export default class PhpClassCreator {
    readonly msgFileExists = 'File already exists!';
    readonly msgMustOpenFile = 'You must open a file to generate code';
    readonly msgNotFoundTemplate = 'We can not file this Template!';

    public async createFile(type: string, folder: any, extension: string = 'php') {
        if (!folder) {
            let askedFolder = await vscode.window.showOpenDialog({
                canSelectFiles: false,
                canSelectFolders: true,
                canSelectMany: false
            });

            if (!askedFolder || !askedFolder[0]) {
                return;
            }

            folder = askedFolder[0];
        }

        let name = await vscode.window.showInputBox({
            title: 'New PHP ' + this.capitalize(type),
            placeHolder: 'Name',
            prompt: 'Name of ' + type
        });

        if (!name) {
            return;
        }

        let namespaceResolver: NamespaceResolver = new NamespaceResolver();
        let namespace = await namespaceResolver.resolve(folder.fsPath);

        if (namespace === undefined) {
            return;
        }

        let filename = name.endsWith('.' + extension) ? name : name + '.' + extension;

        let spaceIndex: number = filename.indexOf(' ');
        if (spaceIndex > 0) {
            filename = filename.substring(0, spaceIndex) + '.' + extension;
        }

        let fullFilename = folder.fsPath + path.sep + filename;

        this.writeFile(type, name, fullFilename, namespace, false, extension);
    }

    public async generateCode(type: string) {
        const currentFile = vscode.window.activeTextEditor?.document.fileName;

        if (!currentFile) {
            vscode.window.showErrorMessage(this.msgMustOpenFile);
            return;
        }

        let namespaceResolver: NamespaceResolver = new NamespaceResolver();
        let namespace = await namespaceResolver.resolve(path.dirname(currentFile));

        if (namespace === undefined) {
            return;
        }

        this.writeFile(type, path.basename(currentFile), currentFile, namespace, true);
    }

    private writeFile(type: string, name: string, filename: string, namespace: string, overwrite: boolean = false, extension: string = 'php'): void {
        if (!vscode.workspace.getConfiguration('CreateNewFiles').has('phpClassTemplate' + type)) {
            vscode.window.showErrorMessage(this.msgNotFoundTemplate);
            return;
        }
        let template: string = vscode.workspace.getConfiguration('CreateNewFiles').get('phpClassTemplate' + type)!;
        name = name.replace(new RegExp(`\\.${extension}+$`, 'g'), '');

        if (extension === 'php') {
            if (vscode.workspace.getConfiguration('CreateNewFiles').get('strictTypes')) {
                template = template.replace('{{beforeNamespace}}', 'declare(strict_types=1);\n');
            } else {
                template = template.replace('{{beforeNamespace}}', '\n');
            }
            if (namespace) {
                template = template.replace('{{namespace}}', namespace);
            } else {
                template = template.replace(/namespace?\s{{namespace}};?/g, namespace);
            }

            if (fs.existsSync(filename) && !overwrite) {
                vscode.window.showErrorMessage(this.msgFileExists);
                return;
            }
            template = template.replace('{{className}}', name);
        } else if (extension === 'vue') {
            //
        }

        fs.writeFileSync(filename, template);

        vscode.workspace.openTextDocument(vscode.Uri.file(filename)).then((file) => {
            vscode.window.showTextDocument(file);
        });
    }

    private capitalize(text: string): string {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }
}
