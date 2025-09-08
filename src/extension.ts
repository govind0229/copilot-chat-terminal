import * as vscode from 'vscode';
import { exec } from 'child_process';
import * as os from 'os';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    console.log('Congratulations, your extension "copilot-terminal-in-chat" is now active!');

    let defaultChatParticipant: vscode.ChatParticipant | undefined;

    const updateDefaultChatParticipant = () => {
        const isDefault = vscode.workspace.getConfiguration('terminal').get('defaultChatBehavior');

        if (isDefault && !defaultChatParticipant) {
            // Create a default chat participant that intercepts common commands
            defaultChatParticipant = vscode.chat.createChatParticipant('terminal-chat.default', async (request, context, stream, token) => {
                const command = request.prompt.trim();
                
                // Auto-detect and execute terminal commands without @terminal prefix
                if (isTerminalCommand(command)) {
                    try {
                        await executeTerminalCommand(command, stream);
                        return { metadata: { command: true, autoDetected: true } };
                    } catch (error) {
                        stream.markdown(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}\n`);
                        return { metadata: { command: true } };
                    }
                }

                // If not a terminal command, defer to regular Copilot by returning undefined.
                return undefined;
            });
            defaultChatParticipant.iconPath = new vscode.ThemeIcon('terminal');
            context.subscriptions.push(defaultChatParticipant);

        } else if (!isDefault && defaultChatParticipant) {
            defaultChatParticipant.dispose();
            defaultChatParticipant = undefined;
        }
    };

    // Create a command to toggle the default behavior
    const makeDefaultCommand = vscode.commands.registerCommand('copilot-terminal-in-chat.makeDefault', async () => {
        const config = vscode.workspace.getConfiguration('terminal');
        const isDefault = config.get('defaultChatBehavior');
        await config.update('defaultChatBehavior', !isDefault, vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage(`Terminal is now the ${!isDefault ? 'default' : 'non-default'} chat behavior.`);
    });

    context.subscriptions.push(makeDefaultCommand);

    // Listen for configuration changes
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration('terminal.defaultChatBehavior')) {
            updateDefaultChatParticipant();
        }
    }));

    // Initial setup
    updateDefaultChatParticipant();

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('copilot-terminal-in-chat.helloWorld', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World from copilot-terminal-in-chat!');
    });

    context.subscriptions.push(disposable);

    // Create a chat participant for @terminal
    const terminalChatParticipant = vscode.chat.createChatParticipant('terminal-chat.terminal', async (request, context, stream, token) => {
        const command = request.prompt.trim();
        
        try {
            await executeTerminalCommand(command, stream);
            return { metadata: { command: true } };
        } catch (error) {
            stream.markdown(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}\n`);
            return { metadata: { command: true } };
        }
    });

    terminalChatParticipant.iconPath = new vscode.ThemeIcon('terminal');
    context.subscriptions.push(terminalChatParticipant);
}

// This method is called when your extension is deactivated
export function deactivate() {
    // Cleanup if needed
}

async function executeTerminalCommand(command: string, stream: vscode.ChatResponseStream): Promise<void> {
    return new Promise((resolve, reject) => {
        const workspacePath = vscode.workspace.workspaceFolders?.[0].uri.fsPath || '~';
        const username = os.userInfo().username;
        const hostname = os.hostname().split('.')[0]; // Get just the hostname without domain
        const prompt = `${username}@${hostname} ${workspacePath.split('/').pop()}$ `;
        let terminalOutput = '';

        const child = exec(command, { cwd: workspacePath, timeout: 30000 });

        child.stdout?.on('data', data => {
            terminalOutput += data.toString();
        });

        child.stderr?.on('data', data => {
            terminalOutput += data.toString();
        });

        child.on('close', code => {
            const exitIndicator = code === 0 ? '✅' : '❌';
            const fullOutput = `${prompt}${command}\n${terminalOutput}${exitIndicator} Exit code: ${code}`;
            stream.markdown(`\`\`\`bash\n${fullOutput}\n\`\`\``);
            resolve();
        });

        child.on('error', err => {
            const error = err as any;
            if (error.code === 'ENOENT') {
                const cmd = command.split(' ')[0];
                const errorOutput = `${prompt}${command}\nCommand '${cmd}' not found.`;
                stream.markdown(`\`\`\`bash\n${errorOutput}\n\`\`\`\n💡 **Suggestion:** Try \`brew install ${cmd}\` (macOS) or \`sudo apt install ${cmd}\` (Ubuntu/Debian)`);
            } else if (error.code === 'ETIMEDOUT') {
                const timeoutOutput = `${prompt}${command}\n${terminalOutput}⏰ Command timed out after 30 seconds`;
                stream.markdown(`\`\`\`bash\n${timeoutOutput}\n\`\`\``);
            } else {
                const errorOutput = `${prompt}${command}\n${terminalOutput}❌ Error: ${err.message}`;
                stream.markdown(`\`\`\`bash\n${errorOutput}\n\`\`\``);
            }
            reject(err);
        });
    });
}

export function isTerminalCommand(command: string): boolean {
    // Extremely permissive detection for ANY system command
    const trimmed = command.trim();
    if (!trimmed) {
        return false;
    }

    // Check if it starts with question words (likely natural language)
    const questionWords1 = /^(what|how|can|is|do|please|help|tell|show)/i;
    const questionWords2 = /^(explain|why|when|where|who|which|should|would)/i;
    const questionWords3 = /^(could|may|might|shall|will|did|does|are|were)/i;
    const questionWords4 = /^(was|have|has|had)/i;
    if (questionWords1.test(trimmed.split(' ')[0]) || questionWords2.test(trimmed.split(' ')[0]) ||
        questionWords3.test(trimmed.split(' ')[0]) || questionWords4.test(trimmed.split(' ')[0])) {
        return false;
    }

    // Check for conversational patterns that indicate natural language
    const conversationalPatterns = /\b(i want|i need|i would like|can you|could you|please|let me|give me|show me|tell me)\b/i;
    if (conversationalPatterns.test(trimmed)) {
        return false;
    }

    // Check for shell operators or patterns that definitely indicate a command
    const shellOperators = /(\||>|>>|<|<<|&|;|\$\(|`|\.\/|\/)/;
    if (shellOperators.test(trimmed)) {
        return true;
    }

    // If the first word looks like ANY executable path or command (extremely permissive)
    const firstWord = trimmed.split(' ')[0];

    // Allow any alphanumeric string with common path characters
    if (/^[a-zA-Z0-9._/-]+$/.test(firstWord) && firstWord.length >= 1) {
        // Additional check: if it doesn't contain multiple spaces (indicating sentences)
        const spaceCount = (trimmed.match(/ /g) || []).length;
        if (spaceCount <= 5) { // Allow reasonable number of arguments
            return true;
        }
    }

    // Allow commands that start with common prefixes
    if (firstWord.startsWith('./') || firstWord.startsWith('/') || firstWord.startsWith('~/') || firstWord.includes('/')) {
        return true;
    }

    // For anything that's not clearly a sentence, try to execute it
    // Check for sentence-like patterns
    const sentenceIndicators1 = /\b(the|a|an|to|for|with|from|by|at|in|on|of)\b/i;
    const sentenceIndicators2 = /\b(and|or|but|so|because|although|while|if|then|else)\b/i;
    const sentenceIndicators3 = /\b(when|where|how|why|what|which|who|that|this|these|those)\b/i;

    const sentenceWords = trimmed.split(' ').length;

    // If it has few words and doesn't look like a sentence, treat as command
    if (sentenceWords <= 8 && !sentenceIndicators1.test(trimmed) && !sentenceIndicators2.test(trimmed) && !sentenceIndicators3.test(trimmed)) {
        return true;
    }    // Default: assume it's a command if it's short and doesn't look like natural language
    return trimmed.length <= 100 && !trimmed.includes('?') && !trimmed.includes('!');
}