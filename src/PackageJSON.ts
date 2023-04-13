import * as vscode from 'vscode';
import * as path from 'path';
import { statSync } from 'fs';

interface Prs4Entries {
    prefix: string;
    path: string;
}

interface PackageInterface {
    dependencies?: {
        typescript?: string;
        react?: string;
        vue?: string;
    };
}

export default class PackageJSON {
    readonly msgCouldNotBeRead = 'The package.json file could not be read';
    readonly msgNamespaceNotResolved = 'The namespace could not be resolved';
    readonly msgCouldNotBeFound = 'The package.json file could not be found';

    public async resolve(folder: string) {
        let packageFilePath = this.findPackageDotJsonFile(folder);
        if (!packageFilePath) {
            vscode.window.showErrorMessage(this.msgCouldNotBeFound);
            return undefined;
        }

        let packageContent: PackageInterface = await this.packageContent(packageFilePath);

        return packageContent;
    }

    private async packageContent(packageFilePath: string) {
        try {
            let composerContent: string = (await vscode.workspace.openTextDocument(packageFilePath)).getText();
            return JSON.parse(composerContent);
        } catch (error) {
            return undefined;
        }
    }

    private findPackageDotJsonFile(folder: string): string | undefined {
        let workspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(folder))?.uri.fsPath;
        let segments = folder.split(path.sep);

        let walking = true;

        do {
            const fullPath = segments.join(path.sep);

            try {
                const composerPath = path.join(fullPath, 'package.json');
                statSync(composerPath);

                return composerPath;
            } catch {
                segments.pop();
            }

            if (fullPath == workspaceFolder) {
                walking = false;
            }
        } while (walking);

        return undefined;
    }

    public async hasTypescript(folder: string, type: string): Promise<string | undefined> {
        let packageContent: PackageInterface | undefined = await this.resolve(folder);

        if (!packageContent) {
            return undefined;
        }
        const typescript = packageContent.dependencies?.typescript;
        if (type == 'react') {
            if (typescript) {
                return 'tsx';
            } else {
                return 'jsx';
            }
        } else if (type == 'vue') {
            return typescript;
        }
    }

    private pushToList(psr4Entries: Prs4Entries[], entries: { [key: string]: string }) {
        for (const prefix in entries) {
            const entryPath = entries[prefix];

            if (Array.isArray(entryPath)) {
                for (const prefixPath of entryPath) {
                    psr4Entries.push({ prefix: prefix, path: prefixPath });
                }
            } else {
                psr4Entries.push({ prefix: prefix, path: entryPath });
            }
        }
    }

    private ooTrim(str: string, char: string, type?: string): string {
        if (char) {
            if (type == 'left') {
                return str.replace(new RegExp('^\\' + char + '+', 'g'), '');
            } else if (type == 'right') {
                return str.replace(new RegExp('\\' + char + '+$', 'g'), '');
            }

            return str.replace(new RegExp('^\\' + char + '+|\\' + char + '+$', 'g'), '');
        }

        return str.replace(/^\s+|\s+$/g, '');
    }

    private NameSparePathPsr0(filePath: string, composerDir: string, Prs0ent: Prs4Entries[], prs: number): string {
        let enti: Prs4Entries = { path: '', prefix: '' };
        let current_dir: string = '';
        let srcIndex: number = -1;

        filePath = this.ooTrim(filePath, path.sep, 'right') + path.sep;

        for (const entip in Prs0ent) {
            enti = Prs0ent[entip];
            enti.prefix = this.ooTrim(enti.prefix.trim(), '\\').trim();
            enti.path = this.checkEmptyPath(this.ooTrim(enti.path, '/'));

            if (enti.path.length > 0) {
                current_dir = composerDir + enti.path + path.sep;
                if (enti.prefix.length > 0 && prs == 0) {
                    current_dir += enti.prefix.split('\\').join(path.sep) + path.sep;
                }
            } else {
                current_dir = composerDir;
            }

            srcIndex = filePath.indexOf(current_dir);

            if (srcIndex == 0) {
                break;
            }
        }

        if (srcIndex == -1) {
            return '';
        }

        let pathElements = this.ooTrim(filePath, path.sep, 'right').slice(current_dir.length).split(path.sep).join('\\').trim();
        let slash = '';

        if (enti.prefix.length > 0 && pathElements.length > 0) {
            slash = '\\';
        }

        return enti.prefix + slash + pathElements;
    }

    private checkEmptyPath(path: string) {
        path = this.ooTrim(path.trim(), './', 'left');
        switch (path) {
            case '.':
            case '/':
            case './':
                return '';
            default:
                return path;
        }
    }
}
