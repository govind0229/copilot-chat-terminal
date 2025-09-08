import * as assert from 'assert';
import * as vscode from 'vscode';
// @ts-ignore
const { isTerminalCommand } = require('../../dist/extension');

suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('Sample test', () => {
        assert.strictEqual(-1, [1, 2, 3].indexOf(5));
        assert.strictEqual(-1, [1, 2, 3].indexOf(0));
    });

    suite('isTerminalCommand', () => {
        test('Should identify basic commands', () => {
            assert.ok(isTerminalCommand('ls -la'));
            assert.ok(isTerminalCommand('git status'));
            assert.ok(isTerminalCommand('npm install'));
        });

        test('Should identify commands with pipes and redirects', () => {
            assert.ok(isTerminalCommand('cat file.txt | grep "error"'));
            assert.ok(isTerminalCommand('echo "hello" > world.txt'));
        });

        test('Should identify path-based commands', () => {
            assert.ok(isTerminalCommand('./run.sh'));
            assert.ok(isTerminalCommand('/usr/bin/node --version'));
        });

        test('Should reject natural language questions', () => {
            assert.strictEqual(isTerminalCommand('what is the current directory?'), false);
            assert.strictEqual(isTerminalCommand('can you list the files for me'), false);
            assert.strictEqual(isTerminalCommand('how to install npm'), false);
        });
    });
});
