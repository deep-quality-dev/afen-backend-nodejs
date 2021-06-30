require('dotenv').config();

const {
  NODE_ENV,
  PORT,
  MONGO_URI,
  MONGO_URI_DEV,
  JWT_SECRET,
  JWT_EXPIRE_MINUTES,
  APP_NAME,
  MAIL_SENDER,
  MAIL_SENDER_PASS,
  IPFS_HOST,
  AWS_ACCESS_KEY,
  AWS_SECRET_ACCESS_KEY,
  S3_BUCKET_NAME,
  REDIS_URL,
} = process.env;

module.exports = {
  port: PORT,
  mongoURI: NODE_ENV === 'production' ? MONGO_URI : MONGO_URI_DEV,
  secretOrKey: JWT_SECRET,
  jwtExpireMinutes: Number(JWT_EXPIRE_MINUTES),
  appName: APP_NAME,
  emailSender: {
    service: 'Gmail',
    auth: {
      user: MAIL_SENDER,
      pass: MAIL_SENDER_PASS,
    },
  },
  IPFS_HOST,
  AWS_ACCESS_KEY,
  AWS_SECRET_ACCESS_KEY,
  S3_BUCKET_NAME,
  redis_url: REDIS_URL,
};
