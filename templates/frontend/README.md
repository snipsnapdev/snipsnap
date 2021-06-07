# Snipsnap Templates - Frontend 

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

## Contributing
We encourage you to contribute to Snipsnap Templates. Only with your help we can build really amazing product. Let us know about your feedback by creating an issue or messaging us to info@snipsnap.dev

Fork the repository, make some changes, submit a pull-request! Check out our [Contributing Guide](https://github.com/snipsnapdev/snipsnap/blob/master/templates/contributing.md) for details.
