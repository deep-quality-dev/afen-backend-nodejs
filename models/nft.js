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
    afenPrice: {
      type: Number,
      required: true,
    },
    nftPrice: {
      type: Number,
      required: true,
    },
    minimunBid: {
      type: Number,
      default: 0,
    },
    height: {
      type: Number,
    },
    width: {
      type: Number,
    },
    depth: {
      type: Number,
    },
    wallet: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Nft', NftSchema);
