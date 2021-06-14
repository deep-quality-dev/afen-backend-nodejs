const mongoose = require('mongoose');

const { Schema } = mongoose;
const NftSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    liked_by: {
      type: Array,
      default: [],
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    posted_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Article', NftSchema);