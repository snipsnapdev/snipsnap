<h1 align="center">Snipsnap</h1>
<h3 align="center">The ultimate snippets collection and VS Code extension that automatically exposes all available snippets for every library you are using in your project.</h3>
<h4 align="center">
<a href="https://marketplace.visualstudio.com/items?itemName=snipsnapdev.snipsnap-vscode">Install for VS Code
</a>
</h4>

![out](https://user-images.githubusercontent.com/2697570/73568644-23bc0180-4469-11ea-8b64-843c7a9a92d2.gif)

---
## Table of Contents
- [How it works](https://github.com/snipsnapdev/snipsnap#how-it-works)
- [Snippets Format](https://github.com/snipsnapdev/snipsnap#snippets-format)

## How it works
Snipsnap VS Code extension scans your package.json(or yarn.lock) and searches on the server available snippets for packages you have in the project. It means that you don't need anymore install different extensions with snippets for frameworks, libraries you use. 

Snipsnap extension creates `snipsnap.code-snippets` inside `.vscode` folder with all snippets, so snippets will be available even for other developers who did not install extension.

All snippets currently present in this repository and follow guidelines described below.

## Snippets Format

Snipsnap uses VS Code compatible snippet format, but has more strict rules to keep consistency across various libraries. 

Code snippet example: 

```json
{
  "prop-types-import": {
    "prefix": ["prop-types import", "impt"],
    "body": ["import PropTypes from 'prop-types'"],
    "scope": "javascript,javascriptreact"
}
```

```key``` – keywords that represent as better as possible the content of the snippet. Must be in kebab-case,lowercased. For example: prop-types-import".

```prefix``` – defines one or more trigger words which display the snippet in IntelliSense. Substring matching is performed on prefixes, so in this case, "fc" could match "for-const". Must be array of lowercased strings. The first prefix should have the format "{package-name} {keywords}", for example: "prop-types import", "react component arrow function". It used for better user experience since it allows you to search across snippets without knowing exact shortcut. Next prefixes should be lowercased.

```body``` – is one or more lines of content, which will be joined as multiple lines upon insertion. Newlines and embedded tabs will be formatted according to the context in which the snippet is inserted. Must be array of strings.

```scope``` - defines in which files the snippets will be available. Must be string with commaseparated language handlers. You could find them in VS Code Preferences -> User Snippets

<img width="300" src="https://user-images.githubusercontent.com/2697570/71843492-5241f900-30c4-11ea-9083-2781044d647a.png"/>
