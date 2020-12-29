This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

### Requirements

- Docker
- hasura-cli

## Getting Started

First, run the development server:

```bash
npm run dev
```

Copy `.env.example` to `.env`

Run `docker-compose up -d`

If you want to use hasura and check the dashboard, install hasura-cli and run `hasura console` from `src/db/hasura` folder.

In order to create db structure apply migrations and metadata by the following command

```
hasura migrate apply
hasura metadata apply
```

### How to create JWT Signing Key

```
npx node-jose-tools newkey -t oct -s 4096 -K -b -a HS512 > myKeySet.jwks
npx node-jose-tools findkey -b -j myKeySet.jwks
```

Then resulted output JSON convert to base64, we use it in order to don't bother with escaping symbols in env variables.

Then use `k` key from the key generated from node-jose-tools as a key in HASURA_GRAPHQL_JWT_SECRET variable
