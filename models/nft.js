const mongoose = require('mongoose');

const { Schema } = mongoose;
const NftSchema = new Schema(
  {
    nftId: {
      type: String,
      required: true,
    },
    fileHash: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    royalty: {
      type: Number,
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
    },
    bnbPrice: {
      type: Number,
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
