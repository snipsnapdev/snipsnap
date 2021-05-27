<p align="center">
<img width="100" src="https://user-images.githubusercontent.com/2697570/118843423-568e4100-b8ca-11eb-8266-dac076d087e3.png" alt="Snipsnap Logo"/></p>
<h1 align="center">Snipsnap Templates</h1>
<h3 align="center">Manage, share and use code templates with cloud UI and VS Code Extension</h3>

<p align="center">
  <img src="https://img.shields.io/github/license/snipsnapdev/snipsnap"/>
  <a href="https://marketplace.visualstudio.com/items?itemName=snipsnapdev.snipsnap-vscode">
    <img alt="VS Code Marketplace" src="https://img.shields.io/visual-studio-marketplace/v/snipsnapdev.snipsnap-vscode"></a>
  <a href="https://marketplace.visualstudio.com/items?itemName=snipsnapdev.snipsnap-vscode">
    <img alt="VS Code Marketplace Downloads" src="https://img.shields.io/visual-studio-marketplace/d/snipsnapdev.snipsnap-vscode"></a>
  <a href="https://twitter.com/snipsnap_dev"><img src="https://img.shields.io/twitter/follow/snipsnap_dev?style=social"/></a>
</p>

<h3 align="center"><a href="https://templates.snipsnap.dev/">Visit Home Page</a></h3>


<p align="center"><a href="https://youtu.be/G7J_rWiMzwE">
<img width="500px" src="https://user-images.githubusercontent.com/2697570/118845264-eaacd800-b8cb-11eb-83ef-eb293180ac53.jpg" alt="Getting started with Snipsnap"/>
</a></p>

---
## Table of Contents
- [What problem Snipsnap Templates is trying to solve?](https://github.com/snipsnapdev/snipsnap/tree/master/templates#-what-problem-snipsnap-is-trying-to-solve)
- [How it works](https://github.com/snipsnapdev/snipsnap/tree/master/templates#%EF%B8%8F-how-it-works)
- [Features](https://github.com/snipsnapdev/snipsnap/tree/master/templates#-features)
- [Use cases](https://github.com/snipsnapdev/snipsnap/blob/master/templates/docs/use-cases.md)
- [Contributing](https://github.com/snipsnapdev/snipsnap/tree/master/templates#-contributing)



## 🔥 What problem Snipsnap is trying to solve?

Snipsnap Templates could help you create a flexible folder and file structures that you can easily recreate just with a few clicks with VS Code Extension. 

Nowadays we spend a lot of time creating boilerplate code structures whether we work with **React** or **Devops** tools such as Kubernetes.

Check our [uses cases section](https://github.com/snipsnapdev/snipsnap/blob/master/templates/docs/use-cases.md) to see how Snipsnap can help you to boost your productivity.

Imagine you've just started your new project with React. Probably you will have the following structure for every new component

```jsx
my-example
-- index.js
-- my-example.js
-- my-example.css
```

Each of those files will have a predictable boilerplate code structure based on the component name. 

```jsx
import React from 'react';
import PropTypes from 'prop-types';

import styles from './my-example.css';

const MyExample = (props) => (
  <div className={cx('wrapper')}>

  </div>
)

MyExample.propTypes = {

};

MyExample.defaultProps = {

};

export default MyExample;
```

index.js file will have just an import of that component

```jsx
export { default } from './my-example';
```

The example above is a simple scenario however it easily could go beyond that by having

```jsx
my-example
-- index.js
-- my-example.js
-- my-example.container.js
-- my-example.stories.js
-- my-example.css
```

We have few options to manage it

- Create manually every file and folder one by one;
- Copy and paste from other places folders/files and then replace names where it's necessary
- Create manually every file, but then use code snippets to fill the content inside those files with boilerplate constructions.

All of those options require a lot of actions and can't prevent you from having just simple mistakes over copy-pasting or typos.

That where **Snipsnap Templates** starts to shine.

## 🛠️ How it works?

With a simple Cloud UI and VS Code Extension you can create **Code Templates** - set of reproducible files/folders structures boosted with template engine. 

- Drop files into Cloud file browser
- Define user prompts(inputs) that user will be asked during the process of template creation. eg. "Please type a component name" and assign those values to variables you can use with template engine
- Use variables within file/folder names or their content like `{{ componentName }}` or apply case conversion `{{toKebabCase componentName}}`
- Save it and recreate it easily with VS Code extension from the context menu of your file browser by clicking "Create from Template"

Once you've created it you can share it with the team, or share it with the world, so everyone could use it.

## ⚡ Features
### Prompts
Define user prompts(inputs) and assign them to variables you can later use in your file/folder names and content.

### Template Engine Support
Snipsnap uses Handlebars so every user prompts could be accesible via template variables by using this `{{ componentName }}` syntax.
Also you can apply one of case conversion helpers:
- toCamelCase
- toSnakeCase
- toKebabCase
- toUpperCase
- toLowerCase
- toPascalCase

Example usage: ``{{ toCamelCase componentName}}``.

In the future we aim to add more helpers as well as a support of different variable types for prompts, so you will be able to use more complicated conditional logic or loop iterations in your templates.

### Groups
Organize your code templates with groups by project, company, technology. 

### Share
Use share button near with the Group or Template to give access to your friends or team members.

### Marketplace and Public templates
Make template publicly available if you think it could help someone to boost their productivity.

## 😇 Contributing

We encourage you to contribute to Snipsnap Templates. Only with your help we can build really amazing product. Let us know about your feedback by creating an issue or messaging us to info@snipsnap.dev

Want to run it locally and help with the development - contact us and we will help you set it up.
