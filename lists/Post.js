const { Text, Select, Relationship } = require('@keystonejs/fields');
const { Markdown } = require('@keystonejs/fields-markdown');
const { CloudinaryAdapter } = require('@keystonejs/file-adapters');
const { CloudinaryImage } = require('@keystonejs/fields-cloudinary-image');

const fileAdapter = new CloudinaryAdapter({
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_KEY,
  apiSecret: process.env.CLOUDINARY_SECRET,
  folder: 'my-keystone-app',
});

const postFields = {
  fields: {
    title: {
      type: Text,
      isRequired: true,
    },
    body: {
      type: Markdown,
      isRequired: true,
    },
    image: {
      type: CloudinaryImage,
      adapter: fileAdapter
    },
    status: {
      type: Select,
      options: [
        { value: 'PUBLISHED', label: 'Published' },
        { value: 'UNPUBLISHED', label: 'Unpublished' },
      ],
      defaultValue: 'PUBLISHED',
    },
    author: {
      type: Relationship,
      ref: 'User',
      many: false,
      isRequired: true,
    },
  },
}

module.exports = postFields