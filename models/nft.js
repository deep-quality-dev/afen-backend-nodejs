const mongoose = require('mongoose');

const { Schema } = mongoose;
const NftSchema = new Schema(
  {
    fileHash: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    isAuction: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      required: true,
    },
    minimunBid: {
      type: Number,
      default: 0,
    },
    properties: {
      height: {
        type: Number,
        required: true,
      },
      width: {
        type: Number,
        required: true,
      },
      depth: {
        type: Number,
        required: true,
      },
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Nft', NftSchema);
