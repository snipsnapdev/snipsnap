# Configure Hasura
## Requirements

- Docker
- hasura-cli
- Node.js 14

## Launch

1. **Start containers**.

   Run the following command from `templates` folder to create and start containers in `debug` mode:
   ```bash
   docker-compose up -d
   ```

   For Mac computers with M1 Chip use command:
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.arm64.yml up -d
   ```
3. **Go to `templates/hasura` folder**.
4. **Run `hasura` dashboard**.

   If you want to use hasura and check the dashboard, install hasura-cli and run:
   ```bash
   hasura console
   ```
5. **Create DB structure.**

   In order to create db structure apply migrations and metadata using the following command from there:

   ```bash
   hasura migrate apply
   hasura metadata apply
   ```

## Additional information
Hasura connects to databases, REST servers, GraphQL servers, and third party APIs to provide a unified realtime GraphQL API across all data sources. Read more in Hasura [documentation](https://hasura.io/docs/latest/graphql/core/).
