import * as vscode from 'vscode';
import Creator from './Creator';

export function activate(context: vscode.ExtensionContext) {
    let creator: Creator = new Creator();

    let createClass = vscode.commands.registerCommand('CreateNewFiles.createPhpClass', (folder) => creator.createFile('Class', folder));
    let createInterface = vscode.commands.registerCommand('CreateNewFiles.createPhpInterface', (folder) => creator.createFile('Interface', folder));
    let createTrait = vscode.commands.registerCommand('CreateNewFiles.createPhpTrait', (folder) => creator.createFile('Trait', folder));
    let createEnum = vscode.commands.registerCommand('CreateNewFiles.createPhpEnum', (folder) => creator.createFile('Enum', folder));
    let generateClassCode = vscode.commands.registerCommand('CreateNewFiles.generatePhpClassCode', () => creator.generateCode('Class'));
    let generateInterfaceCode = vscode.commands.registerCommand('CreateNewFiles.generatePhpInterfaceCode', () => creator.generateCode('Interface'));
    let generateTraitCode = vscode.commands.registerCommand('CreateNewFiles.generatePhpTraitCode', () => creator.generateCode('Trait'));
    let generateEnumCode = vscode.commands.registerCommand('CreateNewFiles.generatePhpEnumCode', () => creator.generateCode('Enum'));
    let createVueFile = vscode.commands.registerCommand('CreateNewFiles.createVueFile', (folder) => creator.createFile('Vue', folder, 'vue'));

    context.subscriptions.push(createClass);
    context.subscriptions.push(createInterface);
    context.subscriptions.push(createTrait);
    context.subscriptions.push(createEnum);
    context.subscriptions.push(generateClassCode);
    context.subscriptions.push(generateInterfaceCode);
    context.subscriptions.push(generateTraitCode);
    context.subscriptions.push(generateEnumCode);

    vscode.commands.executeCommand('setContext', 'CreateNewFiles.activated', true);
}

export function deactivate() {}
