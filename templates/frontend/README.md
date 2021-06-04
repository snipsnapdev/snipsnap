# Snipsnap Templates - Frontend 
## Overview
This is a Frontend Part of the [**Snipsnap Templates**](https://templates.snipsnap.dev/) project which allows you to manage, share and use code templates. 

## Technlogies
- Next.js
- React.js
- GraphQL

## Launch
### Requirements

- Docker
- hasura-cli
- NodeJS v14.15.4

### Getting Started
1. Clone this repository

```bash
git clone git@github.com:pixel-point/gatsby-starter.git
```

2. Install dependencies

```bash
npm install
```

3. Copy .env.example and rename it into .env

### Start GraphQL server
1. Go to `templates/graphql` folder
2. Install dependecies: 
```bash
npm install
```
3. Run GraphQL server: 
```bash
nodemon index.js
```

### Configure Hasura

1. Run `docker-compose up -d` command from the root of `templates` folder
2. Go to `templates/hasura` folder
3. If you want to use hasura and check the dashboard, install hasura-cli and run `hasura console` from there.
4. In order to create db structure apply migrations and metadata by the following command from there:

```
hasura migrate apply
hasura metadata apply
```

### Start development server
From `templates/frontend` folder run the following commands to install dependencies and start the project in development mode: 

```bash
npm install
npm run dev
```

### Start production server
Run following commands from `templates/frontend` to build the project and start it in production server:
```bash
npm run build
npm run start
```



## Project Structure
```text
├── src
│   ├── components
│   │  ├── pages — React components that are being used specifically on a certain page
│   │  └── shared — React components that are being used across the whole website
│   ├── hooks
│   ├── images — Images that are being quired using graphql. Read more about it here — gatsbyjs.org/docs/working-with-images. Also note, that folder structure should be equal to the structure of components folder
│   ├── layouts
│   ├── pages
│   ├── styles
│   ├── templates
│   ├── utils
│   └── html.js — HTML template for all generated pages. Read more about it here — gatsbyjs.org/docs/custom-html
├── static
│   └── fonts - Self-hosted fonts
├── gatsby-browser.js — This file is where Gatsby expects to find any usage of the Gatsby browser APIs (if any). These allow customization/extension of default Gatsby settings affecting the browser. Read more about it here — gatsbyjs.org/docs/browser-apis
├── gatsby-config.js — This is the main configuration file for a Gatsby site. This is where you can specify information about your site (metadata) like the site title and description, which Gatsby plugins you’d like to include, etc. Read more about it here — gatsbyjs.org/docs/gatsby-config
├── gatsby-node.js — This file is where Gatsby expects to find any usage of the Gatsby Node APIs (if any). These allow customization/extension of default Gatsby settings affecting pieces of the site build process. Read more about it here — gatsbyjs.org/docs/node-apis
└── gatsby-ssr.js — This file is where Gatsby expects to find any usage of the Gatsby server-side rendering APIs (if any). These allow customization of default Gatsby settings affecting server-side rendering. Read more about it here — gatsbyjs.org/docs/ssr-apis
```
