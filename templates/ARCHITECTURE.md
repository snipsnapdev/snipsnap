## Snipsnap Templates

Architecture will help you better understand how different parts of the system work together.

Templates project contains 5 different parts:

- Next.js project - `/frontend`
- Hasura - `/hasura`
- Apollo Graphql server - `/graphql`
- VS Code extension - `/vscode-extension`
- Timescale DB (PostgreSQL)

### Architecture Diagram

![architecture](https://user-images.githubusercontent.com/2697570/120621631-5790a800-c45e-11eb-91f9-b53afac8aeff.jpg)

### Next.js 

[Next.js](https://nextjs.org/) project responsible for frontend of the Cloud UI. It handles as well general authentification logic with a help of [next-auth](https://github.com/nextauthjs/next-auth).
For authentification we use Session Based Authentification + JWT. 

### Hasura

[Hasura](https://hasura.io/) - the key component of the system is a wonderful Hasura Graphql engine. Hasura creates a graphql layer on top of PostgreSQL and auto generates queries and mutations. 

Hasura has a built-in support of JWT, so all graphql endpoints protected by set of permissions that you can easily configure with Hasura Console.

Also helps us manage database migrations. 

All queries to the database goes through Hasura. 

### Apollo Graphql server

The best way of handling custom business logic and validation with Hasura is to run a separate Graphql Server near by and add it as a [Remote Schema](https://hasura.io/docs/latest/graphql/core/remote-schemas/index.html) to Hasura Graphql Engine.
This way we continue to keep Hasura as a single point of access for all graphql request protected by Hasura auth layer.

### TimescaleDB (PostgreSQL)

[TimescaleDB](https://www.timescale.com/) is an amazing extension for PostgreSQL that helps to increase the performance for time-series data. Generally speaking it is still well familiar PostgreSQL with the same syntax.
We decided to use it since we plan to gather stats for marketplace visualisation and measure usage of popular templates.
Later on we want to add stats for "Clone" action, and visualize it more for public available templates in marketplace. 

### VS Code extension

That part speaks for itself, VS Code extension talks with Hasura Graphql Engine and fetch user's templates, process them and creates when it's requested.
