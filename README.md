This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

### Requirements

- Docker
- hasura-cli
- NodeJS v14.15.4

## Getting Started

* Copy `.env.example` to `.env`
* Run `npm install`

### Configure Hasura

* Run `docker-compose up -d`
* Go to `src/db/hasura` folder
* If you want to use hasura and check the dashboard, install hasura-cli and run `hasura console` from there.
* In order to create db structure apply migrations and metadata by the following command from there:

```
hasura migrate apply
hasura metadata apply
```

### Configure Prisma

* Run `npx prisma generate` from `src/db/prisma` folder

### Start development server

```bash
npm run dev
```

