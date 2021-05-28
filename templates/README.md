<p align="center">
<img width="100" src="https://user-images.githubusercontent.com/2697570/118843423-568e4100-b8ca-11eb-8266-dac076d087e3.png" alt="Snipsnap Logo"/></p>
<h1 align="center">Snipsnap Templates</h1>
<h3 align="center">Manage, share and use code templates with cloud UI and VS Code Extension</h3>

<p align="center">
  <img src="https://img.shields.io/github/license/snipsnapdev/snipsnap"/>
  <a href="https://marketplace.visualstudio.com/items?itemName=snipsnapdev.snipsnap-templates-vscode">
    <img alt="VS Code Marketplace" src="https://img.shields.io/visual-studio-marketplace/v/snipsnapdev.snipsnap-templates-vscode"></a>
  <a href="https://marketplace.visualstudio.com/items?itemName=snipsnapdev.snipsnap-vscode">
    <img alt="VS Code Marketplace Downloads" src="https://img.shields.io/visual-studio-marketplace/d/snipsnapdev.snipsnap-templates-vscode"></a>
  <a href="https://twitter.com/snipsnap_dev"><img src="https://img.shields.io/twitter/follow/snipsnap_dev?style=social"/></a>
</p>

<h4 align="center"><a href="https://templates.snipsnap.dev/">Visit Home Page</a> • <a href="https://marketplace.visualstudio.com/items?itemName=snipsnapdev.snipsnap-templates-vscode">Install VS Code Extension</a></h4>

![snipsnap-templates-demo](https://user-images.githubusercontent.com/2697570/119970573-30466080-bfb0-11eb-9455-21c5d7e2561e.gif)

---

## Table of Contents

- [What problem Snipsnap Templates is trying to solve?](https://github.com/snipsnapdev/snipsnap/tree/master/templates#-what-problem-snipsnap-is-trying-to-solve)
- [How it works](https://github.com/snipsnapdev/snipsnap/tree/master/templates#%EF%B8%8F-how-it-works)
- [Features](https://github.com/snipsnapdev/snipsnap/tree/master/templates#-features)
- [Use cases](https://github.com/snipsnapdev/snipsnap/blob/master/templates/docs/use-cases.md)
- [Contributing](https://github.com/snipsnapdev/snipsnap/tree/master/templates#-contributing)

## 🚀 Getting Started

<a href="https://youtu.be/G7J_rWiMzwE">
<img width="500px" src="https://user-images.githubusercontent.com/2697570/118845264-eaacd800-b8cb-11eb-83ef-eb293180ac53.jpg" alt="Getting started with Snipsnap"/>
</a>

## 🔥 What problem Snipsnap is trying to solve?

Snipsnap Templates could help you create a flexible folder and file structures that you can easily recreate with just a few clicks using the [VS Code Extension](https://marketplace.visualstudio.com/items?itemName=snipsnapdev.snipsnap-templates-vscode).

Nowadays we spend a lot of time creating boilerplate code structures whether we work with **React** or **Devops** tools such as Kubernetes.

Check our [uses cases section](https://github.com/snipsnapdev/snipsnap/blob/master/templates/docs/use-cases.md) to see how Snipsnap can help you to boost your productivity.

Imagine you've just started your new project with React. Probably you will have the following structure for every new component:

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

`index.js` file will have just an import of that component

```jsx
export { default } from "./my-example";
```

The example above is a simple scenario however it could easily go beyond that by having

```jsx
my-example
-- index.js
-- my-example.js
-- my-example.container.js
-- my-example.stories.js
-- my-example.css
```

We have several options to manage it:

- Create every file and folder from scratch one by one;
- Copy and paste folders and files from other places and replace names where necessary
- Create files and folders from scratch, but then use code snippets to fill the content inside those files with boilerplate constructions.

All of these options require a lot of actions and can't prevent you from having just simple mistakes over copy-pasting or typos.

That where **Snipsnap Templates** starts to shine.

## 🛠️ How it works?

With a simple [Cloud UI](https://templates.snipsnap.dev/) and [VS Code Extension](https://marketplace.visualstudio.com/items?itemName=snipsnapdev.snipsnap-templates-vscode) you can create **Code Templates** - sets of reproducible file/folder structures boosted with template engine.

To create a template:

- Drop files into Cloud file browser
- Define user prompts(inputs) that the user will be asked to enter while using the template in VS Code (e.g., "Please type a component name") and assign their values to variables you can use with template engine
- Use variables within files and folders names or their content like `{{ componentName }}` or apply case conversion `{{toKebabCase componentName}}`
- Save the template. Now you could easily recreate it with the [VS Code extension](https://marketplace.visualstudio.com/items?itemName=snipsnapdev.snipsnap-templates-vscode). All your templates will be available from the context menu of your VS Code file browser under "Create from Template".

Once you've created a template, you can share it with your team, or make it publicly available so everyone could use it.

## ⚡ Features

### Prompts

Define user prompts(inputs) and assign them to variables you can later use in your file/folder names and content.

### Template Engine Support

Snipsnap uses Handlebars so every user prompts could be accesible via template variables by using this `{{ componentName }}` syntax.
Also you can apply one of the case conversion helpers:

- toCamelCase
- toSnakeCase
- toKebabCase
- toUpperCase
- toLowerCase
- toPascalCase

Example usage: `{{ toCamelCase componentName}}`.

In the future we aim to add more helpers as well as a support of different variable types for prompts, so you will be able to use more complicated conditional logic or loop iterations in your templates.

### Groups

Organize your code templates into groups by project, company, technology.

### Share

Use share button near with the Group or Template to give access to your friends or team members.

### Marketplace and Public templates

Make template publicly available if you think it could help someone to boost their productivity.

## 😇 Contributing

We encourage you to contribute to Snipsnap Templates. Only with your help we can build really amazing product. Let us know about your feedback by creating an issue or messaging us to info@snipsnap.dev

If you want to help with the development and run the project locally - contact us and we will help you set it up.
