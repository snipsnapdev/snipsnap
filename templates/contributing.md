# How to Contribute
This documentation will guide you through project contributing process.


## Commit Messages
We use conventional commits in our project development. The Conventional Commits specification is a lightweight convention on top of commit messages. It provides an easy set of rules for creating an explicit commit history; which makes it easier to write automated tools on top of.

We opted in for CC because they make it easier for team members to work on projects by allowing them to explore a more structured commit history. Also CC comes in handy when we want to automate routine tasks on certain projects, such as generating CHANGELOG, triggering build and publishing processes, determining a semantic version bump etc. [Read more](https://www.conventionalcommits.org/en/v1.0.0/)

## Structure Guide
### Project Structure
We follow the structure below for our project:
```text
├── src
|   ├── api 
│   ├── components
│   │  ├── pages — React components that are being used specifically on a certain page
│   │  └── shared — React components that are being used across the whole website
|   ├── contexts
|   ├── db
|   |  └── models
│   ├── hooks
│   ├── icons 
│   ├── layouts
│   ├── pages
│   ├── styles
│   └── utils
├── public
|   ├── images — Images cached locally and accessed using absolute path.
|   ├── videos — Videos cached locally and accessed using absolute path.
│   └── fonts - Self-hosted fonts
├── next.config.js — This file is created for setting custom advanced behavior of Next.js. It gets used by the Next.js server and build phases, and it's not included in the browser build. Read more about it at Next.js documentation page - https://nextjs.org/docs/api-reference/next.config.js/introduction
├── sentry.client.config.js — This file configures the intialization of Sentry on the browser. The config here will be used whenever a page is visited. Read more at - https://docs.sentry.io/platforms/javascript/guides/nextjs/
└── sentry.server.config.js — This file configures the initialization of Sentry on the server. The config here will be used whenever the server handles a request. Read more at - https://docs.sentry.io/platforms/javascript/guides/nextjs/
```
### Component Folder Structure

 #### Each component includes:

1. Main JavaScript File
2. SASS File
3. Index File

#### Each component optionally may include:

1. Folder with images
2. Folder with icons

#### Also, each component may include another component that follows all above listed rules.

#### Example structure

```bash
component
├── nested-component
│  ├── images
│  │  └── image.png
│  ├── icons
│  │  └── icon.svg
│  ├── nested-component.jsx
│  ├── nested-component.module.scss
│  └── index.js
├── images
│  └── image.png
├── icons
│  └── icon.svg
├── component.jsx
├── component.module.scss
└── index.js
```

## Naming

### Folders and files

We use `kebab-case` convention for naming folders and files:

```text
//wrong
myComponent/myComponent.jsx

//wrong
my_component/my_component.jsx

//correct
my-component/my-component.jsx
```

### CSS files

CSS files processed by CSS modules should be with `.module` postfix.

```text 
home.module.css
```

### SVG

SVG that should be processed and imported inline in React should have postfix `.inline`

### CSS Properties

In CSS files all properties should be in kebab-case.

```text
//wrong
.myClass

//correct
.my-class
```


## Code Style

### ES Lint

[ES Lint](https://eslint.org/) helps to find and fix code style issues and force developers to follow same rules. Current configuration is based on [Airbnb style guide](https://github.com/airbnb/javascript).

Additional commands:

```bash
npm run lint
```

Run it to check the current status of eslint issues across project.

```bash
npm run lint:fix
```

Run it to fix all possible issues.

### Prettier

[Prettier](https://prettier.io/) helps to format code based on defined rules. [Difference between Prettier and ESLint](https://prettier.io/docs/en/comparison.html).

Additional commands:

```bash
npm run format
```

Run it to format all files across the project.



