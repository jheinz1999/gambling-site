const cloudinary = require('cloudinary');

const { db } = require('../data/db');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = {

  uploadImage: function(path) {

    return new Promise(function(resolve, reject) {

      cloudinary.v2.uploader.upload(path, async (err, result) => {

        if (err) {

          resolve(null);

        }

        else {
          await db.insert({ img_url: result.url }).into('images');
          const image = await db.select().from('images').where('img_url', result.url).first();
          resolve(image.id);

        }

      });

    });

  }

}
