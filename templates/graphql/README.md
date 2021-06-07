# Appolo Graphql server

### Requirements

- Node.js 14

### Getting Started

1. Copy `.env.example` to `.env`

```
HASURA_GRAPHQL_URL=http://localhost:3010/v1/graphql
HASURA_ADMIN_SECRET=myadminsecretkey
JWT_SECRET=eyJrdHkiOiJvY3QiLCJraWQiOiJ1WG5Ub21VaDcwVm15V0U4RmVoR0tpX2JWaTk2UEtSejExWUVTUEV2cWdNdVhuVG9tVWg3MFZteVdFOEZlaEdLaV9iVmk5NlBLUnoxMVlFU1BFdnFnTSIsImFsZyI6IkhTNTEyIiwiayI6IjMwOXFTY3JfSE1FYk
```

HASURA_GRAPHQL_URL - Url to Hasura Graphql Engine.

HASURA_ADMIN_SECRET - Admin Secret grants full acess to queries and mutations.

JWT_SECRET - JWT Secret used in this service for the purpose of signing API Tokens that we keep as JWT.

2. Install dependencies

```
npm install
```

3. Run the server

```
npm run dev
```

By default Graphql Server uses 4000 port. If everything goes well you will see the message `🚀 Server ready at http://localhost:4000/`

### Additional information

Appollo Graphql server acts as a Remote Schema for Hasura Graphql Engine and handles custom business logic and validation.
Check [architecture documentation](https://github.com/snipsnapdev/snipsnap/blob/master/templates/ARCHITECTURE.md) to get better understanding of the role of this service.


