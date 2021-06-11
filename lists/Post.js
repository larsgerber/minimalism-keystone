const { Text, Relationship, Checkbox, Virtual } = require('@keystonejs/fields');
const { Markdown } = require('@keystonejs/fields-markdown');
const { CloudinaryAdapter } = require('@keystonejs/file-adapters');
const { CloudinaryImage } = require('@keystonejs/fields-cloudinary-image');

const fileAdapter = new CloudinaryAdapter({
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_KEY,
  apiSecret: process.env.CLOUDINARY_SECRET,
  folder: 'my-keystone-app',
});

function slugify(string) {
  return string
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

const postFields = {
  fields: {
    title: {
      type: Text,
      isRequired: true,
      isUnique: true,
    },
    link: {
      type: Virtual,
      resolver: item => `${slugify(item.title)}`,
    },
    body: {
      type: Markdown,
      isRequired: true,
    },
    // image: {
    //   type: CloudinaryImage,
    //   adapter: fileAdapter,
    // },
    publish: {
      type: Checkbox,
      isRequired: true,
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