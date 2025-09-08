# Change Log

All notable changes to the "copilot-terminal-in-chat" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [0.0.1] - 2025-09-08

### ✨ Added

- **Terminal Command Execution**: Execute any terminal command directly in Copilot Chat
- **Dynamic PC Name Detection**: Automatically detects and displays actual username and hostname
- **Path-Based Command Support**: Support for `./script.sh`, `/usr/bin/node`, `~/bin/tool` style commands
- **Smart Command Detection**: Intelligent detection of terminal commands vs natural language
- **Terminal-Like Output**: Clean, professional terminal window formatting with proper prompts
- **Installation Suggestions**: Automatic suggestions for missing commands (brew, apt, etc.)
- **Timeout Protection**: 30-second timeout to prevent hanging commands
- **Exit Code Display**: Visual indicators for command success/failure
- **Configuration Options**: Toggle default terminal behavior via settings
- **Comprehensive Testing**: Unit tests for command detection logic

### 🔧 Changed

- **Enhanced Command Detection**: Moved from hardcoded command list to dynamic, permissive detection
- **Improved Output Formatting**: Single terminal block display instead of fragmented output
- **Better Error Handling**: Specific error messages for different failure types
- **Updated Dependencies**: Added @vscode/vsce for packaging
- **Optimized Build Process**: Improved esbuild configuration

### 🐛 Fixed

- **Command Detection Accuracy**: Fixed false positives with natural language questions
- **Output Duplication**: Resolved duplicate terminal prompt display
- **Regex Complexity**: Simplified regex patterns to avoid linting errors
- **Import Issues**: Fixed test file imports and module resolution
- **Extension Packaging**: Resolved vsce packaging and installation issues

### 📚 Documentation

- **README Updates**: Comprehensive documentation of features and usage
- **Code Comments**: Improved inline documentation
- **GitHub Preparation**: Proper .gitignore configuration for repository

### 🧪 Testing

- **Unit Tests**: Added tests for command detection logic
- **Test Coverage**: Tests for various command patterns and edge cases
- **CI/CD Ready**: Repository prepared for automated testing

## [Unreleased]

### 🚀 Planned Features

- Multi-line command support
- Command history in chat
- Custom shell selection
- Environment variable management
- File upload/download integration

---

**Legend:**

- ✨ Added - New features
- 🔧 Changed - Changes in existing functionality
- 🐛 Fixed - Bug fixes
- 📚 Documentation - Documentation updates
- 🧪 Testing - Testing related changes
