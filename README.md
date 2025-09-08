# Copilot Chat Terminal

[![Version](https://img.shields.io/badge/version-0.0.1-blue.svg)](https://github.com/govind0229/copilot-chat-terminal/releases/tag/v0.0.1)
[![VS Code](https://img.shields.io/badge/VS_Code-1.103.0+-blue.svg)](https://code.visualstudio.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

Transform GitHub Copilot Chat into a powerful terminal interface! Execute any terminal command directly in Copilot Chat with intelligent command detection, dynamic PC name recognition, and professional terminal-like output formatting.

## ✨ Features

### 🚀 **Core Features**

- **Any Command Execution**: Run any terminal command, not just predefined ones
- **Dynamic PC Name**: Automatically detects and displays your actual `username@hostname`
- **Path-Based Commands**: Support for `./script.sh`, `/usr/bin/node`, `~/bin/tool`
- **Terminal-Like Output**: Clean, professional terminal window formatting
- **Smart Detection**: Intelligent differentiation between commands and natural language

### 🛡️ **Reliability & Safety**

- **Timeout Protection**: 30-second timeout prevents hanging commands
- **Installation Suggestions**: Auto-suggests package installation for missing commands
- **Error Handling**: Comprehensive error messages with specific guidance
- **Exit Code Display**: Visual success/failure indicators (✅/❌)

### ⚙️ **Configuration**

- **Default Behavior Toggle**: Enable/disable as default Copilot Chat handler
- **Flexible Usage**: Works with or without `@terminal` prefix
- **Workspace Integration**: Commands execute in your project directory

## 📋 Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage Examples](#usage-examples)
- [Configuration](#configuration)
- [Command Detection](#command-detection)
- [Troubleshooting](#troubleshooting)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## 🚀 Installation

### Option 1: Install from VSIX (Recommended)

1. **Download** the latest `.vsix` file from [Releases](https://github.com/yourusername/copilot-terminal-in-chat/releases)
2. **Open VS Code** and press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
3. **Run command**: `Extensions: Install from VSIX`
4. **Select** the downloaded `.vsix` file
5. **Reload** VS Code window
6. **Done!** Start using terminal commands in Copilot Chat

### Option 2: Development Mode

```bash
# Clone the repository
git clone https://github.com/yourusername/copilot-terminal-in-chat.git
cd copilot-terminal-in-chat

# Install dependencies
npm install

# Launch extension development host
npm run compile
code --extensionDevelopmentPath=.
```

## 🎯 Quick Start

### Basic Usage

Just type terminal commands directly in Copilot Chat:

```bash
pwd                    # Shows current directory
ls -la                 # Lists files with details
npm --version          # Checks npm version
git status             # Shows git status
```

### Advanced Examples

```bash
# Path-based commands
./my-script.sh
/usr/local/bin/node --version
~/bin/personal-tool

# Complex commands
docker ps | grep running
find . -name "*.js" -type f
brew list | head -10

# Development workflow
npm run build && npm test
git add . && git commit -m "Update"
```

## 📖 Usage Examples

### File Operations

```bash
ls -ltr              # List files by modification time
cat README.md        # Display file contents
cp source.txt dest.txt  # Copy files
mkdir new-folder     # Create directory
rm old-file.txt      # Remove file
```

### Development Tools

```bash
npm install          # Install dependencies
node --version       # Check Node.js version
python3 script.py    # Run Python script
git log --oneline    # Show git history
docker --version     # Check Docker version
```

### System Information

```bash
whoami               # Show current user
hostname             # Show computer name
pwd                  # Show current directory
ps aux               # Show running processes
df -h                # Show disk usage
```

### Package Management

```bash
brew update          # Update Homebrew
brew install wget    # Install package
apt update           # Update Ubuntu packages
pip install requests # Install Python package
```

## ⚙️ Configuration

### Enable as Default Handler

**Option 1: VS Code Settings**

1. Open VS Code Settings (`Ctrl+,`)
2. Search for: `terminal.defaultChatBehavior`
3. Check the box to enable

**Option 2: Settings JSON**
Add to your `settings.json`:

```json
{
  "terminal.defaultChatBehavior": true
}
```

**Option 3: Command Palette**

1. Press `Ctrl+Shift+P`
2. Run: `Make Terminal Default for Copilot Chat`

### Configuration Options

| Setting                          | Default  | Description                                         |
| -------------------------------- | -------- | --------------------------------------------------- |
| `terminal.defaultChatBehavior` | `true` | Make terminal execution the default in Copilot Chat |

## 🔍 Command Detection

The extension uses intelligent pattern recognition to distinguish terminal commands from natural language:

### ✅ **Detected as Commands:**

- Any word starting with letter/digit/underscore/hyphen
- Commands with path separators (`/`, `./`, `~/`)
- Commands with shell operators (`|`, `>`, `>>`, `<`, `&`, `;`)
- Common executable patterns

### ❌ **Not Detected (Natural Language):**

- Questions starting with: what, how, can, is, do, please, help
- Conversational phrases: "I want", "can you", "please show"
- Sentences with articles: "the", "a", "an"

### Examples:

```bash
✅ pwd                    # Detected as command
✅ ls -la                 # Detected as command
✅ ./script.sh            # Detected as command
✅ npm install           # Detected as command

❌ What is the current directory?    # Natural language
❌ Can you show me the files?        # Natural language
❌ Please list the contents         # Natural language
```

## 🔧 Troubleshooting

### Command Not Found

If you see "Command not found" errors:

```bash
# macOS with Homebrew
brew install <command>

# Ubuntu/Debian
sudo apt install <command>

# CentOS/RHEL
sudo yum install <command>
```

### Extension Not Working

1. **Reload VS Code**: `Ctrl+Shift+P` → `Developer: Reload Window`
2. **Check Settings**: Ensure `terminal.defaultChatBehavior` is enabled
3. **Restart Extension**: Disable and re-enable the extension
4. **Check Copilot**: Ensure GitHub Copilot extension is installed

### Permission Issues

```bash
# For permission denied errors
sudo chmod +x script.sh
sudo chown $USER file.txt
```

### Timeout Errors

Commands automatically timeout after 30 seconds. For long-running commands:

```bash
# Use nohup for background execution
nohup long-running-command &

# Or increase timeout in code (advanced)
timeout 300 long-command  # 5-minute timeout
```

## 🛠️ Development

### Prerequisites

- Node.js 16+
- VS Code 1.103.0+
- GitHub Copilot extension

### Build Commands

```bash
npm run compile          # Compile TypeScript
npm run watch           # Watch for changes
npm run test            # Run unit tests
npm run lint            # Lint code
```

### Packaging

```bash
# Install packaging tool
npm install -g @vscode/vsce

# Package extension
vsce package

# Install locally
code --install-extension copilot-terminal-in-chat-0.0.1.vsix
```

### Project Structure

```
├── src/
│   ├── extension.ts          # Main extension code
│   └── test/
│       └── extension.test.ts # Unit tests
├── dist/                     # Compiled output
├── out/                      # Test compilation
├── package.json             # Extension manifest
├── tsconfig.json            # TypeScript config
├── esbuild.js              # Build configuration
└── README.md               # This file
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Make** your changes and add tests
4. **Run** tests: `npm test`
5. **Commit** changes: `git commit -m 'Add amazing feature'`
6. **Push** to branch: `git push origin feature/amazing-feature`
7. **Open** a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Add unit tests for new features
- Update documentation
- Use conventional commit messages
- Test on multiple platforms

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [VS Code Extension API](https://code.visualstudio.com/api) - For the extension framework
- [GitHub Copilot](https://github.com/features/copilot) - For the AI chat interface
- [Windsurf Chat AI](https://windsurf.ai) - For the inspiration

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/copilot-terminal-in-chat/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/copilot-terminal-in-chat/discussions)
- **Email**: govind_sharma@live.com

---

**Made with ❤️ for developers who want terminal power in their AI chat**

⭐ **Star this repo** if you find it useful!
