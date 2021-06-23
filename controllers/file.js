const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const uuid = require('uuid');

const config = require('../config');

const s3 = new AWS.S3({
  accessKeyId: config.AWS_ACCESS_KEY,
  secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
});

exports.upload = async (req, res, next) => {
  try {
    if (!req.files.file) {
      return res.status(400).json({ message: 'File is missing' });
    }

    const file = req.files.file;
    const filePath = __dirname + file.name;

    file.mv(filePath, err => {
      if (err) {
        console.log('Error: failed to download file');
        return res.status(500).send(err);
      }

      s3.upload(
        {
          Bucket: config.S3_BUCKET_NAME,
          Key: `${uuid.v4()}${path.extname(filePath)}`,
          Body: fs.readFileSync(filePath),
          ACL: 'public-read',
        },
        (error, data) => {
          if (error) return res.status(500).send(err);

          fs.unlink(filePath, err => {
            if (err) {
              console.log('Error: Unable to delete file.', err);
            }
          });

          res.json({ path: data.Location });
        },
      );
    });
  } catch (e) {
    next(e);
  }
};
