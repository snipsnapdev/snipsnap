# Snipsnap Templates - Frontend 

## Table of Contents
- [Overview](#overview)
- [Technologies](#technologies)
- [Launch](#launch)
  - [Requirements](#requirements)
  - [Getting started](#getting-started)
  - [Start GraphQL server](#start-graphql-server)
  - [Configure Hasura](#configure-hasura)
  - [Start development server](#start-development-server)
  - [Start production server](#start-production-server)
- [Project Structure](#project-structure)
- [Component Folder Structure](#component-folder-structure)
  - [Example structure](#example-structure)
- [Code Style](#code-style)
  - [ESLint](#eslint)
  - [Prettier](#prettier)
  - [VS Code](#vs-code)
- [Contributing](#contributing)

## Overview
This is a Frontend Part of the [**Snipsnap Templates**](https://templates.snipsnap.dev/) project which allows you to manage, share and use code templates. 

## Technologies
  The frontend part of the project is build using:
- Next.js
- React.js
- GraphQL

## Launch
### Requirements

- Docker
- hasura-cli
- Node.js 14

### Getting Started
1. **Clone this repository**

   ```bash
   git clone https://github.com/snipsnapdev/snipsnap.git
   ```

2. **Duplicate `.env.example` file at the root and rename it into `.env`**

### Start GraphQL server
Navigate to `templates/graphql` folder and follow [instructions](https://github.com/snipsnapdev/snipsnap/blob/master/templates/graphql/README.md) on how to run the **Appolo GraphQL Server**. 


### Configure Hasura

Read our [guide](https://github.com/snipsnapdev/snipsnap/tree/master/templates/hasura) on how to configure **Hasura** and create **docker containers**.

### Start development server
1. **Install dependencies.**
   
   From `templates/frontend` folder run the following commands to install dependencies:
   ```bash
   npm install
   ```

2. **Run project.**

   ```bash
   npm run dev
   ```

   The project is now running at: `http://localhost:3000`.

### Start production server
1. **Build the project.**
   ```bash
   npm run build
   ```
2. **Serve built project.**
   ```bash
   npm run start
   ```



## Project Structure
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

## Component Folder Structure

### Each component includes

1. Main JavaScript File
2. SASS File
3. Index File

### Each component optionally may include

1. Folder with images
2. Folder with icons

Also, each component may include another component that follows all above listed rules.

### Example structure

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

## Code Style

### ESLint

[ESLint](https://eslint.org/) helps find and fix code style issues and force developers to follow same rules. Current configuration is based on [Airbnb style guide](https://github.com/airbnb/javascript).

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

### VS Code

Following extensions required to simplify the process of keeping the same code style across the project:

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

After installation enable "ESLint on save" by adding to your VS Code settings.json the following line:

```json
"editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
}
```

You can navigate to settings.json by using Command Pallete (CMD+Shift+P) and then type "Open settings.json".

To enable Prettier go to Preferences -> Settings -> type "Format". Then check that you have esbenp.prettier-vscode as default formatter, and also enable "Format On Save".

Reload VS Code and auto-format will work for you.

## Contributing
We encourage you to contribute to Snipsnap Templates. Only with your help we can build really amazing product. Let us know about your feedback by creating an issue or messaging us to info@snipsnap.dev

Check out our [Contributing Guide](https://github.com/snipsnapdev/snipsnap/blob/master/templates/contributing.md) for details.
