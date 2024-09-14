// const { Text} = require('@keystonejs/fields');
// const { CloudinaryAdapter } = require('@keystonejs/file-adapters');
// const { CloudinaryImage } = require('@keystonejs/fields-cloudinary-image');

// const fileAdapter = new CloudinaryAdapter({
//   cloudName: process.env.CLOUDINARY_CLOUD_NAME,
//   apiKey: process.env.CLOUDINARY_KEY,
//   apiSecret: process.env.CLOUDINARY_SECRET,
//   folder: 'my-keystone-app',
// });

// const imageFields = {
//   fields: {
//     name: {
//       type: Text,
//       isRequired: true,
//       isUnique: true,
//     },
//     image: {
//       type: CloudinaryImage,
//       adapter: fileAdapter,
//     },
//   },
// }

// module.exports = imageFields