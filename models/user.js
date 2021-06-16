const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;
const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    wallet: {
      type: String,
      required: true,
      unique: true,
    },
    portfolio: {
      type: String,
    },
    instagram: {
      type: String,
    },
    twitter: {
      type: String,
    },
    description: {
      type: String,
    },
    avatar: {
      type: String,
    },
    banner: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('User', UserSchema);
