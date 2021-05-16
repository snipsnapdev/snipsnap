import Adapters from 'next-auth/adapters';

// Extend the built-in models using class inheritance
class User extends Adapters.TypeORM.Models.User.model {
  constructor(name, email, image, emailVerified) {
    super(name, email, image, emailVerified);
  }
}

const UserSchema = {
  name: 'User',
  target: User,
  columns: {
    ...Adapters.TypeORM.Models.User.schema.columns,
    // Adds a user_id as UUID to the User schema
    userId: {
      type: 'uuid',
      nullable: false,
      default: `uuid_generate_v4()`,
    },
  },
};

// Hack in order to fix NextAuth bug in production https://github.com/nextauthjs/next-auth/issues/710
export default {
  model: Object.defineProperty(User, 'name', { value: 'User' }),
  schema: UserSchema,
};
