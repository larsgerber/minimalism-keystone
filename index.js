const { Keystone } = require('@keystonejs/keystone');
const { PasswordAuthStrategy } = require('@keystonejs/auth-password');
const { Text, Checkbox, Password } = require('@keystonejs/fields');
const { GraphQLApp } = require('@keystonejs/app-graphql');
const { AdminUIApp } = require('@keystonejs/app-admin-ui');
const initialiseData = require('./initial-data');
const dotenv = require('dotenv').config()

const { createdAt, updatedAt } = require('@keystonejs/list-plugins');

const { MongooseAdapter: Adapter } = require('@keystonejs/adapter-mongoose');
const PROJECT_NAME = 'Lars Gerber';
const adapterConfig = { mongoUri: process.env.MONGO_URI };

const keystone = new Keystone({
  adapter: new Adapter(adapterConfig),
  onConnect: process.env.CREATE_TABLES !== 'true' && initialiseData,
  cookie: {
    secure: false, // Default to true in production
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    sameSite: false,
  },
  cookieSecret: process.env.COOKIE_SECRET,
});

// Access control functions
const userIsAdmin = ({ authentication: { item: user } }) => Boolean(user && user.isAdmin);
const userOwnsItem = ({ authentication: { item: user } }) => {
  if (!user) {
    return false;
  }

  // Instead of a boolean, you can return a GraphQL query:
  // https://www.keystonejs.com/api/access-control#graphqlwhere
  return { id: user.id };
};

const userIsAdminOrOwner = auth => {
  const isAdmin = access.userIsAdmin(auth);
  const isOwner = access.userOwnsItem(auth);
  return isAdmin ? isAdmin : isOwner;
};

const access = { userIsAdmin, userOwnsItem, userIsAdminOrOwner };

keystone.createList('User', {

  fields: {
    name: {
      type: Text,
      access: {
        read: true,
        auth: false,
      }
    },
    email: {
      type: Text,
      isUnique: true,
      access: {
        read: access.userIsAdminOrOwner,
        update: access.userIsAdminOrOwner,
        create: access.userIsAdmin,
        delete: access.userIsAdmin,
        auth: true,
      },
    },
    isAdmin: {
      type: Checkbox,
      access: {
        read: access.userIsAdminOrOwner,
        update: access.userIsAdmin,
        create: access.userIsAdmin,
        delete: access.userIsAdmin,
        auth: true,
      },
    },
    password: {
      type: Password,
      access: {
        read: access.userIsAdminOrOwner,
        update: access.userIsAdminOrOwner,
        create: access.userIsAdmin,
        delete: access.userIsAdmin,
        auth: true,
      },
    },
  },
});

const authStrategy = keystone.createAuthStrategy({
  type: PasswordAuthStrategy,
  list: 'User',
  config: { protectIdentities: process.env.NODE_ENV === 'production' },
});

const PostSchema = require('./lists/Post')

keystone.createList('Post', {
  fields: PostSchema.fields,
  access: {
    read: true,
    create: access.userIsAdminOrOwner,
    update: access.userIsAdminOrOwner,
    delete: access.userIsAdminOrOwner,
  },
  labelField: 'title',
  plugins: [
    createdAt(),
    updatedAt(),
  ],
})

const ImageSchema = require('./lists/Image')

keystone.createList('Image', {
  fields: ImageSchema.fields,
  access: {
    read: true,
    create: access.userIsAdminOrOwner,
    update: access.userIsAdminOrOwner,
    delete: access.userIsAdminOrOwner,
  },
  labelField: 'name',
})

module.exports = {
  keystone,
  apps: [
    new GraphQLApp(),
    new AdminUIApp({
      name: PROJECT_NAME,
      enableDefaultRoute: true,
      hooks: require.resolve('./admin/'),
      authStrategy,
    }),
  ],
};
