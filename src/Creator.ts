import * as vscode from 'vscode';
import * as fs from 'fs';
import NamespaceResolver from './NamespaceResolver';
import PackageJSON from './PackageJSON';
import path = require('path');
export default class PhpClassCreator {
    readonly msgFileExists = 'File already exists!';
    readonly msgMustOpenFile = 'You must open a file to generate code';
    readonly msgNotFoundTemplate = 'We can not file this Template!';
    folder: any;

    public async createFile(type: string, folder: any, extension: any = 'php') {
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
        this.folder = folder;

        let name = await vscode.window.showInputBox({
            title: 'New PHP ' + this.capitalize(type),
            placeHolder: 'Name',
            prompt: 'Name of ' + type
        });

        if (!name) {
            return;
        }

        let filename = name.endsWith('.' + extension) ? name : name + '.' + extension;

        let spaceIndex: number = filename.indexOf(' ');
        if (spaceIndex > 0) {
            filename = filename.substring(0, spaceIndex) + '.' + extension;
        }
        let fullFilename = folder.fsPath + path.sep + filename;

        if (extension === 'php') {
            let namespaceResolver: NamespaceResolver = new NamespaceResolver();
            let namespace = await namespaceResolver.resolve(folder.fsPath);
            if (namespace === undefined) {
                return;
            }
            this.writeFile(type, name, fullFilename, namespace, false, extension);
        } else {
            this.writeFile(type, name, fullFilename, '', false, extension);
        }
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

    private async writeFile(type: string, name: string, filename: string, namespace: string, overwrite: boolean = false, extension: any = 'php'): Promise<void> {
        let template: string = '';
        if (vscode.workspace.getConfiguration('CreateNewFiles').has('template' + type)) {
            template = vscode.workspace.getConfiguration('CreateNewFiles').get('template' + type)!;
        }
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

            if (vscode.workspace.getConfiguration('CreateNewFiles').get('finalClass')) {
                template = template.replace('class {{className}}', 'final class ' + name);
            } else {
                template = template.replace('{{className}}', name);
            }
        } else if (extension === 'vue') {
            template = template.replaceAll('{{className}}', name);
        } else if (extension === 'jsx') {
            let packageDotJSON: PackageJSON = new PackageJSON();
            if (await packageDotJSON.hasTypescript(this.folder.fsPath, 'react')) {
                extension = 'tsx';
            }
            template = template.replaceAll('{{className}}', name);
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
