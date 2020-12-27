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
