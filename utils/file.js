const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const uuid = require('uuid');

const config = require('../config');

const s3 = new AWS.S3({
  accessKeyId: config.AWS_ACCESS_KEY,
  secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
});

const fileUpload = file =>
  new Promise((resolve, reject) => {
    const filePath = __dirname + file.name;

    file.mv(filePath, err => {
      if (err) {
        resolve({
          status: 'error',
          error: err,
        });
      }

      s3.upload(
        {
          Bucket: config.S3_BUCKET_NAME,
          Key: `${uuid.v4()}${path.extname(filePath)}`,
          Body: fs.readFileSync(filePath),
          ACL: 'public-read',
        },
        (error, data) => {
          if (error)
            resolve({
              status: 'error',
              error,
            });

          fs.unlink(filePath, e => {
            if (e) {
              console.log('Error: Unable to delete file.', err);
            }
          });

          resolve({
            status: 'success',
            path: data.Location,
          });
        },
      );
    });
  });

module.exports = {
  fileUpload,
};
