const mongoose = require('mongoose');

const { Schema } = mongoose;
const NftSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Article', NftSchema);