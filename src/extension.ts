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
    let createSvelteFile = vscode.commands.registerCommand('CreateNewFiles.createSvelteFile', (folder) => creator.createFile('Svelte', folder, 'svelte'));
    let createReactFunctionFile = vscode.commands.registerCommand('CreateNewFiles.createReactFunctionFile', (folder) => creator.createFile('ReactFunction', folder, 'jsx'));
    let createReactClassComponentFile = vscode.commands.registerCommand('CreateNewFiles.createReactClassComponentFile', (folder) => creator.createFile('ReactClassComponent', folder, 'jsx'));
    let createHtml5File = vscode.commands.registerCommand('CreateNewFiles.createHtml5File', (folder) => creator.createFile('Html5', folder, 'html'));
    let createVueComponentFile = vscode.commands.registerCommand('CreateNewFiles.createVueComponentFile', (folder) => creator.createFile('VueComponent', folder, 'vue'));
    let createCssFile = vscode.commands.registerCommand('CreateNewFiles.createCssFile', (folder) => creator.createFile('cssStylesheet', folder, 'css'));
    let createJsFile = vscode.commands.registerCommand('CreateNewFiles.createJsFile', (folder) => creator.createFile('cssStylesheet', folder, 'js'));

    context.subscriptions.push(createClass);
    context.subscriptions.push(createInterface);
    context.subscriptions.push(createTrait);
    context.subscriptions.push(createEnum);
    context.subscriptions.push(generateClassCode);
    context.subscriptions.push(generateInterfaceCode);
    context.subscriptions.push(generateTraitCode);
    context.subscriptions.push(generateEnumCode);
    context.subscriptions.push(createReactFunctionFile);
    context.subscriptions.push(createVueFile);
    context.subscriptions.push(createSvelteFile);
    context.subscriptions.push(createReactClassComponentFile);
    context.subscriptions.push(createHtml5File);
    context.subscriptions.push(createVueComponentFile);
    context.subscriptions.push(createCssFile);

    vscode.commands.executeCommand('setContext', 'CreateNewFiles.activated', true);
}

export function deactivate() {}
