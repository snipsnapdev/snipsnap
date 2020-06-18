<p align="center">
<img width="100" src="https://user-images.githubusercontent.com/2697570/85011968-9ac90c80-b162-11ea-9960-1429cb5f409f.png" alt="Snipsnap Logo"/></p>
<h1 align="center">Snipsnap</h1>
<h3 align="center">The ultimate snippets collection and VS Code extension that automatically exposes all available snippets for every library you are using in your project.</h3>
<h4 align="center">
<a href="https://marketplace.visualstudio.com/items?itemName=snipsnapdev.snipsnap-vscode">Install for VS Code
</a>
</h4>

![out](https://user-images.githubusercontent.com/2697570/73568644-23bc0180-4469-11ea-8b64-843c7a9a92d2.gif)

<h2 align="center">Popular snippets</h2>
<table>
  <tbody>
    <td valign="middle" align="center">
<img width="100px" src="https://user-images.githubusercontent.com/2697570/82653674-db933b80-9c1f-11ea-9731-7b8e0d1ab05c.png" />
      <br>React
    </td>
    <td valign="middle" align="center"><img width="100px" src="https://user-images.githubusercontent.com/2697570/82653826-15644200-9c20-11ea-8fe8-b0db379c83a3.png"/>
      <br>Vue
    </td>
        <td valign="middle" align="center"><img width="100px" src="https://user-images.githubusercontent.com/2697570/82654143-90c5f380-9c20-11ea-9587-928a51c06839.png"/>
          <br>Gatsby
    </td>
    </td>
        <td valign="middle" align="center"><img width="100px" src="https://user-images.githubusercontent.com/2697570/85003657-c8a85400-b156-11ea-938e-8577eea635a6.jpg"/>
          <br>Next.js
    </td>
            <td valign="middle" align="center"><img width="100px" src="https://user-images.githubusercontent.com/2697570/82654470-147fe000-9c21-11ea-9975-a79b3721b8f6.png"/>
              <br>Redux
    </td>
                <td valign="middle" align="center"><img width="100px" src="https://user-images.githubusercontent.com/2697570/82654869-a2f46180-9c21-11ea-8034-71f63bcd8389.png"/>
              <br>Styled components
    </td>
    </tbody>
</table>

---
## Table of Contents
- [What problem Snipsnap is trying to solve?](https://github.com/snipsnapdev/snipsnap#what-problem-snipsnap-is-trying-to-solve)
- [Our plans and vision](https://github.com/snipsnapdev/snipsnap#how-it-works)
- [How it works](https://github.com/snipsnapdev/snipsnap#how-it-works)
- [Contributing](https://github.com/snipsnapdev/snipsnap#contributing)
- [Snippets Format](https://github.com/snipsnapdev/snipsnap#snippets-format)

## 🔥 What problem Snipsnap is trying to solve?

**Problem #1**

Almost every popular language has a lot of different libraries that people used to use. Some of them big, some are small. For each library you should keep in mind a lot of different syntax constructions in order to use them. Code snippets help to fix it, but you don't want to create and you will not install extensions for each small library. Instead of it we want to have single Snipsnap extension that will fetch relevant code snippets based on languages, packages you use in your current project.

**Problem #2**

Different snippets extensions follow different rules and use unpredictable shortcuts such as "rccp", "ecrp", 'impp' etc. Having those unreadable shortcuts don't allow you to actually search across all snippets you have for a specific case. We want to change it by [standartizing snippets format](https://github.com/snipsnapdev/snipsnap#snippets-format) and providing clean, predictable search syntax such as `library-name keyword`, so you can always type name of your library and get full list of snippets available for it.

**Problem #3**

Each IDE has individual snippets format that does not compatible with other IDEs. So having independent snippets format could allow us to create Snipsnap extensions for each popular IDEs and using converters transform snippets from one format to another.

## 🛠️ How it works
Snipsnap VS Code extension scans your package.json(or yarn.lock) and searches on the server available snippets for packages you have in the project. It means that you don't need anymore install different extensions with snippets for frameworks, libraries you use. 

Snipsnap extension creates `snipsnap.code-snippets` inside `.vscode` folder with all snippets, so snippets will be available even for other developers who did not install extension.

All snippets currently present in this repository and follow guidelines described below.

## 🗓️ Our plans and vision

Current version could be called as MVP and there just for the one purpose – test the idea and get first feedbacks. If you like extension - star the repository, tell us about your experience or [help us to improve the project](https://github.com/snipsnapdev/snipsnap#contributing).

We don't want to stop just on having snippets for Javascript. We want to make it standard for all popular languages and their package managers. So cover Ruby, Go, Python, PHP libraries also in our plans.

We believe that snippets could become a perfect solution for providing simple documentation and examples. Code snippets should become the part of packages repositories like README files. You build your library, you put snippets together with it in .snipsnap.json file and then we fetch it.

Having standartised collection could allow us to write extensions and coverters for all popular IDE's, that will finally make code snippets independent from IDE. Let's say in couple of years the new awesome IDE will be release, instead of writing whole batch of snippets for new IDE you will be able to just continue use Snipsnap and the collection you already created.

## 😇 Contributing

We encourage you to contribute to Snipsnap. Only with your help we can build really amazing collection of snippets that adapts to your needs. 

**🙏 Don't write same code twise, create snippet instead.**

1. [Fork](https://help.github.com/en/github/getting-started-with-github/fork-a-repo) the project.
2. If you add snippets for a new library - create folder inside `snippets/javascript` with the library name. Put inside that folder json file with your snippets. JSON file and folder name should be exactly the same as NPM package name, otherwise it won't work. If you update snippets, just find the right collection in the folder based on your library name and modify it.
3. Create your snippets by using the [described format](https://github.com/snipsnapdev/snipsnap#snippets-format).
4. Test your snippets in your real or test project by putting a file `test.code-snippets` inside `.vscode` folder. VS Code automaticaly will fetch those snippets so you can start use them.
4. Validate you snippets by running `npx snipsnapdev/snipsnap-importer validate` from your cloned snipsnap repository folder.
5. Create PR.

## 🧬 Snippets Format

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

```description``` - it's an optional field, but put there any information that could help you. Check examples of description for [lodash](https://github.com/snipsnapdev/snipsnap/blob/master/snippets/javascript/lodash/lodash.json) or [react-intersection-observer](https://github.com/snipsnapdev/snipsnap/blob/master/snippets/javascript/react-intersection-observer/react-intersection-observer.json)

<img width="300" src="https://user-images.githubusercontent.com/2697570/71843492-5241f900-30c4-11ea-9083-2781044d647a.png"/>
