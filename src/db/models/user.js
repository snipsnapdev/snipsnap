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

export default {
  model: User,
  schema: UserSchema,
};
