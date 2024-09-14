const { Text, Relationship, Checkbox, Slug } = require('@keystonejs/fields');
const { Markdown } = require('@keystonejs/fields-markdown');

const postFields = {
  fields: {
    title: {
      type: Text,
      isRequired: true,
      isUnique: true,
    },
    link: {
      type: Slug,
      from: 'title',
    },
    body: {
      type: Markdown,
      isRequired: true,
    },
    // image: {
    //   type: Relationship,
    //   ref: 'Image',
    //   many: true,
    // },
    publish: {
      type: Checkbox,
      isRequired: true,
    },
    authors: {
      type: Relationship,
      many: false,
      ref: 'User',
      isRequired: true,
    }
  },
}

module.exports = postFields